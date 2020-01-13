variable "VERSION" {}
variable "GITHUB_CLIENT_ID" {}
variable "GITHUB_CLIENT_SECRET" {}
variable "BITBUCKET_CLIENT_ID" {}
variable "BITBUCKET_CLIENT_SECRET" {}
variable "GITLAB_CLIENT_ID" {}
variable "GITLAB_CLIENT_SECRET" {}

terraform {
  backend "s3" {
    bucket = "salte-ci"
    key    = "salte-ci-api.tfstate"
    region = "us-east-1"
  }
}

locals {
  environment = terraform.workspace
  domain_name = local.environment == "live" ? "api.salte.ci" : "api.${local.environment}.salte.ci"
  audience = local.environment == "live" ? "https://api.salte.ci" : "https://api.${local.environment}.salte.ci"
  provider_redirect_uri = local.environment == "live" ? "https://salte.ci" : "https://${local.environment}.salte.ci"

  default_providers = [{
    name = "github"
    friendly_name = "GitHub"
    type = "github"
    url = "https://github.com"
    api_url = "https://api.github.com"
    client_id = var.GITHUB_CLIENT_ID
    client_secret = var.GITHUB_CLIENT_SECRET
  }, {
    name = "bitbucket"
    friendly_name = "Bitbucket"
    type = "bitbucket"
    url = "https://bitbucket.org"
    api_url = "https://api.bitbucket.org"
    client_id = var.BITBUCKET_CLIENT_ID
    client_secret = var.BITBUCKET_CLIENT_SECRET
  }, {
    name = "gitlab"
    friendly_name = "GitLab"
    type = "gitlab"
    url = "https://gitlab.com"
    api_url = "https://gitlab.com"
    client_id = var.GITLAB_CLIENT_ID
    client_secret = var.GITLAB_CLIENT_SECRET
  }]
}

provider "aws" {
  region = "us-east-1"
}

data "aws_ssm_parameter" "database_url" {
  name = "salte-global-database-url"
}

data "aws_acm_certificate" "certificate" {
  domain   = "*.salte.ci"
  statuses = ["ISSUED"]
}

data "aws_route53_zone" "zone" {
  name         = "salte.ci."
}

module "ecs" {
  source = "git::https://gitlab.com/salte-io/terraform-modules/terraform-aws-ecs.git?ref=1.1.2"

  name        = "salte-ci-api"
  environment = local.environment
  domain_name = local.domain_name
  image_tag   = var.VERSION

  certificate_arn = data.aws_acm_certificate.certificate.arn

  health_check = "/health"

  environment_variables = [{
    name = "LOG_LEVEL"
    value = "info"
  }, {
    name = "AUDIENCE"
    value = local.audience
  }, {
    name = "PROVIDER_REDIRECT_URI"
    value = local.provider_redirect_uri
  }, {
    name = "DEFAULT_PROVIDERS"
    value = jsonencode(local.default_providers)
  }, {
    name = "VERSION"
    value = var.VERSION
  }]

  secrets = [{
    name = "DATABASE_URL",
    valueFrom = data.aws_ssm_parameter.database_url.arn
  }]
}

resource "aws_route53_record" "www" {
  zone_id = data.aws_route53_zone.zone.zone_id
  name    = local.domain_name
  type    = "A"

  alias {
    name                   = module.ecs.dns_name
    zone_id                = module.ecs.zone_id
    evaluate_target_health = true
  }
}
