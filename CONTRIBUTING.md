# Contributing to simple stack

We are only open to contributions to the `www/` documentation site. The remaining packages are here for legacy purposes.

## Prerequisites

- [Node 18.14+](https://nodejs.org/en/download)
- [pnpm](https://pnpm.io/)

## Setup

```bash
git clone https://github.com/bholmesdev/simple-stack.git
cd simple-stack/www
pnpm install
```

## Development

```bash
pnpm dev
```

The docs site is built with [Astro](https://astro.build/) + [Starlight](https://starlight.astro.build/).

## Linting

```bash
pnpm check      # check for issues
pnpm check:fix  # auto-fix issues
```
