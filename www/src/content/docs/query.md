---
title: Simple query 🔎
description: A simple library to query the DOM from your Astro components.
---

A simple library to query the DOM from your Astro components.

```astro
<button data-target={$('btn')}>Click me</button>

<script>
  ready(() => {
    $('btn').addEventListener('click', () => {
      console.log("It's like JQuery but not!");
    });
  });
</script>
```

## Installation

Simple stack query is an Astro integration. You can install using the `astro add` CLI:

```bash
astro add simple-stack-query
```

To install this integration manually, follow the [manual installation instructions](https://docs.astro.build/en/guides/integrations-guide/#manual-installation)

## Global `$` selector

The `$` is globally available to define targets from your server template, and to query those targets from your client script.

Selectors should be applied to the `data-target` attribute. All selectors are scoped based on the component you're in, so we recommend the simplest name you can use:

```astro
<button data-target={$('btn')}>
<!--data-target="btn-4SzN_OBB"-->
```

From your client script, the query result will be a plain HTML element. No, it's not a JQuery object. But who doesn't like a little nostalgia?

```ts
$('btn').addEventListener(() => { /* ... */ });
```

You can also pass an `HTMLElement` or `SVGElement` type to access specific properties. For example, use `$<HTMLInputElement>` to access `.value`:

```ts
$<HTMLInputElement>('input').value = '';
```

### `$.optional` selector

`$` throws when no matching element is found. To avoid this behavior, use `$.optional`:

```astro
---
const promoActive = Astro.url.searchParams.has('promo');
---

{promoActive && <p data-target={$('banner')}>Buy my thing</p>}

<script>
ready(() => {
  $.optional('banner')?.addEventListener('mouseover', () => {
    console.log("They're about to buy it omg");
  });
});
</script>
```

### `$.all` selector

You may want to select multiple targets with the same name. You can use `$.all` to query for an array of results:

```astro
---
const links = ["wtw.dev", "bholmes.dev"];
---

{links.map(link => (
  <a href={link} data-target={$('link')}>{link}</a>
))}

<script>
ready(() => {
  $.all('link').forEach(linkElement => { /* ... */ });
});
</script>
```

## Global `ready()` function

All `$` queries must be nested in a `ready()` block. This opts in to using the global `$` from client scripts. `ready()` also ensures your code reruns on every page [when view transitions are enabled.](https://docs.astro.build/en/guides/view-transitions/)

```astro
<script>
  ready(() => {
    // ✅ Allowed
    $('element').textContent = 'hey';
  })

  // ❌ Not allowed
  $('element').textContent = 'hey';
</script>

