module "vpc" {
  source                 = "terraform-aws-modules/vpc/aws"
  name                   = "${var.name}-${var.env}"
  cidr                   = "10.0.0.0/16"
  azs                    = ["${var.region}a", "${var.region}b", "${var.region}c"]
  private_subnets        = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets         = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
  database_subnets       = ["10.0.201.0/24", "10.0.202.0/24", "10.0.203.0/24"]
  one_nat_gateway_per_az = true
  enable_nat_gateway     = true
}

data "aws_acm_certificate" "certificate" {
  domain   = "*.${var.domain_name}"
  statuses = ["ISSUED"]
}

resource "aws_security_group" "ecs_security_group" {
  name        = "${var.name}-ecs-sec-grp-${var.env}"
  description = "Allow traffic in to port ${var.container_port} and all outbound traffic"
  vpc_id      = module.vpc.vpc_id
  ingress {
    from_port   = var.container_port
    to_port     = var.container_port
    protocol    = "TCP"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "alb_security_group" {
  name        = "${var.name}-alb-sec-grp-${var.env}"
  description = "Allow HTTP and HTTPS traffic in, and all outbound traffic"
  vpc_id      = module.vpc.vpc_id
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "TCP"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "TCP"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# vpc
#   cidr block 10.0.0.0/16 (10.0.X.X)
#   public subnet
#     cidr block 10.0.1.0/25 (10.0.1.Xish)
#     public route table
#       IGW -> 0.0.0.0/0 (all IPs)
#     NAT gateway
#   private subnet
#     cidr block 10.0.2.0/25 (10.0.2.Xish)
#     private route table
#       NGW -> 0.0.0.0/0 (all IPs)
#   http security group - ALB
#     allow TCP port 80 to 0.0.0.0/0 CIDR blocks
#   https security group - ALB
#     allow TCP port 443 to 0.0.0.0/0 CIDR blocks
#   ingress security group - ECS
#     allow TCP port 3000 to 0.0.0.0/0
#   egress security group - ECS and ALB
#     allow to port 0 from port 0 protocol -1 all CIDR blocks