output "service_account_email" {
  description = "Email of GitHub Actions service account (use for GCP_SA_KEY)"
  value       = google_service_account.github_actions.email
}

output "cloud_run_service_url" {
  description = "URL of the deployed Cloud Run service"
  value       = google_cloud_run_service.app.status[0].url
}

output "cloud_run_service_name" {
  description = "Name of the Cloud Run service"
  value       = google_cloud_run_service.app.name
}

output "gcp_project_id" {
  description = "GCP Project ID"
  value       = var.gcp_project_id
}

output "gcp_region" {
  description = "GCP Region"
  value       = var.gcp_region
}

output "gcr_repository" {
  description = "Google Container Registry repository URL"
  value       = "gcr.io/${var.gcp_project_id}"
}

output "github_actions_setup" {
  description = "Next steps for GitHub Actions setup"
  value       = <<-EOT
    1. Generate service account key:
       gcloud iam service-accounts keys create sa-key.json \
         --iam-account=${google_service_account.github_actions.email}

    2. Encode key to base64:
       cat sa-key.json | base64 -w0

    3. Add to GitHub Secrets:
       - GCP_PROJECT_ID: ${var.gcp_project_id}
       - GCP_SA_KEY: <base64-encoded-key>

    4. Push a change to main branch to trigger deployment
  EOT
}
