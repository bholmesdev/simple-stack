# Contributing to simple stack

Hey contributor 👋 Welcome to simple stack! We're a young project open to contributions of any kind, from fixes to features to documentation and tooling. 

## What to ask before making a PR

Before submitting a pull request, we suggest asking:

1. **Have I checked the community discord and existing issue logs first?** We use GitHub issues and [discord discussions](https://wtw.dev/chat) to collaborate on changes. By opening an issue or starting a Discord thread, you can get early feedback on your problem before diving into a solution.

2. **Have I reviewed the existing documentation?** You may find an answer to your request in the package README. In fact, you might find room to improve our docs for future users with a similar problem!

If the answer is **yes** to both and you have a PR to contribute, get to it!

## Prerequisites 

New contributors need the following tools:

- [Node 18.14+](https://nodejs.org/en/download) for building packages and example sites.
- [pnpm](https://pnpm.io/) to install dependencies. This repository is a monorepo, containing multiple packages that may depend on one another. pnpm offers a [robust workspace feature](https://pnpm.io/workspaces) to manage these dependencies. 

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
