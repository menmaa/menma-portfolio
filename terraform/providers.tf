terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "6.0.0"
    }

    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4"
    }
  }
}

provider "aws" {
  region = "eu-central-1"
}

provider "cloudflare" {
  api_token = var.cloudflare_api_key
}
