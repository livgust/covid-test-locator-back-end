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
}

resource "aws_ecr_repository" "ecr" {
  name                 = "${var.name}-${var.env}"
  image_tag_mutability = "MUTABLE"
}