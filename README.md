# ChatEvolve

Get text you like out of a language model by choosing, not by describing.

The usual loop is: ask, read one answer, then write an instruction about what to change ("keep the
second paragraph, lose the jargon"). It is slow, and the model often rewrites the parts you liked.

ChatEvolve treats writing as selective breeding:

1. The model writes **three versions** of the same piece at different temperatures.
2. You click sentences to mark them **dominant** (keep) or **purged** (cut). You never write an
   instruction.
3. You set a **mutation rate**: how far the next round may move away from what you kept.
4. **Breed** produces the next generation of three, built around the kept sentences and avoiding
   the cut ones.

After a few rounds you have a version assembled from the best parts of each, chosen by pointing
rather than explaining.

Live prototype: <https://chat-evolve-c0a104.web.app>

## Status: interactive prototype

The interface works; the evolution does not yet call a model.

| Part | State |
| --- | --- |
| Setup screen: paste a key for Anthropic, OpenAI, Google or DeepSeek | Works. Keys are format-checked, then verified live against the provider's `/models` endpoint. |
| Key storage | Works. Keys stay in the browser's `localStorage` and are only sent to the provider. |
| Workbench: three variant cards, sentence marking, gene pools, mutation slider | Works, on fixed sample data. |
| Breed | **Not implemented.** It plays a 1.6 second animation. No model is called and no new generation is made. |
| Prompt input | **Not implemented.** The prompt is fixed to a sample (a cover letter opener). |
| Generation history | **Not implemented.** Only one sample generation (G2) is shown. |

The setup screen currently says "Every Breed call hits the active session's provider directly".
That describes the plan, not the current behaviour.

See [docs/how-it-works.md](docs/how-it-works.md) for the model behind the interface and
[docs/roadmap.md](docs/roadmap.md) for what is needed to make it real.

## Quick start

Needs Node 20 or later, `pnpm` and [`just`](https://github.com/casey/just).

```bash
just install         # install workspace dependencies
just dev             # the app on http://localhost:3000
just storybook       # the component library on http://localhost:6006
just test            # unit and component tests (Vitest)
just test-storybook  # Storybook interaction tests
```

Run `just` with no arguments to list every recipe.

## Layout

```
chat-evolve/
├── apps/web/            Next.js 14 app, static export, Zustand store
│   ├── components/      ChatEvolveApp (setup gate, workbench, settings), theme switcher
│   └── store/           useEvolveStore: keys, session, sentence marks, mutation, breed
├── packages/ui/         @chat-evolve/ui component library, with Storybook
│   └── src/
│       ├── atoms/       buttons, status pills, mutation scale, glyphs
│       ├── molecules/   provider card, session chip, gene pool item
│       ├── organisms/   variant card, helix visualisation, splice panel, settings
│       ├── pages/       SetupPage, HelixPage
│       ├── content.ts   sample generations, provider catalogue, text helpers
│       └── validation.ts  key format checks and live key verification
├── infra/terraform/     GCP project and Firebase Hosting site
├── firebase.json        hosting config for apps/web/out
└── justfile             single entry point for dev, test and deploy
```

Components are built and tested in `packages/ui` first, then used by the app. Every component has
a Vitest and Testing Library spec. Organisms and pages also have Storybook play-function tests.
There are 108 tests in total.

## Deploy

The site is static (`output: 'export'`) and served from Firebase Hosting on the free Spark plan,
so there is no backend and nothing to pay for.

```bash
just tf-init   # once: initialise Terraform providers
just ship      # create the project if needed, build, and deploy
```

`just ship` runs `terraform apply`, builds the static export, writes `.firebaserc` from the
Terraform outputs and runs `firebase deploy`. It needs the `terraform` and `firebase` CLIs and a
logged-in Google Cloud account (`gcloud auth application-default login`, `firebase login`).

The Terraform state is local (`infra/terraform/terraform.tfstate`) and is not committed. Keep it,
or Terraform will lose track of the existing project. Details in
[infra/terraform/README.md](infra/terraform/README.md).
