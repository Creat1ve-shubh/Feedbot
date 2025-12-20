#!/bin/bash
set -e

# Configuration
REGION="us-east-1"
CLUSTER_NAME="feedbot-cluster"
VPC_NAME="feedbot-vpc"
DB_INSTANCE_CLASS="db.t3.micro"  # Free tier eligible for 12 months (750 hrs/month)
REDIS_NODE_TYPE="cache.t3.micro"   # Free tier eligible (500 MB/month)

echo "🚀 Setting up AWS infrastructure for Feedbot..."

# 1. Create VPC
echo "📦 Creating VPC..."
VPC_ID=$(aws ec2 create-vpc \
  --cidr-block 10.0.0.0/16 \
  --tag-specifications "ResourceType=vpc,Tags=[{Key=Name,Value=$VPC_NAME}]" \
  --query 'Vpc.VpcId' \
  --output text \
  --region $REGION)

echo "VPC ID: $VPC_ID"

# Enable DNS
aws ec2 modify-vpc-attribute --vpc-id $VPC_ID --enable-dns-support
aws ec2 modify-vpc-attribute --vpc-id $VPC_ID --enable-dns-hostnames

# 2. Create Internet Gateway
echo "🌐 Creating Internet Gateway..."
IGW_ID=$(aws ec2 create-internet-gateway \
  --tag-specifications "ResourceType=internet-gateway,Tags=[{Key=Name,Value=feedbot-igw}]" \
  --query 'InternetGateway.InternetGatewayId' \
  --output text \
  --region $REGION)

aws ec2 attach-internet-gateway --vpc-id $VPC_ID --internet-gateway-id $IGW_ID --region $REGION

# 3. Create Subnets (2 public, 2 private in different AZs)
echo "📍 Creating Subnets..."

PUBLIC_SUBNET_1=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block 10.0.1.0/24 \
  --availability-zone ${REGION}a \
  --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=feedbot-public-1}]" \
  --query 'Subnet.SubnetId' \
  --output text \
  --region $REGION)

PUBLIC_SUBNET_2=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block 10.0.2.0/24 \
  --availability-zone ${REGION}b \
  --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=feedbot-public-2}]" \
  --query 'Subnet.SubnetId' \
  --output text \
  --region $REGION)

PRIVATE_SUBNET_1=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block 10.0.10.0/24 \
  --availability-zone ${REGION}a \
  --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=feedbot-private-1}]" \
  --query 'Subnet.SubnetId' \
  --output text \
  --region $REGION)

PRIVATE_SUBNET_2=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block 10.0.11.0/24 \
  --availability-zone ${REGION}b \
  --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=feedbot-private-2}]" \
  --query 'Subnet.SubnetId' \
  --output text \
  --region $REGION)

# 4. Create Route Tables
echo "🛣️  Setting up routing..."

PUBLIC_RT=$(aws ec2 create-route-table \
  --vpc-id $VPC_ID \
  --tag-specifications "ResourceType=route-table,Tags=[{Key=Name,Value=feedbot-public-rt}]" \
  --query 'RouteTable.RouteTableId' \
  --output text \
  --region $REGION)

aws ec2 create-route --route-table-id $PUBLIC_RT --destination-cidr-block 0.0.0.0/0 --gateway-id $IGW_ID --region $REGION
aws ec2 associate-route-table --subnet-id $PUBLIC_SUBNET_1 --route-table-id $PUBLIC_RT --region $REGION
aws ec2 associate-route-table --subnet-id $PUBLIC_SUBNET_2 --route-table-id $PUBLIC_RT --region $REGION

# 5. Create Security Groups
echo "🔒 Creating Security Groups..."

ALB_SG=$(aws ec2 create-security-group \
  --group-name feedbot-alb-sg \
  --description "Security group for ALB" \
  --vpc-id $VPC_ID \
  --query 'GroupId' \
  --output text \
  --region $REGION)

aws ec2 authorize-security-group-ingress --group-id $ALB_SG --protocol tcp --port 80 --cidr 0.0.0.0/0 --region $REGION
aws ec2 authorize-security-group-ingress --group-id $ALB_SG --protocol tcp --port 443 --cidr 0.0.0.0/0 --region $REGION

ECS_SG=$(aws ec2 create-security-group \
  --group-name feedbot-ecs-sg \
  --description "Security group for ECS tasks" \
  --vpc-id $VPC_ID \
  --query 'GroupId' \
  --output text \
  --region $REGION)

aws ec2 authorize-security-group-ingress --group-id $ECS_SG --protocol tcp --port 8000 --source-group $ALB_SG --region $REGION

DB_SG=$(aws ec2 create-security-group \
  --group-name feedbot-db-sg \
  --description "Security group for RDS" \
  --vpc-id $VPC_ID \
  --query 'GroupId' \
  --output text \
  --region $REGION)

aws ec2 authorize-security-group-ingress --group-id $DB_SG --protocol tcp --port 5432 --source-group $ECS_SG --region $REGION

