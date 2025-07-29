data "aws_ecr_image" "fotismakris_portfolio_image" {
  repository_name = var.image_repository
  image_tag       = var.image_tag
}

data "aws_route53_zone" "custom_domain_zone" {
  name         = var.domain_name
  private_zone = false
}

resource "aws_iam_role" "lambda_exec" {
  name = "FotisMakrisPortfolioExecRole"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect    = "Allow",
      Principal = { Service = "lambda.amazonaws.com" },
      Action    = "sts:AssumeRole",
    }]
  })
}

resource "aws_iam_role_policy" "lambda_exec_policy" {
  name = "FotisMakrisPortfolioLambdaExecPermissions"
  role = aws_iam_role.lambda_exec.name
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Action = [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "secretsmanager:GetSecretValue",
        "ses:SendEmail",
      ],
      Resource = "*"
    }]
  })
}

resource "aws_lambda_function" "fotismakris_portfolio_function" {
  function_name = "FotisMakrisPortfolioFunction"
  role          = aws_iam_role.lambda_exec.arn
  package_type  = "Image"
  image_uri     = data.aws_ecr_image.fotismakris_portfolio_image.image_uri
  timeout       = 30
  memory_size   = 512
  architectures = ["x86_64"]
}

resource "aws_apigatewayv2_api" "http_api" {
  name          = "FotisMakrisPortfolioAPI"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id                 = aws_apigatewayv2_api.http_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.fotismakris_portfolio_function.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "proxy" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.http_api.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_lambda_permission" "apigw_invoke" {
  statement_id  = "AllowAPIGatewayExecution"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.fotismakris_portfolio_function.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}

resource "aws_acm_certificate" "custom_domain_cert" {
  domain_name       = var.domain_name
  validation_method = "DNS"
  region            = "us-east-1"
}

resource "aws_route53_record" "domain_validation_record" {
  for_each = {
    for dvo in aws_acm_certificate.custom_domain_cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      type   = dvo.resource_record_type
      record = dvo.resource_record_value
    }
  }

  zone_id = data.aws_route53_zone.custom_domain_zone.zone_id
  name    = each.value.name
  type    = each.value.type
  records = [each.value.record]
  ttl     = 300
}

resource "aws_acm_certificate_validation" "custom_domain_validation" {
  certificate_arn         = aws_acm_certificate.custom_domain_cert.arn
  validation_record_fqdns = [for record in aws_route53_record.domain_validation_record : record.fqdn]
  region                  = "us-east-1"
}

locals {
  cf_origin_id  = aws_apigatewayv2_api.http_api.id
  api_gw_id     = aws_apigatewayv2_api.http_api.id
  api_gw_region = aws_apigatewayv2_api.http_api.region
}

resource "aws_cloudfront_distribution" "cloudfront_distribution" {
  origin {
    domain_name = "${local.api_gw_id}.execute-api.${local.api_gw_region}.amazonaws.com"
    origin_id   = local.cf_origin_id

    custom_origin_config {
      http_port              = "80"
      https_port             = "443"
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  enabled         = true
  is_ipv6_enabled = true
  aliases         = [var.domain_name]

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS", "POST", "PATCH", "PUT", "DELETE"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = local.cf_origin_id
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
  }

  viewer_certificate {
    acm_certificate_arn = aws_acm_certificate.custom_domain_cert.arn
    ssl_support_method = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}

resource "aws_route53_record" "cf_custom_domain_map" {
  zone_id = data.aws_route53_zone.custom_domain_zone.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.cloudfront_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.cloudfront_distribution.hosted_zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "cf_custom_domain_map_ipv6" {
  zone_id = data.aws_route53_zone.custom_domain_zone.zone_id
  name    = var.domain_name
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.cloudfront_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.cloudfront_distribution.hosted_zone_id
    evaluate_target_health = true
  }
}
