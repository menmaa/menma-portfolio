variable "image_repository" {
  description = "The repository name of the docker image in ECR"
  type        = string
}

variable "image_tag" {
  description = "The image tag in ECR (e.g.: latest)"
  type        = string
}

variable "domain_name" {
  description = "The custom domain name to be used for the API Gateway"
  type        = string
}

variable "cloudflare_account_id" {
  type = string
}

variable "cloudflare_api_token" {
  type      = string
  sensitive = true
}
