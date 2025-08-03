terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "6.0.0"
    }

    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5"
    }
  }

  backend "s3" {
    bucket         = "hoshinomenma"
    key            = "portfolio/infrastructure/production/state/terraform.tfstate"
    region         = "eu-central-1"
    encrypt        = true
    dynamodb_table = "MenmaPortfolioTerraformLockId"
  }
}

provider "aws" {
  region = var.aws_region
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}