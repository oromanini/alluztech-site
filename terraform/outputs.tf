output "service_account_email" {
  description = "Email of GitHub Actions service account"
  value       = google_service_account.github_actions.email
}

output "cloud_run_service_account_email" {
  description = "Email of Cloud Run application service account"
  value       = google_service_account.cloud_run.email
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

output "next_steps" {
  description = "Next steps after terraform apply"
  value       = <<-EOT
    Infrastructure is ready! Next steps:

    1. Generate GitHub Actions service account key:
       gcloud iam service-accounts keys create sa-key.json \
         --iam-account=${google_service_account.github_actions.email}

    2. Add GitHub Secrets:
       - GCP_PROJECT_ID: ${var.gcp_project_id}
       - GCP_SA_KEY: (content of sa-key.json)

    3. Push to main branch to trigger GitHub Actions deployment.
       The Cloud Run service will be created automatically on first deploy.
  EOT
}
