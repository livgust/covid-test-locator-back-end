locals {
  node_env_mapping = {
    prod = "production"
    dev  = "development"
  }
  ecs_task_container_name = "${var.name}-${var.env}"
}

resource "aws_ecr_repository" "ecr" {
  name                 = "${var.name}-${var.env}"
  image_tag_mutability = "MUTABLE"
}

resource "aws_ecs_cluster" "ecs_cluster" {
  name = "${var.name}-${var.env}"
}

resource "aws_ecs_service" "ecs_service" {
  name            = "${var.name}-${var.env}"
  cluster         = aws_ecs_cluster.ecs_cluster.arn
  task_definition = aws_ecs_task_definition.ecs_task_definition.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  network_configuration {
    subnets         = module.vpc.private_subnets
    security_groups = [aws_security_group.ecs_security_group.id]
  }
  load_balancer {
    target_group_arn = aws_alb_target_group.main.arn
    container_name   = local.ecs_task_container_name
    container_port   = var.container_port
  }
}

resource "aws_ecs_task_definition" "ecs_task_definition" {
  family                   = "${var.name}-${var.env}"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  container_definitions = jsonencode([
    {
      "name" : local.ecs_task_container_name,
      "image" : var.image_name,
      "essential" : true,
      "environment" : [{
        "name" : "NODE_ENV",
        "value" : local.node_env_mapping[var.env]
      }]
      portMappings = [{
        protocol      = "tcp"
        containerPort = var.container_port
        hostPort      = var.container_port
      }]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.log_group.name
          awslogs-region        = var.region
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])
}