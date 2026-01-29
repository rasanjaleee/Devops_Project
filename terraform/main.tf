# Specify the AWS provider and region
provider "aws" {
  region = "ap-south-1"  # Change to your preferred AWS region
}

# Create an AWS key pair from your local SSH public key
resource "aws_key_pair" "devops_key" {
  key_name   = "devops-key"
  public_key = file("~/.ssh/devops-key.pub")
}

# Security group for the EC2 instance
resource "aws_security_group" "devops_sg" {
  name        = "devops-sg"
  description = "Allow SSH, HTTP, app, and database ports"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 5173
    to_port     = 5173
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 27017
    to_port     = 27017
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Get the latest Amazon Linux 2 AMI
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

# EC2 instance running Docker and your containers
resource "aws_instance" "devops_ec2" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = "t3.micro"
  key_name      = aws_key_pair.devops_key.key_name
  security_groups = [aws_security_group.devops_sg.name]

  user_data = <<-EOF
            #!/bin/bash
            yum update -y
            amazon-linux-extras install docker -y
            service docker start
            usermod -a -G docker ec2-user

            # Create Docker volume for MongoDB
            docker volume create mongo-data

            # Pull and run MongoDB
            docker run -d \
              --name mern-mongodb \
              -p 27017:27017 \
              -v mongo-data:/data/db \
              mongo:7.0

            # Pull and run backend from Docker Hub
            docker pull rasanjalee/devops_project_backend:latest
            docker run -d \
              --name mern-backend \
              -p 5000:5000 \
              --link mern-mongodb \
              rasanjalee/devops_project_backend:latest

            # Pull and run frontend from Docker Hub
            docker pull rasanjalee/devops_project_frontend:latest
            docker run -d \
              --name mern-frontend \
              -p 5173:80 \
              --link mern-backend \
              rasanjalee/devops_project_frontend:latest
        EOF

  tags = {
    Name = "DevOps-EC2"
  }
}
