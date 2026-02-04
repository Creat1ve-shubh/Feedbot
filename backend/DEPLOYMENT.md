# Production Deployment Guide

> **Deploying Feedbot Backend to Production**

---

## 🏗️ Architecture Overview

### Production Stack

- **API Layer**: FastAPI (multiple instances, load balanced)
- **Worker Layer**: Celery workers (auto-scaling)
- **Database**: PostgreSQL (managed service)
- **Cache**: Redis (managed/clustered)
- **Container Orchestration**: AWS ECS / Kubernetes
- **Load Balancer**: Application Load Balancer (ALB)
- **CI/CD**: GitHub Actions + AWS ECR/ECS

---

## 🚀 Deployment Options

### Option 1: AWS ECS (Recommended)

**Architecture:**

```
Internet → ALB → ECS Service (API) → RDS PostgreSQL
                    ↓                    ↓
              ECS Service (Worker) → ElastiCache Redis
```

**Step 1: Infrastructure Setup**

```bash
# Use provided setup script
cd aws
./setup-infrastructure.sh
```

This creates:

- VPC with public/private subnets
- RDS PostgreSQL instance
- ElastiCache Redis cluster
- ECS Cluster
- Application Load Balancer
- ECR repositories
- IAM roles and security groups

**Step 2: Build and Push Images**

```bash
# Build images
docker build -f Dockerfile.api -t feedbot-api:latest .
docker build -f Dockerfile.worker -t feedbot-worker:latest .

# Tag for ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin {account-id}.dkr.ecr.us-east-1.amazonaws.com

docker tag feedbot-api:latest {account-id}.dkr.ecr.us-east-1.amazonaws.com/feedbot-api:latest
docker tag feedbot-worker:latest {account-id}.dkr.ecr.us-east-1.amazonaws.com/feedbot-worker:latest

docker push {account-id}.dkr.ecr.us-east-1.amazonaws.com/feedbot-api:latest
docker push {account-id}.dkr.ecr.us-east-1.amazonaws.com/feedbot-worker:latest
```

**Step 3: Deploy Services**

```bash
# Create ECS task definitions
aws ecs register-task-definition --cli-input-json file://aws/task-definition-api.json
aws ecs register-task-definition --cli-input-json file://aws/task-definition-worker.json

# Create services
aws ecs create-service \
  --cluster feedbot-cluster \
  --service-name feedbot-api \
  --task-definition feedbot-api:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --load-balancers file://aws/load-balancer-config.json

aws ecs create-service \
  --cluster feedbot-cluster \
  --service-name feedbot-worker \
  --task-definition feedbot-worker:1 \
  --desired-count 2 \
  --launch-type FARGATE
```

**Step 4: Configure Environment Variables**

Store secrets in AWS Secrets Manager:

```bash
aws secretsmanager create-secret \
  --name feedbot/production \
  --secret-string '{
    "DB_HOST":"feedbot-db.xxxxx.us-east-1.rds.amazonaws.com",
    "DB_PASSWORD":"secure_password_here",
    "REDIS_URL":"redis://feedbot-redis.xxxxx.cache.amazonaws.com:6379/0",
    "REDDIT_CLIENT_ID":"your_client_id",
    "REDDIT_CLIENT_SECRET":"your_secret",
    "TWITTER_BEARER_TOKEN":"your_token"
  }'
```

---

### Option 2: Kubernetes (K8s)

**Prerequisites:**

- Kubernetes cluster (EKS, GKE, AKS, or self-hosted)
- kubectl configured
- Helm (optional but recommended)

**Step 1: Create Kubernetes Resources**

```yaml
# k8s/deployment-api.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: feedbot-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: feedbot-api
  template:
    metadata:
      labels:
        app: feedbot-api
    spec:
      containers:
      - name: api
        image: {registry}/feedbot-api:latest
        ports:
        - containerPort: 8000
        env:
        - name: APP_ENV
          value: "production"
        - name: DB_HOST
          valueFrom:
            secretKeyRef:
              name: feedbot-secrets
              key: db-host
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
---
apiVersion: v1
kind: Service
metadata:
  name: feedbot-api
spec:
  type: LoadBalancer
  selector:
    app: feedbot-api
  ports:
  - port: 80
    targetPort: 8000
```

**Step 2: Deploy**

