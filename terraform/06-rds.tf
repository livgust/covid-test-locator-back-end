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

  vpc_id                 = module.vpc.vpc_id
  allowed_cidr_blocks    = module.vpc.private_subnets_cidr_blocks
  db_subnet_group_name   = module.vpc.database_subnet_group_name
  create_db_subnet_group = false
  create_security_group  = true

  iam_database_authentication_enabled = true
  create_random_password              = true

  storage_encrypted               = true
  apply_immediately               = true
  monitoring_interval             = 60
  enabled_cloudwatch_logs_exports = ["postgresql"]
  deletion_protection             = false # TEMPORARY
  skip_final_snapshot             = true
}