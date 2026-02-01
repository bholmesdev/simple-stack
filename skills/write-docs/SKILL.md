---
name: write-docs
description: Create or revise documentation for the simple-stack repository, especially MDX guides and API reference content under www/src/content/docs/. Use when asked to write docs, restructure guides, add examples, or enforce documentation tone, structure, and code highlighting conventions.
---

# Write Docs

## Overview

Write clear, progressive documentation for this repository using the existing Starlight + MDX docs setup. Favor stepwise examples, explicit usefulness, and consistent tone.

## Workflow

1. Locate the target doc or create a new MDX file under `www/src/content/docs/`.
2. Follow the style reference in `references/docs-style.md`.
3. Start each feature or API section with: what it does, why it is useful, then an example.
4. Build examples incrementally (naive first, then improvements and features).
5. Use Starlight code line highlighting (`ins`, `del`, `{n-m}`) to emphasize changes while keeping full context.
6. Keep guide content and API reference content clearly separated by headings or separate docs.

## House style essentials

- Use second-person voice and consistent terminology.
- Avoid emojis, slang, or playful narration.
- Prefer short, direct sentences and descriptive headings.

## References

- Read `references/docs-style.md` for the full style guide and code highlighting examples.
