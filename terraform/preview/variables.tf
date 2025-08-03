variable "aws_region" {
  description = "The AWS Region the project is hosted in."
  type        = string
}

variable "image_repository" {
  description = "The repository name of the docker image in ECR."
  type        = string
}

variable "image_tag" {
  description = "The image tag in ECR. (e.g.: latest)"
  type        = string
}

variable "cloudflare_account_id" {
  type = string
}

variable "cloudflare_api_token" {
  type      = string
  sensitive = true
}

variable "aws_secret_manager_id" {
  type = string
}

variable "lambda_from_email_address" {
  type = string
}

variable "lambda_to_email_address" {
  type = string
}