# AWS Deployment Guide

## 🏗️ Infrastructure Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Internet Users                            │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
        ┌────────────────┐
        │  CloudFront    │ (Frontend CDN)
        │  + S3 / Amplify│
        └────────────────┘
                 │
                 ▼
        ┌────────────────┐
        │  Route 53      │ (DNS)
        └────────────────┘
                 │
                 ▼
        ┌────────────────┐
        │      ALB       │ (Load Balancer)
        └────────┬───────┘
                 │
         ┌───────┴────────┐
         │                │
         ▼                ▼
    ┌────────┐       ┌─────────┐
    │ECS API │       │ ECS     │
    │Tasks   │       │ Worker  │
    │(Fargate│       │ Tasks   │
    └────┬───┘       └────┬────┘
         │                │
         └────────┬───────┘
                  │
         ┌────────┴────────┐
         │                 │
         ▼                 ▼
    ┌────────┐        ┌─────────┐
    │  RDS   │        │ElastiCache
    │Postgres│        │  Redis  │
    └────────┘        └─────────┘
```

## 🚀 Quick Start

### 1. Prerequisites

```bash
# Install AWS CLI
brew install awscli  # macOS
# or
sudo apt-get install awscli  # Linux
# or download from aws.amazon.com/cli

# Configure AWS credentials
aws configure
# AWS Access Key ID: YOUR_KEY
# AWS Secret Access Key: YOUR_SECRET
# Default region: us-east-1
# Default output format: json
```

### 2. Run Infrastructure Setup

```bash
cd aws
chmod +x setup-infrastructure.sh
./setup-infrastructure.sh
```

This creates:

- ✅ VPC with public/private subnets
- ✅ RDS PostgreSQL instance
- ✅ ElastiCache Redis cluster
- ✅ ECS Fargate cluster
- ✅ Application Load Balancer
- ✅ ECR repositories
- ✅ Security groups
- ✅ CloudWatch log groups

### 3. Store Secrets in AWS Secrets Manager

```bash
# Get RDS endpoint (wait for creation to complete)
DB_ENDPOINT=$(aws rds describe-db-instances \
  --db-instance-identifier feedbot-postgres \
  --query 'DBInstances[0].Endpoint.Address' \
  --output text)

# Get Redis endpoint
REDIS_ENDPOINT=$(aws elasticache describe-cache-clusters \
  --cache-cluster-id feedbot-redis \
  --show-cache-node-info \
  --query 'CacheClusters[0].CacheNodes[0].Endpoint.Address' \
  --output text)

# Store secrets
aws secretsmanager create-secret --name feedbot/db-host --secret-string "$DB_ENDPOINT"
aws secretsmanager create-secret --name feedbot/db-port --secret-string "5432"
aws secretsmanager create-secret --name feedbot/db-name --secret-string "branddb"
aws secretsmanager create-secret --name feedbot/db-user --secret-string "feedbot"
aws secretsmanager create-secret --name feedbot/db-password --secret-string "YOUR_DB_PASSWORD"
aws secretsmanager create-secret --name feedbot/redis-url --secret-string "redis://$REDIS_ENDPOINT:6379/0"
aws secretsmanager create-secret --name feedbot/reddit-client-id --secret-string "YOUR_REDDIT_ID"
aws secretsmanager create-secret --name feedbot/reddit-client-secret --secret-string "YOUR_REDDIT_SECRET"
aws secretsmanager create-secret --name feedbot/twitter-bearer-token --secret-string "YOUR_TWITTER_TOKEN"
```

### 4. Update Task Definitions

Replace `ACCOUNT_ID` in both task definition files:

```bash
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Update API task definition
sed -i "s/ACCOUNT_ID/$AWS_ACCOUNT_ID/g" aws/task-definition-api.json

# Update Worker task definition
sed -i "s/ACCOUNT_ID/$AWS_ACCOUNT_ID/g" aws/task-definition-worker.json
```

### 5. Register Task Definitions

```bash
aws ecs register-task-definition --cli-input-json file://aws/task-definition-api.json
aws ecs register-task-definition --cli-input-json file://aws/task-definition-worker.json
```

### 6. Create ECS Services

```bash
# Get subnet and security group IDs
VPC_ID=$(aws ec2 describe-vpcs --filters "Name=tag:Name,Values=feedbot-vpc" --query 'Vpcs[0].VpcId' --output text)
PRIVATE_SUBNETS=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" "Name=tag:Name,Values=feedbot-private-*" --query 'Subnets[*].SubnetId' --output text | tr '\t' ',')
ECS_SG=$(aws ec2 describe-security-groups --filters "Name=group-name,Values=feedbot-ecs-sg" --query 'SecurityGroups[0].GroupId' --output text)
TG_ARN=$(aws elbv2 describe-target-groups --names feedbot-api-tg --query 'TargetGroups[0].TargetGroupArn' --output text)

# Create API service
aws ecs create-service \
  --cluster feedbot-cluster \
  --service-name feedbot-api-service \
  --task-definition feedbot-api \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[$PRIVATE_SUBNETS],securityGroups=[$ECS_SG]}" \
  --load-balancers "targetGroupArn=$TG_ARN,containerName=feedbot-api,containerPort=8000"

