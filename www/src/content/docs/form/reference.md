---
title: Config Reference 
description: Reference for simple-stack-form
sidebar:
  order: 4
---

## `injectMiddleware`

**Type:** `true | false`

The adapter option `injectMiddleware` allows you to opt-out of middleware injection used to expose [`Astro.locals.form`](form/parse/#astrolocalsform). This could be useful if you want to add your own data retrieval and `POST` handling logic.

```ts ins={8}
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
