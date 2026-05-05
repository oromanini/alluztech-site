# Secret Manager for sensitive data
resource "google_secret_manager_secret" "groq_api_key" {
  secret_id = "groq-api-key"

  labels = {
    environment = "production"
    app         = var.app_name
  }

  replication {
    auto {}
  }

  depends_on = [google_project_service.secret_manager]
}

resource "google_secret_manager_secret_version" "groq_api_key" {
  secret      = google_secret_manager_secret.groq_api_key.id
  secret_data = var.groq_api_key
}

resource "google_secret_manager_secret" "resend_api_key" {
  secret_id = "resend-api-key"

  labels = {
    environment = "production"
    app         = var.app_name
  }

  replication {
    auto {}
  }

  depends_on = [google_project_service.secret_manager]
}

resource "google_secret_manager_secret_version" "resend_api_key" {
  secret      = google_secret_manager_secret.resend_api_key.id
  secret_data = var.resend_api_key
}

resource "google_secret_manager_secret" "contact_email" {
  secret_id = "contact-email"

  labels = {
    environment = "production"
    app         = var.app_name
  }

  replication {
    auto {}
  }

  depends_on = [google_project_service.secret_manager]
}

resource "google_secret_manager_secret_version" "contact_email" {
  secret      = google_secret_manager_secret.contact_email.id
  secret_data = var.contact_email
}
