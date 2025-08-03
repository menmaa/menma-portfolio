output "api_url" {
  value = "https://${aws_route53_record.cf_custom_domain_map.name}"
}