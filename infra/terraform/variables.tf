variable "org_id" {
  description = "GCP organization ID the project is created under."
  type        = string
  default     = "59273835578" # rewire.it
}

variable "folder_id" {
  description = "Optional folder to create the project under (mutually exclusive with org_id). Leave blank to use org_id."
  type        = string
  default     = ""
}

variable "billing_account" {
  description = "Optional billing account ID to link. Leave blank to stay on the no-cost Spark plan (Firebase Hosting free tier)."
  type        = string
  default     = ""
}

variable "project_name" {
  description = "Human-readable project name and the base for the generated project ID."
  type        = string
  default     = "chat-evolve"
}

variable "project_id" {
  description = "Explicit project ID. Leave blank to generate `<project_name>-<random>` (globally unique)."
  type        = string
  default     = ""
}

variable "site_id" {
  description = "Firebase Hosting site ID. Leave blank to default to the project ID. Serves at https://<site_id>.web.app."
  type        = string
  default     = ""
}

variable "labels" {
  description = "Labels applied to the project."
  type        = map(string)
  default = {
    app        = "chat-evolve"
    managed-by = "terraform"
  }
}
