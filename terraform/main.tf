terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }

  # Backend local - considerando mudar para GCS em produção
  # Descomente abaixo para usar Google Cloud Storage como backend
  # backend "gcs" {
  #   bucket = "your-terraform-state-bucket"
  #   prefix = "alluztech-site"
  # }
}

provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
}

provider "google-beta" {
  project = var.gcp_project_id
  region  = var.gcp_region
}
