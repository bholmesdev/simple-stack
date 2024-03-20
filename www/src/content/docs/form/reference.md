---
title: API Reference 
description: Reference for simple-stack-form
sidebar:
  order: 4
---

## `injectMiddleware`

**Type:** `true | false`

The adapter option `injectMiddleware` allows to opt-out of the default behaviour, which injects a middleware. This could be useful if you want to add your own data retrivial and `POST` handling logic.

```ts ins={3,7-9}
// astro.config.ts
import { defineConfig } from 'astro/config';
import simpleStackForm from 'simple-stack-form';

export default defineConfig({
	integrations: [
		simpleStackForm({
			injectMiddleware: false,
		}),
	],
});
```
