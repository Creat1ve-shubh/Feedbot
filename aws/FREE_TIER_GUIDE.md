# 🎁 AWS Free Tier Optimization Guide

## Free Tier Benefits (6-12 months)

Your AWS Free Tier includes:

### ✅ Completely Free (within limits)
- **RDS PostgreSQL**: 750 hours/month of db.t3.micro (always running = FREE)
- **ElastiCache Redis**: 750 hours/month of cache.t3.micro (FREE for 12 months)
- **Application Load Balancer**: 750 hours/month + 15 GB data (FREE for 12 months)
- **AWS Amplify**: 1,000 build minutes + 15 GB bandwidth (FREE always)
- **CloudWatch**: 10 custom metrics, 5 GB logs, 1M API requests
- **Secrets Manager**: 30-day trial (then $0.40/secret/month)
- **ECR**: 500 MB storage for 12 months

### ⚠️ Paid Services (No Free Tier)
- **ECS Fargate**: $0.04048/vCPU-hour + $0.004445/GB-hour
  - This is the main cost driver (~$50-100/month)

## 💰 Optimized Cost Breakdown

### Option 1: ECS Fargate (Easiest)

**Configuration:**
- API: 1 task × 0.25 vCPU × 0.5 GB (scaled to 2 during business hours)
- Worker: 2 tasks × 0.5 vCPU × 1 GB
- RDS: db.t3.micro (FREE)
- Redis: cache.t3.micro (FREE)
- ALB: 1 load balancer (FREE)
- Amplify: Build + hosting (FREE)

**Monthly Cost:**
```
API:     0.25 vCPU × 730 hrs × $0.04048 = $7.38
         0.5 GB × 730 hrs × $0.004445  = $1.62
         Subtotal: $9/month

Worker:  0.5 vCPU × 730 hrs × $0.04048 × 2 = $29.55
         1 GB × 730 hrs × $0.004445 × 2   = $6.49
         Subtotal: $36/month × 2 workers  = $72/month

RDS:     FREE (db.t3.micro within 750 hours)
Redis:   FREE (cache.t3.micro within 750 hours)
ALB:     FREE (within 750 hours)
Amplify: FREE (within 1,000 build minutes)
Secrets: $2.40 (6 secrets × $0.40)
Data:    ~$5 (bandwidth overage)

TOTAL: ~$89/month for 6 months
```

### Option 2: EC2 with Docker Compose (Ultra Cheap)

**Configuration:**
- 1× t3.medium EC2 instance
- Run docker-compose.yml directly
- Use Amazon Linux 2 (no license cost)
- RDS + Redis still separate (FREE)

**Monthly Cost:**
```
EC2:     t3.medium (2 vCPU, 4 GB) = $30/month
         (or t3.small for $15/month)
RDS:     FREE
Redis:   FREE  
ALB:     FREE (or skip and use EC2 public IP)
Amplify: FREE

TOTAL: $15-30/month for 6 months
Then: $0/month if you stop everything before free tier expires!
```

### Option 3: Minimal Setup (Development)

**Configuration:**
- Frontend: Amplify (FREE)
- Backend: 1 small EC2 instance with all services
- Skip RDS/Redis, use SQLite + local Redis in Docker

**Monthly Cost:**
```
EC2:     t3.micro (1 vCPU, 1 GB) = FREE for 12 months!
Amplify: FREE

TOTAL: $0/month for first year!
```

## 🚀 Recommended Setup for Free Tier

### Step 1: Use Option 2 (EC2 + Docker Compose)

```bash
# Launch EC2 instance
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t3.small \
  --key-name your-key \
  --security-group-ids sg-xxx \
  --subnet-id subnet-xxx \
  --user-data file://user-data.sh \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=feedbot-app}]'
```

