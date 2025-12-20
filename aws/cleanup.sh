#!/bin/bash
set -e

echo "🛑 Cleaning up AWS resources to minimize costs..."
echo ""

REGION="us-east-1"

# Get resource IDs
INSTANCE_ID=$(aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=feedbot-app" "Name=instance-state-name,Values=running" \
  --query 'Reservations[0].Instances[0].InstanceId' \
  --output text \
  --region $REGION 2>/dev/null || echo "")

VPC_ID=$(aws ec2 describe-vpcs \
  --filters "Name=tag:Name,Values=feedbot-vpc" \
  --query 'Vpcs[0].VpcId' \
  --output text \
  --region $REGION 2>/dev/null || echo "")

# 1. Terminate EC2 Instance
if [ "$INSTANCE_ID" != "" ] && [ "$INSTANCE_ID" != "None" ]; then
  echo "🗑️  Terminating EC2 instance: $INSTANCE_ID"
  aws ec2 terminate-instances --instance-ids $INSTANCE_ID --region $REGION
  echo "⏳ Waiting for termination..."
  aws ec2 wait instance-terminated --instance-ids $INSTANCE_ID --region $REGION
  echo "✅ Instance terminated"
else
  echo "ℹ️  No running instance found"
fi

# 2. Delete Security Group
if [ "$VPC_ID" != "" ] && [ "$VPC_ID" != "None" ]; then
  SG_ID=$(aws ec2 describe-security-groups \
    --filters "Name=group-name,Values=feedbot-app-sg" "Name=vpc-id,Values=$VPC_ID" \
    --query 'SecurityGroups[0].GroupId' \
    --output text \
    --region $REGION 2>/dev/null || echo "")
  
  if [ "$SG_ID" != "" ] && [ "$SG_ID" != "None" ]; then
    echo "🗑️  Deleting security group: $SG_ID"
    aws ec2 delete-security-group --group-id $SG_ID --region $REGION
  fi
fi

# 3. Delete Internet Gateway
if [ "$VPC_ID" != "" ] && [ "$VPC_ID" != "None" ]; then
  IGW_ID=$(aws ec2 describe-internet-gateways \
    --filters "Name=attachment.vpc-id,Values=$VPC_ID" \
    --query 'InternetGateways[0].InternetGatewayId' \
    --output text \
    --region $REGION 2>/dev/null || echo "")
  
  if [ "$IGW_ID" != "" ] && [ "$IGW_ID" != "None" ]; then
    echo "🗑️  Detaching and deleting internet gateway: $IGW_ID"
    aws ec2 detach-internet-gateway --internet-gateway-id $IGW_ID --vpc-id $VPC_ID --region $REGION
    aws ec2 delete-internet-gateway --internet-gateway-id $IGW_ID --region $REGION
  fi
fi

# 4. Delete Subnets
if [ "$VPC_ID" != "" ] && [ "$VPC_ID" != "None" ]; then
  SUBNETS=$(aws ec2 describe-subnets \
    --filters "Name=vpc-id,Values=$VPC_ID" \
    --query 'Subnets[*].SubnetId' \
    --output text \
    --region $REGION 2>/dev/null || echo "")
  
  for SUBNET_ID in $SUBNETS; do
    if [ "$SUBNET_ID" != "" ] && [ "$SUBNET_ID" != "None" ]; then
      echo "🗑️  Deleting subnet: $SUBNET_ID"
      aws ec2 delete-subnet --subnet-id $SUBNET_ID --region $REGION
    fi
  done
fi

# 5. Delete Route Tables
if [ "$VPC_ID" != "" ] && [ "$VPC_ID" != "None" ]; then
  RT_IDS=$(aws ec2 describe-route-tables \
    --filters "Name=vpc-id,Values=$VPC_ID" "Name=association.main,Values=false" \
    --query 'RouteTables[*].RouteTableId' \
    --output text \
    --region $REGION 2>/dev/null || echo "")
  
  for RT_ID in $RT_IDS; do
    if [ "$RT_ID" != "" ] && [ "$RT_ID" != "None" ]; then
      echo "🗑️  Deleting route table: $RT_ID"
      aws ec2 delete-route-table --route-table-id $RT_ID --region $REGION
    fi
  done
fi

# 6. Delete VPC
if [ "$VPC_ID" != "" ] && [ "$VPC_ID" != "None" ]; then
  echo "🗑️  Deleting VPC: $VPC_ID"
  aws ec2 delete-vpc --vpc-id $VPC_ID --region $REGION
fi

# 7. Delete RDS if exists
RDS_ID="feedbot-postgres"
if aws rds describe-db-instances --db-instance-identifier $RDS_ID --region $REGION 2>/dev/null; then
  echo "🗑️  Deleting RDS instance: $RDS_ID"
  aws rds delete-db-instance \
    --db-instance-identifier $RDS_ID \
    --skip-final-snapshot \
    --region $REGION
  echo "⏳ RDS deletion initiated (takes 5-10 minutes)"
fi

# 8. Delete ElastiCache if exists
REDIS_ID="feedbot-redis"
if aws elasticache describe-cache-clusters --cache-cluster-id $REDIS_ID --region $REGION 2>/dev/null; then
  echo "🗑️  Deleting ElastiCache: $REDIS_ID"
  aws elasticache delete-cache-cluster \
    --cache-cluster-id $REDIS_ID \
    --region $REGION
fi

# 9. Delete ECS Cluster if exists
CLUSTER_NAME="feedbot-cluster"
if aws ecs describe-clusters --clusters $CLUSTER_NAME --region $REGION 2>/dev/null | grep -q "ACTIVE"; then
  echo "🗑️  Deleting ECS services..."
  
  # Delete services
  for SERVICE in feedbot-api-service feedbot-worker-service; do
    aws ecs update-service \
      --cluster $CLUSTER_NAME \
      --service $SERVICE \
      --desired-count 0 \
      --region $REGION 2>/dev/null || true
    
    aws ecs delete-service \
      --cluster $CLUSTER_NAME \
      --service $SERVICE \
      --force \
      --region $REGION 2>/dev/null || true
  done
  
  echo "🗑️  Deleting ECS cluster: $CLUSTER_NAME"
  aws ecs delete-cluster --cluster $CLUSTER_NAME --region $REGION
fi

# 10. Delete ALB if exists
ALB_ARN=$(aws elbv2 describe-load-balancers \
  --names feedbot-alb \
  --query 'LoadBalancers[0].LoadBalancerArn' \
  --output text \
  --region $REGION 2>/dev/null || echo "")

if [ "$ALB_ARN" != "" ] && [ "$ALB_ARN" != "None" ]; then
  echo "🗑️  Deleting Application Load Balancer"
  aws elbv2 delete-load-balancer --load-balancer-arn $ALB_ARN --region $REGION
fi

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "💰 Your AWS bill should now be $0/month"
echo ""
echo "⚠️  Note: Some resources (RDS, ElastiCache) take time to delete"
echo "   Check AWS Console in 10-15 minutes to confirm everything is gone"
echo ""
echo "📊 Check your billing dashboard:"
echo "   https://console.aws.amazon.com/billing/home"
