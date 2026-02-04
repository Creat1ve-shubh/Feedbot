# Production-Grade CI/CD Pipeline Design

> **Optimal CI/CD strategy for Feedbot fullstack application**

---

## 🏗️ Overview

### Goals

- **Zero-downtime deployments**
- **Automated testing & quality gates**
- **Multi-environment support** (dev, staging, production)
- **Rollback capabilities**
- **Security scanning**
- **Performance monitoring**

### Tech Stack

- **CI/CD Platform**: GitHub Actions (free for public repos)
- **Container Registry**: AWS ECR
- **Orchestration**: AWS ECS Fargate (serverless containers)
- **Frontend Hosting**: Vercel (Next.js optimized)
- **Backend**: AWS ECS + ALB
- **Database**: AWS RDS PostgreSQL
- **Cache**: AWS ElastiCache Redis
- **Monitoring**: CloudWatch + Sentry
- **Secrets**: AWS Secrets Manager

---

## 📋 Pipeline Architecture

```
┌─────────────┐
│ Developer   │
│ Push Code   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│          GitHub Actions Workflow             │
├─────────────────────────────────────────────┤
│  Stage 1: Quality Checks (Parallel)         │
│  ├─ Lint (Backend & Frontend)               │
│  ├─ Type Check (TypeScript)                 │
│  ├─ Security Scan (Snyk/Trivy)              │
│  └─ Unit Tests                               │
├─────────────────────────────────────────────┤
│  Stage 2: Build & Test                      │
│  ├─ Build Docker Images (API & Worker)      │
│  ├─ Build Next.js App                       │
│  ├─ Integration Tests                       │
│  └─ E2E Tests (Playwright)                  │
├─────────────────────────────────────────────┤
│  Stage 3: Deploy to Staging                 │
│  ├─ Push Images to ECR                      │
│  ├─ Update ECS Task Definitions             │
│  ├─ Deploy Backend (ECS)                    │
│  ├─ Deploy Frontend (Vercel Preview)        │
│  └─ Run Smoke Tests                         │
├─────────────────────────────────────────────┤
│  Stage 4: Manual Approval (Production)      │
│  └─ Requires approval from maintainers      │
├─────────────────────────────────────────────┤
│  Stage 5: Deploy to Production              │
│  ├─ Blue-Green Deployment (ECS)             │
│  ├─ Database Migrations (if needed)         │
│  ├─ Deploy Frontend (Vercel)                │
│  ├─ Health Checks                           │
│  └─ Rollback on failure                     │
└─────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────┐
│  Post-Deployment    │
│  ├─ Notify Slack    │
│  ├─ Tag Release     │
│  └─ Update Docs     │
└─────────────────────┘
```

---

## 🔄 GitHub Actions Workflows

### 1. Main CI/CD Workflow

**.github/workflows/ci-cd.yml**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  workflow_dispatch:
    inputs:
      environment:
        description: "Target environment"
        required: true
        type: choice
        options:
          - staging
          - production

