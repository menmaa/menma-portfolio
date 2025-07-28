terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "6.0.0"
    }
  }

  backend "s3" {
    bucket         = "hoshinomenma"
    key            = "portfolio/infrastructure/state/terraform.tfstate"
    region         = "eu-central-1"
    encrypt        = true
    dynamodb_table = "MenmaPortfolioTerraformLockId"
  }
}

provider "aws" {
  region = "eu-central-1"
}
