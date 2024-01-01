# simple scope 🔎

Get a scoped ID for whatever file you're in. Resolved at build-time with zero client JS.

```jsx
import { scope } from 'simple:scope';

function Form() {
  return (
    <form>
      <label htmlFor={scope('email')}>Email</label>
      <input id={scope('email')} name="email" />
    </form>
  );
}

/*
Output:

<form>
  <label for="email-dj23i_ka">Email</label>
  <input id="email-dj23i_ka" name="email">
</form>
*/
```

## Installation

Simple scope is a vite plugin compatible with any vite-based framework (Astro, Nuxt, SvelteKit, etc). First install the dependency from npm:

```bash
npm i vite-plugin-simple-scope
```

Then, set up type inferencing for the `simple:scope` module with an `env.d.ts` file. You can create this file at the base of your project, or add to the provided `src/env.d.ts` file for frameworks like Astro:

```ts
// env.d.ts
/// <reference types="vite-plugin-simple-scope/types" />
```

Finally, apply as a vite plugin in your framework of choice:

```js
import simpleScope from 'vite-plugin-simple-scope';

// apply `simpleScope()` to your vite plugin config
```

- [Astro vite plugin configuration](https://docs.astro.build/en/recipes/add-yaml-support/)
- [Nuxt vite plugin configuration](https://nuxt.com/docs/getting-started/configuration#external-configuration-files)
- [SvelteKit vite plugin configuration](https://kit.svelte.dev/docs/project-structure#project-files-vite-config-js)

## Usage

You can import the `scope()` utility from `simple:scope` in any JavaScript-based file. This function accepts an optional prefix string for naming different scoped identifiers.

Since `scope()` uses the file path to generate IDs, multiple calls to `scope()` will append the same value:

```js
// example.js

scope(); // JYZeLezU
scope('first'); // first-JYZeLezU
scope('second'); // second-JYZeLezU
```

Simple scope will also generate the same ID when called server-side or client-side. This prevents hydration mismatches when using component frameworks like React or Vue, and is helpful when querying scoped element `id`s from the DOM.

This example uses [Astro](https://astro.build) to add a scoped `id` to a `<canvas>` element, and queries that `id` from a client-side `<script>`:

```astro
---
// Server-side template
import { scope } from 'simple:scope';
---

<canvas id={scope('canvas')}></canvas>

<script>
// Client-side script
import { scope } from 'simple:scope';

const canvas = document.getElementById(scope('canvas'));
</script>
```
