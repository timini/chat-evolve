# Roadmap

What is needed to turn the prototype into a tool that works, in order. Each step is usable on its
own.

## 1. Real breeding

The core of the product, and the only step that tests the idea.

- Add a `breed(generation, marks, mutation, session)` function in `packages/ui` that builds one
  prompt per variant from:
  - the original prompt,
  - the dominant sentences, which must be kept,
  - the purged sentences, which must be avoided,
  - the variant's role and temperature, scaled by the mutation rate.
- Make the three calls in parallel, straight from the browser, using the active session's
  provider and key. The request shapes are already worked out for key verification in
  `validation.ts`.
- Replace the `setTimeout` in `useEvolveStore.breed` with the real call, append the new generation
  and clear the marks.
- Show provider errors (bad key, rate limit, refusal) on the variant card that failed, using the
  existing `sanitizeProviderErrorMessage`.

Anthropic needs the `anthropic-dangerous-direct-browser-access` header for calls made from a
browser. Check CORS for each of the other providers before relying on it.

## 2. Your own prompt

- A prompt box on the workbench, replacing the fixed cover-letter sample.
- Generation 1 is three plain variants from that prompt.

## 3. History

- Keep every generation, with its marks, in the store.
- A way to step back to an earlier generation and breed from there instead.
- Export the chosen variant as plain text.

## 4. Find out whether it is better

The idea is only worth keeping if it beats the normal approach. Compare it with simply asking the
model "keep these sentences, rewrite the rest" on a handful of real tasks (an email, a cover
letter, a paragraph of a blog post), and measure rounds and time to an acceptable result.

## Fix now

- The setup screen says "Every Breed call hits the active session's provider directly". Until
  step 1 is done, that is not true, so either change the text or label the site as a prototype.
- The Anthropic model list in `content.ts` is out of date.