# Create Worker service
aws ecs create-service \
  --cluster feedbot-cluster \
  --service-name feedbot-worker-service \
  --task-definition feedbot-worker \
  --desired-count 3 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[$PRIVATE_SUBNETS],securityGroups=[$ECS_SG]}"
```

### 7. Configure GitHub Secrets

Go to your repo → Settings → Secrets → Actions:

```
AWS_ACCESS_KEY_ID=<your-access-key>
AWS_SECRET_ACCESS_KEY=<your-secret-key>
AWS_ACCOUNT_ID=<your-account-id>
AMPLIFY_APP_ID=<created-in-step-8>
SLACK_WEBHOOK=<optional>
```

### 8. Deploy Frontend to AWS Amplify

```bash
cd frontend

# Connect to Amplify (one-time setup)
npm install -g @aws-amplify/cli
amplify init

# Deploy
amplify add hosting
amplify publish

# Note the app ID for GitHub secrets
amplify status
```

### 9. Trigger Deployment

```bash
git add .
git commit -m "Add AWS infrastructure"
git push origin main
```

GitHub Actions will automatically:

1. Build Docker images
2. Push to ECR
3. Update ECS services
4. Deploy frontend to Amplify

## 📊 Monitoring & Management

### View Logs

```bash
# API logs
aws logs tail /ecs/feedbot-api --follow

# Worker logs
aws logs tail /ecs/feedbot-worker --follow
```

### Check Service Health

```bash
# ECS services
aws ecs describe-services --cluster feedbot-cluster --services feedbot-api-service feedbot-worker-service

# RDS status
aws rds describe-db-instances --db-instance-identifier feedbot-postgres

# Redis status
aws elasticache describe-cache-clusters --cache-cluster-id feedbot-redis
```

### Scale Services

```bash
# Scale API
aws ecs update-service --cluster feedbot-cluster --service feedbot-api-service --desired-count 4

# Scale Worker
aws ecs update-service --cluster feedbot-cluster --service feedbot-worker-service --desired-count 5
```

### Enable Auto-Scaling

```bash
# Register scalable target
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/feedbot-cluster/feedbot-api-service \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 2 \
  --max-capacity 10

# Create scaling policy
aws application-autoscaling put-scaling-policy \
  --service-namespace ecs \
  --resource-id service/feedbot-cluster/feedbot-api-service \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-name cpu-scaling \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration file://scaling-policy.json
```

## 💰 Cost Estimate

**Monthly costs (us-east-1):**

| Service              | Configuration           | Cost            |
| -------------------- | ----------------------- | --------------- |
| ECS Fargate (API)    | 2 tasks × 0.5 vCPU, 1GB | ~$30            |
| ECS Fargate (Worker) | 3 tasks × 1 vCPU, 2GB   | ~$90            |
| RDS PostgreSQL       | db.t3.micro             | ~$15            |
| ElastiCache Redis    | cache.t3.micro          | ~$15            |
| ALB                  | 1 load balancer         | ~$20            |
| Amplify              | Hosting + builds        | ~$15            |
| Data Transfer        | ~100GB/month            | ~$10            |
| **Total**            |                         | **~$195/month** |

**Cost optimization tips:**

- Use Savings Plans for 30-40% discount
- Enable auto-scaling to scale down during low traffic
- Use Spot instances for non-critical workers
- Implement caching to reduce API calls

## 🔐 Security Best Practices

1. **Enable VPC Flow Logs**

```bash
aws ec2 create-flow-logs --resource-type VPC --resource-ids $VPC_ID --traffic-type ALL --log-destination-type cloud-watch-logs --log-group-name /aws/vpc/feedbot
```

2. **Enable RDS encryption**

```bash
# Already enabled in setup script via default encryption
```

3. **Enable ALB access logs**

```bash
aws elbv2 modify-load-balancer-attributes --load-balancer-arn $ALB_ARN --attributes Key=access_logs.s3.enabled,Value=true Key=access_logs.s3.bucket,Value=feedbot-alb-logs
```

4. **Set up AWS WAF**

```bash
aws wafv2 create-web-acl --name feedbot-waf --scope REGIONAL --default-action Allow={} --region us-east-1
```

## 🚨 Troubleshooting

**ECS tasks not starting?**

```bash
aws ecs describe-tasks --cluster feedbot-cluster --tasks <task-arn>
```

**Can't connect to RDS?**

- Check security group allows traffic from ECS SG
- Verify VPC and subnets are correct
- Check Secrets Manager values

**High costs?**

```bash
# Check current usage
aws ce get-cost-and-usage --time-period Start=2025-12-01,End=2025-12-14 --granularity MONTHLY --metrics UnblendedCost
```

## 📞 Support

For issues:

1. Check CloudWatch Logs
2. Review ECS task stopped reasons
3. Verify Secrets Manager values
4. Check security group rules