env:
  AWS_REGION: us-east-1
  ECR_REGISTRY: ${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.us-east-1.amazonaws.com
  NODE_VERSION: "20"
  PYTHON_VERSION: "3.11"

jobs:
  # ========================================
  # STAGE 1: Quality Checks (Parallel)
  # ========================================

  lint-backend:
    name: Lint Backend
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: ${{ env.PYTHON_VERSION }}

      - name: Install dependencies
        run: |
          cd backend
          pip install flake8 black mypy
          pip install -r requirements.txt

      - name: Run Black
        run: cd backend && black --check .

      - name: Run Flake8
        run: cd backend && flake8 . --max-line-length=120

      - name: Run MyPy
        run: cd backend && mypy . --ignore-missing-imports

  lint-frontend:
    name: Lint Frontend
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        run: cd frontend && npm ci

      - name: Run ESLint
        run: cd frontend && npm run lint

      - name: Type Check
        run: cd frontend && npm run type-check

  security-scan:
    name: Security Scan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: "fs"
          scan-ref: "."
          format: "sarif"
          output: "trivy-results.sarif"

      - name: Upload Trivy results to GitHub Security
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: "trivy-results.sarif"

      - name: Snyk Security Scan
        uses: snyk/actions/python@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

  test-backend:
    name: Test Backend
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: testdb
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

      redis:
        image: redis:7
        ports:
          - 6379:6379
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: ${{ env.PYTHON_VERSION }}

      - name: Cache pip packages
        uses: actions/cache@v4
        with:
          path: ~/.cache/pip
          key: ${{ runner.os }}-pip-${{ hashFiles('backend/requirements.txt') }}

      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
          pip install pytest pytest-cov pytest-asyncio

      - name: Run tests with coverage
        env:
          DB_HOST: localhost
          DB_PORT: 5432
          DB_NAME: testdb
          DB_USER: postgres
          DB_PASSWORD: postgres
          REDIS_URL: redis://localhost:6379/0
        run: |
          cd backend
          pytest tests/ -v --cov=. --cov-report=xml --cov-report=html

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v4
        with:
          files: ./backend/coverage.xml
          flags: backend

      - name: Archive coverage report
        uses: actions/upload-artifact@v4
        with:
          name: backend-coverage-report
          path: backend/htmlcov/

  test-frontend:
    name: Test Frontend
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        run: cd frontend && npm ci

      - name: Run unit tests
        run: cd frontend && npm run test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          files: ./frontend/coverage/lcov.info
          flags: frontend

  # ========================================
  # STAGE 2: Build & Integration Tests
  # ========================================

  build-backend:
    name: Build Backend Images
    runs-on: ubuntu-latest
    needs: [lint-backend, test-backend, security-scan]
    outputs:
      image-tag: ${{ steps.meta.outputs.tags }}
    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.ECR_REGISTRY }}/feedbot-api
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=sha,prefix={{branch}}-
            type=semver,pattern={{version}}

      - name: Build and push API image
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          file: ./backend/Dockerfile.api
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          build-args: |
            BUILD_DATE=${{ github.event.head_commit.timestamp }}
            VCS_REF=${{ github.sha }}

      - name: Build and push Worker image
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          file: ./backend/Dockerfile.worker
          push: true
          tags: ${{ env.ECR_REGISTRY }}/feedbot-worker:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  build-frontend:
    name: Build Frontend
    runs-on: ubuntu-latest
    needs: [lint-frontend, test-frontend]
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        run: cd frontend && npm ci

      - name: Build Next.js
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.STAGING_API_URL }}
        run: cd frontend && npm run build

      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: frontend-build
          path: frontend/.next/

  e2e-tests:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: [build-backend, build-frontend]
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Install Playwright
        run: |
          cd frontend
          npm ci
          npx playwright install --with-deps

      - name: Start test environment
        run: |
          cd backend
          docker compose -f docker-compose.test.yml up -d
          sleep 10

      - name: Run E2E tests
        run: cd frontend && npx playwright test

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: frontend/playwright-report/

      - name: Cleanup
        if: always()
        run: cd backend && docker compose -f docker-compose.test.yml down

  # ========================================
  # STAGE 3: Deploy to Staging
  # ========================================

  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: [build-backend, build-frontend, e2e-tests]
    if: github.ref == 'refs/heads/develop' || github.event_name == 'workflow_dispatch'
    environment:
      name: staging
      url: https://staging.feedbot.com
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Update ECS task definition - API
        run: |
          TASK_DEF=$(aws ecs describe-task-definition --task-definition feedbot-api-staging)
          NEW_TASK_DEF=$(echo $TASK_DEF | jq --arg IMAGE "${{ env.ECR_REGISTRY }}/feedbot-api:${{ github.sha }}" '.taskDefinition | .containerDefinitions[0].image = $IMAGE | del(.taskDefinitionArn, .revision, .status, .requiresAttributes, .compatibilities, .registeredAt, .registeredBy)')
          aws ecs register-task-definition --cli-input-json "$NEW_TASK_DEF"

      - name: Update ECS service - API
        run: |
          aws ecs update-service \
            --cluster feedbot-staging \
            --service feedbot-api-staging \
            --task-definition feedbot-api-staging \
            --force-new-deployment

      - name: Update ECS service - Worker
        run: |
          aws ecs update-service \
            --cluster feedbot-staging \
            --service feedbot-worker-staging \
            --task-definition feedbot-worker-staging \
            --force-new-deployment

      - name: Wait for services to stabilize
        run: |
          aws ecs wait services-stable \
            --cluster feedbot-staging \
            --services feedbot-api-staging feedbot-worker-staging

      - name: Deploy Frontend to Vercel (Preview)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: "--prod"
          working-directory: ./frontend

      - name: Run smoke tests
        run: |
          sleep 30
          curl -f https://staging-api.feedbot.com/health || exit 1
          curl -f https://staging.feedbot.com || exit 1

  # ========================================
  # STAGE 4: Deploy to Production
  # ========================================

  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [deploy-staging]
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://feedbot.com
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Database Migration Check
        run: |
          # Check if migrations are needed
          cd backend
          # Add migration check logic here

      - name: Blue-Green Deployment - API
        run: |
          # Get current task definition
          CURRENT_TASK_DEF=$(aws ecs describe-services --cluster feedbot-prod --services feedbot-api-prod --query 'services[0].taskDefinition' --output text)

          # Register new task definition
          TASK_DEF=$(aws ecs describe-task-definition --task-definition feedbot-api-prod)
          NEW_TASK_DEF=$(echo $TASK_DEF | jq --arg IMAGE "${{ env.ECR_REGISTRY }}/feedbot-api:${{ github.sha }}" '.taskDefinition | .containerDefinitions[0].image = $IMAGE | del(.taskDefinitionArn, .revision, .status, .requiresAttributes, .compatibilities, .registeredAt, .registeredBy)')
          NEW_TASK_ARN=$(aws ecs register-task-definition --cli-input-json "$NEW_TASK_DEF" --query 'taskDefinition.taskDefinitionArn' --output text)

          # Update service with new task definition
          aws ecs update-service \
            --cluster feedbot-prod \
            --service feedbot-api-prod \
            --task-definition $NEW_TASK_ARN \
            --deployment-configuration "maximumPercent=200,minimumHealthyPercent=100"

      - name: Wait for production deployment
        run: |
          aws ecs wait services-stable \
            --cluster feedbot-prod \
            --services feedbot-api-prod feedbot-worker-prod

      - name: Health check
        run: |
          for i in {1..5}; do
            STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://api.feedbot.com/health)
            if [ $STATUS -eq 200 ]; then
              echo "Health check passed"
              break
            fi
            if [ $i -eq 5 ]; then
              echo "Health check failed"
              exit 1
            fi
            sleep 10
          done

      - name: Deploy Frontend to Vercel (Production)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: "--prod"
          working-directory: ./frontend
          alias-domains: feedbot.com,www.feedbot.com

      - name: Create GitHub Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: v${{ github.run_number }}
          release_name: Release v${{ github.run_number }}
          body: |
            Automated production release
            Commit: ${{ github.sha }}
          draft: false
          prerelease: false

  # ========================================
  # Post-Deployment
  # ========================================

  notify:
    name: Notify Team
    runs-on: ubuntu-latest
    needs: [deploy-production]
    if: always()
    steps:
      - name: Slack Notification
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: |
            Deployment Status: ${{ job.status }}
            Environment: Production
            Commit: ${{ github.sha }}
            Author: ${{ github.actor }}
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}

      - name: Send email notification
        if: failure()
        uses: dawidd6/action-send-mail@v3
        with:
          server_address: smtp.gmail.com
          server_port: 465
          username: ${{ secrets.MAIL_USERNAME }}
          password: ${{ secrets.MAIL_PASSWORD }}
          subject: 🚨 Production Deployment Failed
          to: team@feedbot.com
          from: ci-cd@feedbot.com
          body: |
            Deployment to production failed.
            Commit: ${{ github.sha }}
            Workflow: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}
