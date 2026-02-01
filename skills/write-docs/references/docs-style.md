# Documentation style guide

Use this reference when writing or editing docs in this repository.

## Core principles

- Use progressive disclosure: start simple, add complexity only when needed.
- Build examples step by step; do not jump to the final solution.
- Start with a naive implementation, call out its problems, then refactor and layer features.
- Provide full code context but highlight only the lines that matter.
- Keep tone consistent and direct. Use second person. Avoid emojis and colloquial phrasing.
- For each feature or API, lead with: what it does, why it is useful, then an example.
- Separate guides from API reference. Keep the distinction explicit in headings or sections.

## Example structure for a guide section

1. What it does (one or two sentences).
2. Why it is useful (intent-driven use cases).
3. Naive example (minimal, working).
4. Limitations of the naive approach.
5. Improved approach (refactor).
6. Add features one at a time (each with a short explanation).

## Code sample emphasis

Use Starlight line highlighting so the reader can see the change without losing context. You may highlight lines in a standalone example, or use `ins` for additive examples:

```mdx
```ts {3-4}
import { thing } from "@pkg";

const value = thing();
```
```

Use `ins` and `del` consistently when showing refactors:

```mdx
```ts del={2} ins={3}
const value = oldThing();
const value = newThing();
```
```

## Consistent language

- Use second person ("you can", "you should", "you might").
- Use consistent terms for functions and signatures (e.g., always write `foo()` with parentheses).
- Keep headings and callouts neutral and descriptive.

## Where docs live

- Guides live in `www/src/content/docs/` and are written in MDX for Starlight.
- API reference can be a section in a guide or a separate doc collection, but keep the separation explicit.
