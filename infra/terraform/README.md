# Infrastructure (Terraform)

Provisions everything ChatEvolve needs, as code:

1. A new **GCP project** under the org (`google_project`).
2. The required **APIs** (`serviceusage`, `cloudresourcemanager`, `firebase`, `firebasehosting`).
3. **Firebase** on the project (`google_firebase_project`).
4. A **Firebase Hosting site** (`google_firebase_hosting_site`), served at `https://<site_id>.web.app`.

By default the project is created on the **no-cost Spark plan** (no billing account linked),
which covers Firebase Hosting's free tier: the app is fully static, so no paid backend is used.

## Auth

Uses Application Default Credentials. No service-account key is committed.

```bash
gcloud auth application-default login
gcloud auth application-default set-quota-project <any-existing-project>   # if prompted about quota
```

The acting account needs `resourcemanager.projects.create` on the org (and, if you set
`billing_account`, `billing.resourceAssociations.create`).

## Variables

All have defaults (see `variables.tf` / `example.tfvars`): you can `apply` with no input.

| Variable | Default | Notes |
| --- | --- | --- |
| `org_id` | `59273835578` (rewire.it) | Org to create the project under |
| `folder_id` | `""` | Use a folder instead of the org root |
| `billing_account` | `""` | Blank = Spark/free. Set to link billing if org policy requires it |
| `project_name` | `chat-evolve` | Base for the generated project ID |
| `project_id` | `""` | Blank gives `chat-evolve-<random>` |
| `site_id` | `""` | Blank gives same as `project_id` |

## Usage

From the repo root (preferred: wraps these):

```bash
just tf-init
just tf-plan
just tf-apply
just tf-output      # project_id, site_id, default_url
```

State is local (`terraform.tfstate`, git-ignored). If org policy blocks no-billing projects,
set `billing_account` in `terraform.tfvars` and re-apply.