```

---

## 🔄 Rollback Workflow

**.github/workflows/rollback.yml**

```yaml
name: Rollback Production

on:
  workflow_dispatch:
    inputs:
      task_definition_revision:
        description: "Task definition revision to rollback to"
        required: true
        type: string

jobs:
  rollback:
    name: Rollback to Previous Version
    runs-on: ubuntu-latest
    environment:
      name: production
    steps:
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Rollback ECS service
        run: |
          aws ecs update-service \
            --cluster feedbot-prod \
            --service feedbot-api-prod \
            --task-definition feedbot-api-prod:${{ github.event.inputs.task_definition_revision }} \
            --force-new-deployment

      - name: Wait for rollback
        run: |
          aws ecs wait services-stable \
            --cluster feedbot-prod \
            --services feedbot-api-prod

      - name: Verify health
        run: |
          curl -f https://api.feedbot.com/health || exit 1

      - name: Notify team
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: |
            🔄 Production rolled back to revision ${{ github.event.inputs.task_definition_revision }}
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 🔐 Secrets Management

### Required GitHub Secrets

```
# AWS Credentials
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_ACCOUNT_ID

# Vercel
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID

# Notifications
SLACK_WEBHOOK
MAIL_USERNAME
MAIL_PASSWORD

# Security Scanning
SNYK_TOKEN

# Environment URLs
STAGING_API_URL=https://staging-api.feedbot.com
PRODUCTION_API_URL=https://api.feedbot.com
```

