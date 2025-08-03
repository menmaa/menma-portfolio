data "aws_ecr_image" "fotismakris_portfolio_image" {
  repository_name = var.image_repository
  image_tag       = var.image_tag
}

resource "aws_iam_role" "lambda_exec" {
  name = "FotisMakrisPortfolioExecRolePreview"
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
  name = "FotisMakrisPortfolioLambdaExecPermissionsPreview"
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
  function_name = "FotisMakrisPortfolioFunctionPreview"
  role          = aws_iam_role.lambda_exec.arn
  package_type  = "Image"
  image_uri     = data.aws_ecr_image.fotismakris_portfolio_image.image_uri
  timeout       = 30
  memory_size   = 512
  architectures = ["x86_64"]

  environment {
    variables = {
      AWS_SECRETS_ID     = var.aws_secret_manager_id
      FROM_EMAIL_ADDRESS = var.lambda_from_email_address
      TO_EMAIL_ADDRESS   = var.lambda_to_email_address
    }
  }
}

resource "aws_apigatewayv2_api" "http_api" {
  name          = "FotisMakrisPortfolioAPI-Preview"
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