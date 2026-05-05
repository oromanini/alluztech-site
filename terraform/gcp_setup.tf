# Enable required GCP APIs
resource "google_project_service" "compute" {
  service            = "compute.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "cloud_run" {
  service            = "run.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "container_registry" {
  service            = "containerregistry.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "secret_manager" {
  service            = "secretmanager.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "iam" {
  service            = "iam.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "cloud_build" {
  service            = "cloudbuild.googleapis.com"
  disable_on_destroy = false
}

# Service Account for GitHub Actions
resource "google_service_account" "github_actions" {
  account_id   = "github-actions-deployer"
  display_name = "GitHub Actions for Cloud Run deployment"
  description  = "Service account for GitHub Actions CI/CD pipeline"
}

# Cloud Run Service Account (for the actual application)
resource "google_service_account" "cloud_run" {
  account_id   = "cloud-run-app"
  display_name = "Cloud Run Application Service Account"
  description  = "Service account for alluz-tech Cloud Run application"
}

# IAM Roles for GitHub Actions Service Account
resource "google_project_iam_member" "github_run_admin" {
  project = var.gcp_project_id
  role    = "roles/run.admin"
  member  = "serviceAccount:${google_service_account.github_actions.email}"
  depends_on = [
    google_project_service.cloud_run,
    google_project_service.iam
  ]
}

resource "google_project_iam_member" "github_storage_admin" {
  project = var.gcp_project_id
  role    = "roles/storage.admin"
  member  = "serviceAccount:${google_service_account.github_actions.email}"
  depends_on = [
    google_project_service.container_registry,
    google_project_service.iam
  ]
}

resource "google_project_iam_member" "github_service_account_user" {
  project    = var.gcp_project_id
  role       = "roles/iam.serviceAccountUser"
  member     = "serviceAccount:${google_service_account.github_actions.email}"
  depends_on = [google_project_service.iam]
}

resource "google_project_iam_member" "github_secret_accessor" {
  project = var.gcp_project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.github_actions.email}"
  depends_on = [
    google_project_service.secret_manager,
    google_project_service.iam
  ]
}

# IAM Roles for Cloud Run Service Account (to access secrets)
resource "google_project_iam_member" "cloud_run_secret_accessor" {
  project = var.gcp_project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.cloud_run.email}"
  depends_on = [
    google_project_service.secret_manager,
    google_project_service.iam
  ]
}
