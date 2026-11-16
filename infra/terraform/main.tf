locals {
  project_id = var.project_id != "" ? var.project_id : "${var.project_name}-${random_id.suffix.hex}"
  site_id    = var.site_id != "" ? var.site_id : local.project_id
}

# Random suffix keeps the project ID globally unique.
resource "random_id" "suffix" {
  byte_length = 3
}

# ── The GCP project ──────────────────────────────────────────────────────────
resource "google_project" "this" {
  name       = var.project_name
  project_id = local.project_id

  # Created under the org (or a folder, if folder_id is set).
  org_id    = var.folder_id == "" ? var.org_id : null
  folder_id = var.folder_id != "" ? var.folder_id : null

  # Optional — leave blank to stay on the no-cost Spark plan.
  billing_account = var.billing_account != "" ? var.billing_account : null

  labels          = var.labels
  deletion_policy = "DELETE"
}

# ── Required APIs ────────────────────────────────────────────────────────────
resource "google_project_service" "services" {
  for_each = toset([
    "serviceusage.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "firebase.googleapis.com",
    "firebasehosting.googleapis.com",
  ])

  project = google_project.this.project_id
  service = each.value

  # Keep APIs enabled if the config is torn down so other tooling isn't disrupted.
  disable_on_destroy = false
}

# ── Firebase ─────────────────────────────────────────────────────────────────
resource "google_firebase_project" "this" {
  provider = google-beta
  project  = google_project.this.project_id

  depends_on = [google_project_service.services]
}

# The Hosting site — served at https://<site_id>.web.app and .firebaseapp.com.
resource "google_firebase_hosting_site" "this" {
  provider = google-beta
  project  = google_project.this.project_id
  site_id  = local.site_id

  depends_on = [google_firebase_project.this]
}
