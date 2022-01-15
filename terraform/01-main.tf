terraform {
  backend "s3" {
    bucket = "covid-test-locator-tf"
    key    = "terraform.tfstate"
    region = "us-east-1"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
  default_tags {
    tags = {
      project = var.name
      env     = var.env
    }
  }
}

resource "aws_cloudwatch_log_group" "log_group" {
  name = "${var.name}-${var.env}"
}