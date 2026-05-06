# Artifact Registry repository for Docker images
resource "google_artifact_registry_repository" "app" {
  location      = var.gcp_region
  repository_id = var.app_name
  description   = "Docker images for ${var.app_name}"
  format        = "DOCKER"

  depends_on = [google_project_service.artifact_registry]
}
