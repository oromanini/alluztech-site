# Cloud Run Service
resource "google_cloud_run_service" "app" {
  name     = var.app_name
  location = var.gcp_region

  template {
    spec {
      service_account_name = google_service_account.cloud_run.email

      containers {
        image = "gcr.io/${var.gcp_project_id}/${var.app_name}:latest"

        ports {
          container_port = var.app_port
        }

        # Environment variables
        env {
          name  = "NODE_ENV"
          value = "production"
        }

        env {
          name  = "PORT"
          value = var.app_port
        }

        env {
          name  = "GROQ_MODEL"
          value = var.groq_model
        }

        # Secret references from Secret Manager
        env {
          name = "GROQ_API_KEY"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.groq_api_key.secret_id
              key  = "latest"
            }
          }
        }

        env {
          name = "SMTP_HOST"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.smtp_host.secret_id
              key  = "latest"
            }
          }
        }

        env {
          name = "SMTP_USER"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.smtp_user.secret_id
              key  = "latest"
            }
          }
        }

        env {
          name = "SMTP_PASS"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.smtp_pass.secret_id
              key  = "latest"
            }
          }
        }

        env {
          name = "CONTACT_EMAIL"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.contact_email.secret_id
              key  = "latest"
            }
          }
        }

        # Resource requests
        resources {
          limits = {
            memory = var.cloud_run_memory
            cpu    = var.cloud_run_cpu
          }
        }
      }

      # Container concurrency
      container_concurrency = var.cloud_run_concurrency
      timeout_seconds       = var.cloud_run_timeout
    }

    metadata {
      annotations = {
        "autoscaling.knative.dev/maxScale" = var.cloud_run_max_instances
        "autoscaling.knative.dev/minScale" = var.cloud_run_min_instances
      }
    }
  }

  # Allow public access
  traffic {
    percent         = 100
    latest_revision = true
  }

  depends_on = [
    google_project_service.cloud_run,
    google_secret_manager_secret_version.groq_api_key,
    google_secret_manager_secret_version.smtp_host,
    google_secret_manager_secret_version.smtp_user,
    google_secret_manager_secret_version.smtp_pass,
    google_secret_manager_secret_version.contact_email,
  ]
}

# Allow unauthenticated access to Cloud Run service
resource "google_cloud_run_service_iam_member" "public_access" {
  service    = google_cloud_run_service.app.name
  location   = google_cloud_run_service.app.location
  role       = "roles/run.invoker"
  member     = "allUsers"
  depends_on = [google_cloud_run_service.app]
}
