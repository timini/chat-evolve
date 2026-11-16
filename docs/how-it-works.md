# How it works

ChatEvolve borrows the vocabulary of genetics because the loop is the same one a breeder runs:
make variation, select, cross, repeat. This page describes the model the interface is built
around. The [README](../README.md) says which parts are live.

## The loop

```
prompt
  │
  ▼
generation 1: three variants (A, B, C)
  │   you mark sentences: dominant / purged
  │   you set the mutation rate
  ▼
breed
  │
  ▼
generation 2: three new variants, built from generation 1's dominant genes
  │
  ▼
 ...repeat until one variant is the text you want
```

## Variants

Each generation has three variants. They are written from the same prompt and the same gene pool,
but each has a role and a temperature so they differ in a predictable way:

| Variant | Role | Temperature (sample) | Purpose |
| --- | --- | --- | --- |
| A | Anchor | about 0.3 | Conservative. Stays close to the kept sentences. |
| B | Stylist | about 0.7 | Same content, different voice and rhythm. |
| C | Mutant | about 1.0 | Takes risks. The source of new ideas the other two would not produce. |

Three is enough to give a real choice without making the reader compare a wall of text.

## Genes

A sentence is the unit of selection. Clicking a sentence cycles its mark:

```
unmarked  →  dominant  →  purged  →  unmarked
```

- **Dominant** sentences go into the dominant gene pool. The next generation must carry them,
  or something very close to them.
- **Purged** sentences go into the purged pool. The next generation must avoid them and anything
  that says the same thing.
- **Unmarked** sentences are neutral. The model may keep, change or drop them.

The right-hand splice panel shows both pools, so you can see what the next cross will be built
from before you breed.

## Mutation rate

A single slider from 0 to 1. Low values tell the next generation to stay close to the dominant
genes. High values give it room to rewrite around them. In the sample data, generation 1 runs at
0.42 and generation 2 at 0.58.

## Providers and keys

The app is static. There is no server, so every model call goes straight from the browser to the
provider with the user's own key ("bring your own key").

- Supported providers: Anthropic, OpenAI, Google (Gemini) and DeepSeek.
- A key is first checked for the right prefix and length, then verified by calling the provider's
  `/models` endpoint. A 401 or 403 rejects it and it is not stored.
- Keys are stored in `localStorage` under `chatevolve.v1` and are only ever sent to their own
  provider. "Clear all" in settings removes them.
- The session chip in the top bar picks which configured provider and model the next breed uses.

## Where the state lives

`apps/web/store/useEvolveStore.ts` is the single Zustand store:

| State | Persisted | Notes |
| --- | --- | --- |
| `theme` | Yes | Four themes: Ink/Paper, Archive, Lab, Soil |
| `keys`, `prefs`, `session` | Yes | Provider keys, preferred model per provider, active session |
| `entered` | Yes | Whether the user has passed the setup screen |
| `marks` | No | Dominant and purged marks per variant, per sentence |
| `activeVariant`, `mutation`, `breeding` | No | Current workbench state |

The generations themselves (`G1`, `G2`) are sample data in `packages/ui/src/content.ts`.
