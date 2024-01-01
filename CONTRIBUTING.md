# Contributing to simple stack

Hey contributor 👋 Welcome to simple stack! We're a young project open to contributions of any kind, from fixes to features to documentation and tooling. 

## Repository overview

Simple stack is a **monorepo** containing a suite of packages built for Astro. These are the most important directories:

```bash
# packages including `simple-stack-form`, `simple-stack-partial`, etc
packages/*
# Astro projects that use and test these packages
examples/*
```

All source code is written in TypeScript, and components may use a variety of frameworks (Astro, React, Vue, Svelte, etc).

## What to ask before making a PR

Before submitting a pull request, we suggest asking:

1. **Have I checked the community discord and existing issue logs first?** We use GitHub issues and [discord discussions](https://wtw.dev/chat) to collaborate on changes. By opening an issue or starting a Discord thread, you can get early feedback on your problem before diving into a solution.

2. **Have I reviewed the existing documentation?** You may find an answer to your request in the package README. In fact, you might find room to improve our docs for future users with a similar problem.

If the answer is **yes** to both and you have a PR to contribute, get to it!

## Prerequisites 

New contributors need the following tools:

- [Node 18.14+](https://nodejs.org/en/download) for building packages and example sites.
- [pnpm](https://pnpm.io/) to install dependencies. We prefer pnpm since it runs quickly and offers a [robust workspace feature](https://pnpm.io/workspaces) to manage monorepo dependencies. 

## Initial setup

To get started, clone this repository and install dependencies from the project root:

```bash
git clone https://github.com/bholmesdev/simple-stack.git
cd simple-stack
pnpm install
```

### Linting and formatting

This project uses [Biome](https://biomejs.dev/) to lint and format code across packages. If you use VS Code, this repository includes a `.vscode/` directory to preconfigure your default linter. [Visit the editor integration docs](https://biomejs.dev/guides/integrate-in-editor/) to enable linting in your editor of choice.

To run the linter manually, you can use the following commands at the project root:

```bash
# lint and format all files in packages/*
pnpm check
# apply lint and format fixes to all files in packages/*
pnpm check:apply
# run `lint` or `format` steps individually
pnpm lint
pnpm lint:apply
pnpm format
pnpm format:apply
```

## Development

You may want live compilation for your TypeScript code while working. We use [turborepo](https://turbo.build/) to build packages for development and production. For live reloading, run the following at the project root:

```bash
pnpm dev
```

This will build all `packages/*` entries and listen for changes.

To test your code, you can run any one of our Astro projects under `examples/*`. First open a second terminal, navigate to that example, and run the same `pnpm dev` command. You may need to kill and restart this server to see your package edits take effect.

You can also run packages _and_ examples simultaneously:

```bash
pnpm dev:all
```

However, we've found console logs are harder to read using this approach. Use whichever you prefer!

## Making a Pull Request

When making a pull request, be sure to add a changeset when a package has changed. Non-packages (`examples/*`) do not need changesets.

```bash
pnpm exec changeset
```
