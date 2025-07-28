data "aws_ecr_image" "fotismakris_portfolio_image" {
  repository_name = var.image_repository
  image_tag       = var.image_tag
}

data "aws_route53_zone" "custom_domain_zone" {
  name = var.domain_name
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
}

resource "aws_acm_certificate_validation" "custom_domain_validation" {
  certificate_arn         = aws_acm_certificate.custom_domain_cert.arn
  validation_record_fqdns = [for record in aws_route53_record.domain_validation_record : record.fqdn]
}

resource "aws_apigatewayv2_domain_name" "apigw_custom_domain" {
  domain_name = var.domain_name

  domain_name_configuration {
    certificate_arn = aws_acm_certificate.custom_domain_cert.arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }

  depends_on = [aws_acm_certificate_validation.custom_domain_validation]
}

resource "aws_apigatewayv2_api_mapping" "apigw_mapping" {
  api_id      = aws_apigatewayv2_api.http_api.id
  domain_name = aws_apigatewayv2_domain_name.apigw_custom_domain.id
  stage       = aws_apigatewayv2_stage.default.id
}

resource "aws_route53_record" "apigw_custom_domain_map" {
  zone_id = data.aws_route53_zone.custom_domain_zone.zone_id
  name = aws_apigatewayv2_domain_name.apigw_custom_domain.domain_name
  type = "A"
  records = [aws_apigatewayv2_domain_name.apigw_custom_domain.domain_name_configuration[0].target_domain_name]
}
