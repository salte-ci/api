variable "DO_DOCKER_CA_CERT" {}
variable "DO_DOCKER_CLIENT_CERT" {}
variable "DO_DOCKER_CLIENT_KEY" {}
variable "DO_PRIVATE_SSH_KEY" {}

variable "BITBUCKET_CLIENT_ID" {}
variable "BITBUCKET_CLIENT_SECRET" {}
variable "GITHUB_CLIENT_ID" {}
variable "GITHUB_CLIENT_SECRET" {}
variable "GITLAB_CLIENT_ID" {}
variable "GITLAB_CLIENT_SECRET" {}

variable "IMAGE" {}

terraform {
  backend "s3" {
    bucket = "salte-ci"
    key    = "salte-ci-api.tfstate"
    region = "us-east-1"
  }
}

locals {
  environment = "${terraform.workspace}"
  domain_name = "${local.environment == "live" ? "api.salte.ci" : "api.${local.environment}.salte.ci"}"
  application = "${local.environment}-salte-ci-api"
  database_volume = "/data/${local.application}"
  audience = "${local.environment == "live" ? "https://api.salte.ci" : "https://api.${local.environment}.salte.ci"}"
  provider_redirect_uri = "${local.environment == "live" ? "https://salte.ci" : "https://${local.environment}.salte.ci"}"

  default_providers = [{
    name = "github"
    friendly_name = "GitHub"
    type = "github"
    url = "https://github.com"
    api_url = "https://api.github.com"
    client_id = "${var.GITHUB_CLIENT_ID}"
    client_secret = "${var.GITHUB_CLIENT_SECRET}"
  }, {
    name = "bitbucket"
    friendly_name = "Bitbucket"
    type = "bitbucket"
    url = "https://bitbucket.org"
    api_url = "https://api.bitbucket.org"
    client_id = "${var.BITBUCKET_CLIENT_ID}"
    client_secret = "${var.BITBUCKET_CLIENT_SECRET}"
  }, {
    name = "gitlab"
    friendly_name = "GitLab"
    type = "gitlab"
    url = "https://gitlab.com"
    api_url = "https://gitlab.com"
    client_id = "${var.GITLAB_CLIENT_ID}"
    client_secret = "${var.GITLAB_CLIENT_SECRET}"
  }]
}

# Configure the Docker provider
provider "docker" {
  host = "tcp://manager.salte.io:2376/"

  ca_material   = "${base64decode(var.DO_DOCKER_CA_CERT)}"
  cert_material = "${base64decode(var.DO_DOCKER_CLIENT_CERT)}"
  key_material  = "${base64decode(var.DO_DOCKER_CLIENT_KEY)}"
}

resource "random_string" "user" {
  length  = 20
  special = false

  keepers {
    timestamp = "${timestamp()}"
  }
}

resource "random_string" "password" {
  length  = 20
  special = false

  keepers {
    timestamp = "${timestamp()}"
  }
}

resource "random_string" "secret_suffix" {
  length  = 5
  special = false

  keepers {
    timestamp = "${timestamp()}"
  }
}

resource "docker_secret" "mysql_user" {
  name = "salte_ci_mysql_user_${local.environment}_${random_string.secret_suffix.result}"
  data = "${base64encode(random_string.user.result)}"

  lifecycle {
    create_before_destroy = true
  }
}

resource "docker_secret" "mysql_password" {
  name = "salte_ci_mysql_password_${local.environment}_${random_string.secret_suffix.result}"
  data = "${base64encode(random_string.password.result)}"

  lifecycle {
    create_before_destroy = true
  }
}

resource "docker_secret" "database_url" {
  name = "salte_ci_database_url_${local.environment}_${random_string.secret_suffix.result}"
  data = "${base64encode("mysql://${random_string.user.result}:${random_string.password.result}@${docker_service.database.name}/salte-ci")}"

  lifecycle {
    create_before_destroy = true
  }
}

resource "docker_secret" "default_providers" {
  name = "salte_ci_default_providers_${local.environment}_${random_string.secret_suffix.result}"
  data = "${base64encode(jsonencode(local.default_providers))}"

  lifecycle {
    create_before_destroy = true
  }
}

resource "docker_network" "database" {
  name   = "${local.application}-database"
  driver = "overlay"
}

resource "null_resource" "database_volume" {
  connection {
    private_key = "${base64decode(var.DO_PRIVATE_SSH_KEY)}"
    host        = "manager.salte.io"
    type        = "ssh"
  }

  provisioner "remote-exec" {
    inline = [
      "set -eou pipefail",
      "mkdir -p ${local.database_volume}"
    ]
  }

  provisioner "remote-exec" {
    inline = [
      "set -eou pipefail",
      "rm -rf ${local.database_volume}"
    ]
    when = "destroy"
  }
}


resource "docker_service" "database" {
  name     = "${local.application}-database"

  task_spec {
    container_spec {
      image = "mariadb:10.3"

      env {
        MYSQL_DATABASE           = "salte-ci"
        MYSQL_USER_FILE          = "/run/secrets/mysql_user"
        MYSQL_PASSWORD_FILE      = "/run/secrets/mysql_password"
        MYSQL_ROOT_PASSWORD_FILE = "/run/secrets/mysql_password"
      }

      mounts = [{
        target      = "/var/lib/mysql"
        source      = "${local.database_volume}"
        type        = "bind"
        read_only   = false
      }]

      secrets = [{
        secret_id   = "${docker_secret.mysql_user.id}"
        secret_name = "${docker_secret.mysql_user.name}"
        file_name   = "/run/secrets/mysql_user"
      }, {
        secret_id   = "${docker_secret.mysql_password.id}"
        secret_name = "${docker_secret.mysql_password.name}"
        file_name   = "/run/secrets/mysql_password"
      }]
    }

    networks = ["${docker_network.database.id}"]

    resources {}

    restart_policy {
      condition = "any"
      delay     = "5s"
      max_attempts = 4
      window       = "10s"
    }
  }

  mode {
    replicated {
      replicas = 1
    }
  }

  endpoint_spec {
    mode = "vip"
    ports {
      target_port    = "3306"
    }
  }
}

resource "docker_service" "api" {
  name = "${local.application}"

  labels {
    "traefik.docker.network"       = "dmz"
    "traefik.enable"               = "true"
    "traefik.frontend.rule"        = "Host:${local.domain_name}"
    "traefik.port"                 = 8080
    "traefik.protocol"             = "http"
    "traefik.frontend.entryPoints" = "https"
  }

  task_spec {
    container_spec {
      image = "${var.IMAGE}"

      env {
        LOG_LEVEL = "info"
        ENVIRONMENT = "${local.environment}"
        AUDIENCE = "${local.audience}"
        PROVIDER_REDIRECT_URI = "${local.provider_redirect_uri}"
      }

      secrets = [{
        secret_id   = "${docker_secret.database_url.id}"
        secret_name = "${docker_secret.database_url.name}"
        file_name   = "/run/secrets/database_url"
      }, {
        secret_id   = "${docker_secret.default_providers.id}"
        secret_name = "${docker_secret.default_providers.name}"
        file_name   = "/run/secrets/default_providers"
      }]
    }

    resources {}

    restart_policy {
      condition = "any"
      delay     = "5s"
      max_attempts = 4
      window       = "10s"
    }

    networks = [
      "${docker_network.database.id}",
      "dmz"
    ]
  }

  mode {
    replicated {
      replicas = 1
    }
  }
}
