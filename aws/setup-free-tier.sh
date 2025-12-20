#!/bin/bash
set -e

echo "🎁 Setting up FREE TIER optimized AWS infrastructure..."
echo "This setup maximizes your 6-month free tier benefits!"
echo ""

# Configuration
REGION="us-east-1"
KEY_NAME="feedbot-key"
INSTANCE_TYPE="t3.small"  # $15/month after free tier

# 1. Create key pair if doesn't exist
if ! aws ec2 describe-key-pairs --key-names $KEY_NAME --region $REGION 2>/dev/null; then
  echo "🔑 Creating SSH key pair..."
  aws ec2 create-key-pair --key-name $KEY_NAME --region $REGION --query 'KeyMaterial' --output text > $KEY_NAME.pem
  chmod 400 $KEY_NAME.pem
  echo "✅ Key saved to $KEY_NAME.pem (keep this safe!)"
else
  echo "✅ Key pair $KEY_NAME already exists"
fi

# 2. Create VPC
echo "📦 Creating VPC..."
VPC_ID=$(aws ec2 create-vpc \
  --cidr-block 10.0.0.0/16 \
  --tag-specifications "ResourceType=vpc,Tags=[{Key=Name,Value=feedbot-vpc}]" \
  --query 'Vpc.VpcId' \
  --output text \
  --region $REGION)

aws ec2 modify-vpc-attribute --vpc-id $VPC_ID --enable-dns-support --region $REGION
aws ec2 modify-vpc-attribute --vpc-id $VPC_ID --enable-dns-hostnames --region $REGION

# 3. Create Internet Gateway
echo "🌐 Creating Internet Gateway..."
IGW_ID=$(aws ec2 create-internet-gateway \
  --tag-specifications "ResourceType=internet-gateway,Tags=[{Key=Name,Value=feedbot-igw}]" \
  --query 'InternetGateway.InternetGatewayId' \
  --output text \
  --region $REGION)

aws ec2 attach-internet-gateway --vpc-id $VPC_ID --internet-gateway-id $IGW_ID --region $REGION

# 4. Create Public Subnet
echo "📍 Creating Public Subnet..."
PUBLIC_SUBNET=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block 10.0.1.0/24 \
  --availability-zone ${REGION}a \
  --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=feedbot-public}]" \
  --query 'Subnet.SubnetId' \
  --output text \
  --region $REGION)

aws ec2 modify-subnet-attribute --subnet-id $PUBLIC_SUBNET --map-public-ip-on-launch --region $REGION

# 5. Create Route Table
echo "🛣️  Setting up routing..."
RT_ID=$(aws ec2 create-route-table \
  --vpc-id $VPC_ID \
  --tag-specifications "ResourceType=route-table,Tags=[{Key=Name,Value=feedbot-public-rt}]" \
  --query 'RouteTable.RouteTableId' \
  --output text \
  --region $REGION)

aws ec2 create-route --route-table-id $RT_ID --destination-cidr-block 0.0.0.0/0 --gateway-id $IGW_ID --region $REGION
aws ec2 associate-route-table --subnet-id $PUBLIC_SUBNET --route-table-id $RT_ID --region $REGION

# 6. Create Security Group
echo "🔒 Creating Security Group..."
SG_ID=$(aws ec2 create-security-group \
  --group-name feedbot-app-sg \
  --description "Security group for Feedbot application" \
  --vpc-id $VPC_ID \
  --query 'GroupId' \
  --output text \
  --region $REGION)

# Allow SSH, HTTP, and API access
aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 22 --cidr 0.0.0.0/0 --region $REGION
aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 80 --cidr 0.0.0.0/0 --region $REGION
aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 443 --cidr 0.0.0.0/0 --region $REGION
aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 8000 --cidr 0.0.0.0/0 --region $REGION

# 7. Create User Data Script
cat > user-data.sh << 'EOF'
#!/bin/bash
yum update -y
yum install -y docker git

# Start Docker
systemctl start docker
systemctl enable docker
usermod -a -G docker ec2-user

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Clone repository
cd /home/ec2-user
sudo -u ec2-user git clone https://github.com/Creat1ve-shubh/Feedbot.git

# Create .env file (update with your credentials)
cd Feedbot/backend
cat > .env << 'ENVEOF'
APP_ENV=production
DB_HOST=localhost
DB_PORT=5432
DB_NAME=branddb
DB_USER=postgres
DB_PASSWORD=secure_password_here

REDIS_URL=redis://localhost:6379/0

REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_secret
REDDIT_USER_AGENT=Feedbot/1.0

TWITTER_BEARER_TOKEN=your_twitter_token
ENVEOF

chown ec2-user:ec2-user .env

# Start services
sudo -u ec2-user docker-compose up -d

echo "✅ Feedbot is running!"
echo "API: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):8000"
EOF

# 8. Launch EC2 Instance
echo "🚀 Launching EC2 instance (t3.small - FREE TIER eligible)..."
INSTANCE_ID=$(aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type $INSTANCE_TYPE \
  --key-name $KEY_NAME \
  --security-group-ids $SG_ID \
  --subnet-id $PUBLIC_SUBNET \
  --user-data file://user-data.sh \
  --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=feedbot-app}]" \
  --block-device-mappings '[{"DeviceName":"/dev/xvda","Ebs":{"VolumeSize":20,"VolumeType":"gp2"}}]' \
  --query 'Instances[0].InstanceId' \
  --output text \
  --region $REGION)

echo "⏳ Waiting for instance to start..."
aws ec2 wait instance-running --instance-ids $INSTANCE_ID --region $REGION

# Get public IP
PUBLIC_IP=$(aws ec2 describe-instances \
  --instance-ids $INSTANCE_ID \
  --query 'Reservations[0].Instances[0].PublicIpAddress' \
  --output text \
  --region $REGION)

echo ""
echo "✅ FREE TIER Setup Complete!"
echo ""
echo "📋 Instance Details:"
echo "  Instance ID: $INSTANCE_ID"
echo "  Public IP: $PUBLIC_IP"
echo "  SSH Key: $KEY_NAME.pem"
echo ""
echo "🔗 Access your application:"
echo "  API: http://$PUBLIC_IP:8000"
echo "  Health: http://$PUBLIC_IP:8000/health"
echo ""
echo "🔑 Connect via SSH:"
echo "  ssh -i $KEY_NAME.pem ec2-user@$PUBLIC_IP"
echo ""
echo "📊 Monitor setup progress:"
echo "  ssh -i $KEY_NAME.pem ec2-user@$PUBLIC_IP 'tail -f /var/log/cloud-init-output.log'"
echo ""
echo "💰 Current costs: \$0/month (within free tier)"
echo "   After 6 months: ~\$15/month for t3.small"
echo ""
echo "⏰ Setup takes 5-10 minutes. Check http://$PUBLIC_IP:8000/health when ready!"
