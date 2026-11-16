output "project_id" {
  description = "The created GCP / Firebase project ID."
  value       = google_project.this.project_id
}

output "project_number" {
  description = "The numeric project number."
  value       = google_project.this.number
}

output "site_id" {
  description = "The Firebase Hosting site ID (deploy target)."
  value       = google_firebase_hosting_site.this.site_id
}

output "default_url" {
  description = "The default Hosting URL once content is deployed."
  value       = "https://${google_firebase_hosting_site.this.site_id}.web.app"
}

output "console_url" {
  description = "Firebase console for this project."
  value       = "https://console.firebase.google.com/project/${google_project.this.project_id}/overview"
}