---

## 📊 Monitoring & Observability

### CloudWatch Dashboards

```yaml
# Infrastructure monitoring
- ECS task CPU/Memory usage
- ALB request count & latency
- RDS connections & query performance
- ElastiCache hit rate

# Application monitoring
- API response times (p50, p95, p99)
- Error rates (4xx, 5xx)
- Celery queue length
- Task processing time
```

### Application Performance Monitoring (APM)

**Sentry Integration:**

```python
# backend/app.py
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    environment=os.getenv("APP_ENV"),
    traces_sample_rate=1.0 if os.getenv("APP_ENV") == "staging" else 0.1,
    integrations=[FastApiIntegration()]
)
```

---

## 🧪 Testing Strategy

### Test Pyramid

```
         /\
        /E2E\       <- 10% (Playwright, critical user flows)
       /______\
      /        \
     /Integration\ <- 20% (API + DB tests)
    /____________\
   /              \
  /   Unit Tests   \ <- 70% (Pure functions, logic)
 /__________________\
```

### Test Coverage Requirements

- **Minimum**: 80% overall
- **Critical paths**: 95%
- **New code**: 90%

---

## 💰 Cost Optimization

### GitHub Actions

- Use caching for dependencies
- Matrix builds for parallel execution
- Self-hosted runners for heavy workloads (optional)

### AWS Costs

- Use Spot Instances for workers (70% savings)
- Auto-scaling based on load
- Reserved Instances for stable workloads
- S3 lifecycle policies for logs/artifacts

### Estimated Monthly Cost

- **Free Tier Eligible**: ~$25-30/month
- **Production Scale**: ~$150-200/month
  - ECS Fargate: $80
  - RDS t3.small: $30
  - ElastiCache t3.micro: $15
  - ALB: $20
  - Vercel Pro: $20
  - Other (data transfer, CloudWatch): $15

---

## 📋 Pre-Launch Checklist

### Infrastructure

- [ ] AWS resources provisioned
- [ ] Domain configured (Route53)
- [ ] SSL certificates (ACM)
- [ ] Secrets stored in AWS Secrets Manager
- [ ] Backup strategy implemented
- [ ] Monitoring dashboards created

### CI/CD

- [ ] GitHub Actions workflows tested
- [ ] All secrets configured
- [ ] Environment protection rules set
- [ ] Rollback procedure tested
- [ ] Notification channels configured

### Security

- [ ] Security scanning enabled
- [ ] Dependency updates automated (Dependabot)
- [ ] API rate limiting configured
- [ ] CORS properly configured
- [ ] Environment variables validated

### Documentation

- [ ] Deployment runbook created
- [ ] Incident response plan documented
- [ ] Architecture diagrams updated
- [ ] API documentation published

---

## 🚀 Deployment Best Practices

1. **Always test in staging first**
2. **Deploy during low-traffic hours**
3. **Monitor metrics for 30 minutes post-deployment**
4. **Keep rollback procedure handy**
5. **Communicate deployments to team**
6. **Tag releases with semantic versioning**
7. **Maintain deployment changelog**
8. **Run database migrations separately when needed**
9. **Use feature flags for risky changes**
10. **Have on-call engineer available during deployments**

---

## 📞 Support & Escalation

### Deployment Issues

1. Check GitHub Actions logs
2. Review CloudWatch logs
3. Verify ECS task health
4. Check Sentry for application errors
5. Rollback if unresolvable

### Emergency Contacts

- **On-call Engineer**: [Slack channel]
- **DevOps Lead**: [Contact info]
- **AWS Support**: [Support plan details]