**user-data.sh:**
```bash
#!/bin/bash
yum update -y
yum install -y docker git
systemctl start docker
systemctl enable docker

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Clone and start
cd /home/ec2-user
git clone https://github.com/Creat1ve-shubh/Feedbot.git
cd Feedbot/backend
docker-compose up -d
```

### Step 2: Use External Free Databases

Instead of RDS/ElastiCache, use:
- **PostgreSQL**: [Neon](https://neon.tech) (FREE 10 GB)
- **Redis**: [Upstash](https://upstash.com) (FREE 10K commands/day)

This saves your RDS/Redis free tier hours for production!

## 📊 Cost Comparison After 6 Months

| Service | Free Tier (6 mo) | After Free Tier |
|---------|------------------|-----------------|
| Option 1 (Fargate) | ~$89/month | ~$195/month |
| Option 2 (EC2) | ~$15/month | ~$80/month |
| Option 3 (Minimal) | $0/month | ~$30/month |

## 💡 Cost Saving Tips

### 1. Auto-Shutdown Non-Production
```bash
# Stop development environment at night (saves 12 hours/day = 50% cost)
aws ecs update-service --cluster feedbot-cluster --service feedbot-api-service --desired-count 0
aws ecs update-service --cluster feedbot-cluster --service feedbot-worker-service --desired-count 0

# Start in morning
aws ecs update-service --cluster feedbot-cluster --service feedbot-api-service --desired-count 1
aws ecs update-service --cluster feedbot-cluster --service feedbot-worker-service --desired-count 2
```

### 2. Use Spot Instances (70% discount)
```bash
# Request Spot instance for workers
aws ec2 request-spot-instances \
  --spot-price "0.015" \
  --instance-count 1 \
  --type "one-time" \
  --launch-specification file://spot-spec.json
```

### 3. Schedule Tasks Wisely
```python
# Run ML analysis only during business hours
from celery.schedules import crontab

CELERYBEAT_SCHEDULE = {
    'scrape-brands': {
        'task': 'workers.tasks.scrape_and_analyze',
        'schedule': crontab(hour='9-17', day_of_week='1-5'),  # Weekdays 9-5
    },
}
```

### 4. Cache Aggressively
```python
# Cache results for 1 hour to reduce DB queries
@app.get("/results/{brand}")
async def get_results(brand: str):
    cache_key = f"results:{brand}"
    cached = redis.get(cache_key)
    if cached:
        return json.loads(cached)
    
    results = fetch_from_db(brand)
    redis.setex(cache_key, 3600, json.dumps(results))
    return results
```

### 5. Monitor with AWS Budgets
```bash
# Set budget alert at $50
aws budgets create-budget \
  --account-id YOUR_ACCOUNT_ID \
  --budget file://budget.json \
  --notifications-with-subscribers file://notifications.json
```

## 🎯 Recommended Path

**For Development (6 months free tier):**
1. Use Option 2 (EC2 + Docker Compose)
2. Deploy to t3.small instance ($15/month)
3. Use managed RDS/Redis (FREE)
4. Total: **~$15/month**

**For Production (after free tier expires):**
1. Migrate to ECS Fargate for auto-scaling
2. Use RDS/ElastiCache for reliability
3. Enable CloudWatch alarms
4. Total: **~$80-150/month** depending on traffic

**To Stay Free Forever:**
1. Use t3.micro EC2 (FREE for 12 months)
2. Use Neon PostgreSQL (FREE forever, 10 GB)
3. Use Upstash Redis (FREE forever, 10K commands/day)
4. Use Amplify (FREE forever, 15 GB bandwidth)
5. Total: **$0/month** 🎉

## 📈 Scaling Strategy

Start small, scale as needed:

```
Month 1-3:  t3.micro + external DB    = $0/month
Month 4-6:  t3.small + RDS/Redis      = $15/month  
Month 7-12: t3.medium + auto-scaling  = $50/month
Year 2+:    ECS Fargate + managed DB  = $150/month
```

This approach lets you validate your product with minimal investment!