```bash
# Create namespace
kubectl create namespace feedbot

# Create secrets
kubectl create secret generic feedbot-secrets \
  --from-literal=db-host=postgres.feedbot.svc.cluster.local \
  --from-literal=db-password=secure_password \
  --from-literal=redis-url=redis://redis.feedbot.svc.cluster.local:6379/0 \
  -n feedbot

# Deploy
kubectl apply -f k8s/ -n feedbot

# Check status
kubectl get pods -n feedbot
kubectl get services -n feedbot
```

---

### Option 3: Docker Swarm

**For smaller deployments:**

```bash
# Initialize swarm
docker swarm init

# Create secrets
echo "secure_db_password" | docker secret create db_password -
echo "redis://redis:6379/0" | docker secret create redis_url -

# Deploy stack
docker stack deploy -c docker-compose.prod.yml feedbot

# Scale services
docker service scale feedbot_api=3
docker service scale feedbot_worker=2
```

---

## 🔐 Security Checklist

### Application Security

- [ ] Use HTTPS only (enforce SSL/TLS)
- [ ] Set strong `DB_PASSWORD`
- [ ] Rotate API keys regularly
- [ ] Implement rate limiting
- [ ] Enable CORS only for trusted domains
- [ ] Use API authentication (JWT tokens)
- [ ] Sanitize all user inputs
- [ ] Keep dependencies updated

### Infrastructure Security

- [ ] Use private subnets for database/Redis
- [ ] Configure security groups (least privilege)
- [ ] Enable VPC flow logs
- [ ] Use AWS Secrets Manager / Vault
- [ ] Enable CloudTrail logging
- [ ] Set up Web Application Firewall (WAF)
- [ ] Use IAM roles (not access keys)

### Environment Variables (Production)

```env
APP_ENV=production
API_HOST=0.0.0.0
API_PORT=8000

# Database (use managed RDS)
DB_HOST=feedbot-db.xxxxx.rds.amazonaws.com
DB_PORT=5432
DB_NAME=branddb_prod
DB_USER=feedbot_user
DB_PASSWORD={use_secrets_manager}

# Redis (use ElastiCache)
REDIS_URL=redis://feedbot-cache.xxxxx.cache.amazonaws.com:6379/0

# API Keys (use Secrets Manager)
REDDIT_CLIENT_ID={from_secrets}
REDDIT_CLIENT_SECRET={from_secrets}
TWITTER_BEARER_TOKEN={from_secrets}

# ML Model
ML_MODEL_PATH=/app/ml/custom_model/model_traced_cpu.pt
```

---

## 📊 Monitoring & Logging

### CloudWatch (AWS)

```bash
# Create log groups
aws logs create-log-group --log-group-name /ecs/feedbot-api
aws logs create-log-group --log-group-name /ecs/feedbot-worker

# Set retention
aws logs put-retention-policy \
  --log-group-name /ecs/feedbot-api \
  --retention-in-days 30
```

### Prometheus + Grafana (K8s)

```bash
# Install Prometheus Operator
helm install prometheus prometheus-community/kube-prometheus-stack

# Expose metrics endpoint in FastAPI
# Add prometheus_fastapi_instrumentator to requirements.txt
```

### Application Metrics

**Key Metrics to Monitor:**

- API response time (p50, p95, p99)
- Request rate (requests/second)
- Error rate (4xx, 5xx)
- Task queue length (Celery)
- Worker processing time
- Database connection pool usage
- Redis cache hit rate
- Memory/CPU usage

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:

env:
  AWS_REGION: us-east-1
  ECR_REPOSITORY_API: feedbot-api
  ECR_REPOSITORY_WORKER: feedbot-worker
  ECS_CLUSTER: feedbot-cluster
  ECS_SERVICE_API: feedbot-api
  ECS_SERVICE_WORKER: feedbot-worker

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: "3.11"

      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
          pip install pytest pytest-cov

      - name: Run tests
        run: |
          cd backend
          pytest tests/ --cov=. --cov-report=xml

      - name: Upload coverage
        uses: codecov/codecov-action@v3

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1

      - name: Build, tag, and push API image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          cd backend
          docker build -f Dockerfile.api -t $ECR_REGISTRY/$ECR_REPOSITORY_API:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY_API:$IMAGE_TAG
          docker tag $ECR_REGISTRY/$ECR_REPOSITORY_API:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY_API:latest
          docker push $ECR_REGISTRY/$ECR_REPOSITORY_API:latest

      - name: Build, tag, and push Worker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          cd backend
          docker build -f Dockerfile.worker -t $ECR_REGISTRY/$ECR_REPOSITORY_WORKER:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY_WORKER:$IMAGE_TAG
          docker tag $ECR_REGISTRY/$ECR_REPOSITORY_WORKER:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY_WORKER:latest
          docker push $ECR_REGISTRY/$ECR_REPOSITORY_WORKER:latest

      - name: Update ECS services
        run: |
          aws ecs update-service \
            --cluster $ECS_CLUSTER \
            --service $ECS_SERVICE_API \
            --force-new-deployment

          aws ecs update-service \
            --cluster $ECS_CLUSTER \
            --service $ECS_SERVICE_WORKER \
            --force-new-deployment

      - name: Wait for services to stabilize
        run: |
          aws ecs wait services-stable \
            --cluster $ECS_CLUSTER \
            --services $ECS_SERVICE_API $ECS_SERVICE_WORKER

  notify:
    needs: build-and-deploy
    runs-on: ubuntu-latest
    steps:
      - name: Notify Slack
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: "Deployment to production completed"
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 📈 Scaling Strategy

### Auto-scaling Configuration

**ECS Auto-scaling:**

```bash
# API service scaling
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/feedbot-cluster/feedbot-api \
  --min-capacity 2 \
  --max-capacity 10

aws application-autoscaling put-scaling-policy \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/feedbot-cluster/feedbot-api \
  --policy-name cpu-scaling-policy \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration file://scaling-policy.json
```

**scaling-policy.json:**

```json
{
  "TargetValue": 70.0,
  "PredefinedMetricSpecification": {
    "PredefinedMetricType": "ECSServiceAverageCPUUtilization"
  },
  "ScaleInCooldown": 300,
  "ScaleOutCooldown": 60
}
```

### Horizontal Scaling Guidelines

**API Layer:**

- Min: 2 instances (high availability)
- Max: 10 instances (cost control)
- Scale on: CPU > 70% or Request Count > 1000/min

**Worker Layer:**

- Min: 2 workers
- Max: 20 workers
- Scale on: Queue length > 100 tasks

**Database:**

- Use RDS read replicas for read-heavy workloads
- Consider Aurora for better scaling

**Redis:**

- Use ElastiCache cluster mode for sharding
- Enable automatic failover

---

## 🔧 Database Migrations

### Production Migration Strategy

```bash
# 1. Backup database
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME > backup_$(date +%Y%m%d).sql

# 2. Run migrations
python migrate.py

# 3. Verify tables
python verify_integration.py
```

### Zero-downtime Migrations

For schema changes:

1. Add new columns (nullable)
2. Deploy code that writes to both old and new
3. Backfill data
4. Deploy code that reads from new columns
5. Drop old columns

---

## 💰 Cost Optimization

### AWS Free Tier Eligible Setup

- Use `setup-free-tier.sh` for minimal costs
- t3.micro ECS tasks
- db.t3.micro RDS instance
- cache.t3.micro Redis
- ~$20-30/month

### Production Recommendations

- Use Reserved Instances (30-70% savings)
- Enable S3 lifecycle policies for logs
- Use Spot Instances for workers
- Implement request caching (reduce API calls)

---

## 🆘 Rollback Procedure

```bash
# List task definitions
aws ecs list-task-definitions --family-prefix feedbot-api

# Rollback to previous version
aws ecs update-service \
  --cluster feedbot-cluster \
  --service feedbot-api \
  --task-definition feedbot-api:$PREVIOUS_VERSION

# Monitor rollback
aws ecs wait services-stable \
  --cluster feedbot-cluster \
  --services feedbot-api
```

---

## 📋 Pre-deployment Checklist

- [ ] All tests passing
- [ ] Database migrations tested
- [ ] Environment variables configured
- [ ] Secrets stored securely
- [ ] Monitoring/alerts configured
- [ ] Backup strategy in place
- [ ] Rollback plan documented
- [ ] Load testing completed
- [ ] Security scan passed
- [ ] Documentation updated
