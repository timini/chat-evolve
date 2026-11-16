# ChatEvolve — single orchestration entrypoint for infra + local dev.
# Run `just` with no args to list all recipes.

set shell := ["bash", "-uc"]
set dotenv-load := true

tf_dir := "infra/terraform"
web_out := "apps/web/out"

# ── meta ─────────────────────────────────────────────────────────────────────

# List all recipes
default:
    @just --list --unsorted

# ── local dev ────────────────────────────────────────────────────────────────

# Install all workspace dependencies
install:
    pnpm install

# Run the Next.js app in dev mode (http://localhost:3000)
dev:
    pnpm --filter @chat-evolve/web dev

# Run Storybook for the component library (http://localhost:6006)
storybook:
    pnpm --filter @chat-evolve/ui storybook

# Build everything (UI lib types, Storybook static, Next static export)
build:
    pnpm turbo run build

# Build only the Next.js static export -> apps/web/out
build-web:
    pnpm --filter @chat-evolve/web build

# Build the static Storybook -> packages/ui/storybook-static
build-storybook:
    pnpm --filter @chat-evolve/ui build-storybook

# ── tests (red-green-refactor TDD) ────────────────────────────────────────────

# Run all unit/component tests (Vitest + Testing Library)
test:
    pnpm turbo run test

# Run unit tests for the UI library only
test-ui:
    pnpm --filter @chat-evolve/ui test

# Run the Storybook story tests (play functions, browser mode via Vitest)
test-storybook:
    pnpm --filter @chat-evolve/ui test:stories

# Watch tests for the UI library
test-watch:
    pnpm --filter @chat-evolve/ui test:watch

# Typecheck every workspace
typecheck:
    pnpm turbo run typecheck

# Lint every workspace
lint:
    pnpm turbo run lint

# Full local verification: lint + typecheck + tests + build
verify: lint typecheck test build

# ── infrastructure (Terraform) ────────────────────────────────────────────────

# Initialise Terraform (downloads providers)
tf-init:
    cd {{tf_dir}} && terraform init -input=false

# Show the planned infrastructure changes
tf-plan:
    cd {{tf_dir}} && terraform plan -input=false

# Create / update the GCP project + Firebase Hosting site
tf-apply:
    cd {{tf_dir}} && terraform apply -input=false -auto-approve

# Tear down all managed infrastructure
tf-destroy:
    cd {{tf_dir}} && terraform destroy -input=false

# Print Terraform outputs (project_id, site_id, default_url)
tf-output:
    cd {{tf_dir}} && terraform output

# ── deployment ────────────────────────────────────────────────────────────────

# Generate .firebaserc from Terraform outputs so the CLI targets the right project
_firebaserc:
    #!/usr/bin/env bash
    set -euo pipefail
    project_id=$(cd {{tf_dir}} && terraform output -raw project_id)
    cat > .firebaserc <<EOF
    {
      "projects": { "default": "${project_id}" }
    }
    EOF
    echo "wrote .firebaserc -> project=${project_id}"

# Deploy the built static site to Firebase Hosting
deploy: _firebaserc build-web
    firebase deploy --only hosting --project "$(cd {{tf_dir}} && terraform output -raw project_id)"

# Provision infra (if needed) then build + deploy — the one-shot pipeline
ship: tf-apply deploy
    @echo "Shipped. Live at: $(cd {{tf_dir}} && terraform output -raw default_url)"

# ── clean ─────────────────────────────────────────────────────────────────────

# Remove build artefacts and caches
clean:
    rm -rf {{web_out}} apps/web/.next packages/ui/storybook-static packages/ui/dist
    find . -name '.turbo' -type d -prune -exec rm -rf {} + 2>/dev/null || true
