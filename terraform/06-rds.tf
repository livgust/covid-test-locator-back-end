module "cluster" {
  source         = "terraform-aws-modules/rds-aurora/aws"
  name           = "${var.name}-postgres-rds-${var.env}"
  database_name  = var.name_alphanumeric
  engine         = "aurora-postgresql"
  engine_version = "11.12"
  instance_class = "db.t4g.medium"
  instances = {
    one = {}
  }
  autoscaling_enabled      = true
  autoscaling_min_capacity = 1
  autoscaling_max_capacity = 3

  vpc_id                  = module.vpc.vpc_id
  allowed_cidr_blocks     = module.vpc.private_subnets_cidr_blocks
  allowed_security_groups = [aws_security_group.bastion_ssh.id]
  db_subnet_group_name    = module.vpc.database_subnet_group_name
  create_db_subnet_group  = false
  create_security_group   = true

  iam_database_authentication_enabled = true
  create_random_password              = true

  storage_encrypted               = true
  apply_immediately               = true
  monitoring_interval             = 60
  enabled_cloudwatch_logs_exports = ["postgresql"]
  deletion_protection             = true
  skip_final_snapshot             = true
}

data "aws_ami" "ubuntu" {
  most_recent = true
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]
  }
  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
  owners = ["099720109477"] # Canonical
}

resource "aws_security_group" "bastion_ssh" {
  name        = "${var.name}-ssh-${var.env}"
  description = "Allow SSH to database"
  vpc_id      = module.vpc.vpc_id
  ingress {
    description = "SSH from IGW"
    from_port   = 22
    to_port     = 22
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

resource "aws_instance" "bastion" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = "t3.micro"
  vpc_security_group_ids      = [aws_security_group.bastion_ssh.id]
  subnet_id                   = module.vpc.public_subnets[0]
  associate_public_ip_address = true
}