REDIS_SG=$(aws ec2 create-security-group \
  --group-name feedbot-redis-sg \
  --description "Security group for Redis" \
  --vpc-id $VPC_ID \
  --query 'GroupId' \
  --output text \
  --region $REGION)

aws ec2 authorize-security-group-ingress --group-id $REDIS_SG --protocol tcp --port 6379 --source-group $ECS_SG --region $REGION

# 6. Create RDS Subnet Group
echo "💾 Creating RDS infrastructure..."

aws rds create-db-subnet-group \
  --db-subnet-group-name feedbot-db-subnet-group \
  --db-subnet-group-description "Subnet group for Feedbot RDS" \
  --subnet-ids $PRIVATE_SUBNET_1 $PRIVATE_SUBNET_2 \
  --region $REGION

# 7. Create RDS PostgreSQL
echo "📊 Creating RDS PostgreSQL instance (Free Tier)..."

aws rds create-db-instance \
  --db-instance-identifier feedbot-postgres \
  --db-instance-class $DB_INSTANCE_CLASS \
  --engine postgres \
  --engine-version 16.1 \
  --master-username feedbot \
  --master-user-password "$(openssl rand -base64 32)" \
  --allocated-storage 20 \
  --storage-type gp2 \
  --db-subnet-group-name feedbot-db-subnet-group \
  --vpc-security-group-ids $DB_SG \
  --backup-retention-period 7 \
  --no-publicly-accessible \
  --storage-encrypted \
  --region $REGION

# 8. Create ElastiCache Subnet Group
echo "⚡ Creating Redis infrastructure..."

aws elasticache create-cache-subnet-group \
  --cache-subnet-group-name feedbot-redis-subnet-group \
  --cache-subnet-group-description "Subnet group for Feedbot Redis" \
  --subnet-ids $PRIVATE_SUBNET_1 $PRIVATE_SUBNET_2 \
  --region $REGION

# 9. Create ElastiCache Redis
echo "🔴 Creating ElastiCache Redis..."

aws elasticache create-cache-cluster \
  --cache-cluster-id feedbot-redis \
  --cache-node-type $REDIS_NODE_TYPE \
  --engine redis \
  --num-cache-nodes 1 \
  --cache-subnet-group-name feedbot-redis-subnet-group \
  --security-group-ids $REDIS_SG \
  --region $REGION

# 10. Create ECR Repositories
echo "📦 Creating ECR repositories..."

aws ecr create-repository --repository-name feedbot-api --region $REGION
aws ecr create-repository --repository-name feedbot-worker --region $REGION

# 11. Create ECS Cluster
echo "🐳 Creating ECS Cluster..."

aws ecs create-cluster --cluster-name $CLUSTER_NAME --region $REGION

# 12. Create Application Load Balancer
echo "⚖️  Creating Application Load Balancer..."

ALB_ARN=$(aws elbv2 create-load-balancer \
  --name feedbot-alb \
  --subnets $PUBLIC_SUBNET_1 $PUBLIC_SUBNET_2 \
  --security-groups $ALB_SG \
  --scheme internet-facing \
  --type application \
  --query 'LoadBalancers[0].LoadBalancerArn' \
  --output text \
  --region $REGION)

# 13. Create Target Group
echo "🎯 Creating Target Group..."

TG_ARN=$(aws elbv2 create-target-group \
  --name feedbot-api-tg \
  --protocol HTTP \
  --port 8000 \
  --vpc-id $VPC_ID \
  --target-type ip \
  --health-check-path /health \
  --query 'TargetGroups[0].TargetGroupArn' \
  --output text \
  --region $REGION)

# 14. Create Listener
echo "👂 Creating ALB Listener..."

aws elbv2 create-listener \
  --load-balancer-arn $ALB_ARN \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=$TG_ARN \
  --region $REGION

# 15. Create CloudWatch Log Groups
echo "📝 Creating CloudWatch Log Groups..."

aws logs create-log-group --log-group-name /ecs/feedbot-api --region $REGION
aws logs create-log-group --log-group-name /ecs/feedbot-worker --region $REGION

echo "✅ AWS infrastructure setup complete!"
echo ""
echo "📋 Summary:"
echo "  VPC ID: $VPC_ID"
echo "  ECS Cluster: $CLUSTER_NAME"
echo "  ALB ARN: $ALB_ARN"
echo "  Target Group ARN: $TG_ARN"
echo ""
echo "⏳ Note: RDS and ElastiCache are being created. This may take 10-15 minutes."
echo "   Check status with: aws rds describe-db-instances --db-instance-identifier feedbot-postgres --region $REGION"
echo ""
echo "🔑 Next steps:"
echo "  1. Wait for RDS and Redis to be available"
echo "  2. Store database credentials in AWS Secrets Manager"
echo "  3. Update task-definition-*.json with your ACCOUNT_ID and ARNs"
echo "  4. Configure GitHub secrets for CI/CD"
