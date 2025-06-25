variable "image_uri" {
  description = "The URI of the docker image in ECR"
  type        = string
}

variable "domain_name" {
  description = "The custom domain name to be used for the API Gateway"
  type        = string
}

variable "cloudflare_zone_id" {
  type = string
}

variable "cloudflare_api_key" {
  type      = string
  sensitive = true
}
