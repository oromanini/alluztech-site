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

resource "google_secret_manager_secret" "smtp_host" {
  secret_id = "smtp-host"

  labels = {
    environment = "production"
    app         = var.app_name
  }

  replication {
    auto {}
  }

  depends_on = [google_project_service.secret_manager]
}

resource "google_secret_manager_secret_version" "smtp_host" {
  secret      = google_secret_manager_secret.smtp_host.id
  secret_data = var.smtp_host
}

resource "google_secret_manager_secret" "smtp_user" {
  secret_id = "smtp-user"

  labels = {
    environment = "production"
    app         = var.app_name
  }

  replication {
    auto {}
  }

  depends_on = [google_project_service.secret_manager]
}

resource "google_secret_manager_secret_version" "smtp_user" {
  secret      = google_secret_manager_secret.smtp_user.id
  secret_data = var.smtp_user
}

resource "google_secret_manager_secret" "smtp_pass" {
  secret_id = "smtp-pass"

  labels = {
    environment = "production"
    app         = var.app_name
  }

  replication {
    auto {}
  }

  depends_on = [google_project_service.secret_manager]
}

resource "google_secret_manager_secret_version" "smtp_pass" {
  secret      = google_secret_manager_secret.smtp_pass.id
  secret_data = var.smtp_pass
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
