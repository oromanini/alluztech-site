variable "gcp_project_id" {
  description = "GCP Project ID"
  type        = string
  sensitive   = false
}

variable "gcp_region" {
  description = "GCP Region for resources"
  type        = string
  default     = "us-central1"
}

variable "app_name" {
  description = "Application name"
  type        = string
  default     = "alluz-tech"
}

variable "app_port" {
  description = "Application port"
  type        = number
  default     = 8080
}

variable "cloud_run_memory" {
  description = "Cloud Run memory allocation"
  type        = string
  default     = "256Mi"
}

variable "cloud_run_cpu" {
  description = "Cloud Run CPU allocation"
  type        = string
  default     = "1"
}

variable "cloud_run_min_instances" {
  description = "Minimum Cloud Run instances"
  type        = number
  default     = 0
}

variable "cloud_run_max_instances" {
  description = "Maximum Cloud Run instances"
  type        = number
  default     = 3
}

variable "cloud_run_concurrency" {
  description = "Maximum concurrent requests per instance"
  type        = number
  default     = 80
}

variable "cloud_run_timeout" {
  description = "Cloud Run timeout in seconds"
  type        = number
  default     = 30
}

# Note: Application secrets (GROQ_API_KEY, RESEND_API_KEY, CONTACT_EMAIL)
# are managed by GitHub Actions, which syncs them from GitHub Secrets
# to GCP Secret Manager on every deploy. No local credentials needed.

