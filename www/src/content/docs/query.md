---
title: Simple query 🔎
description: A simple library to query the DOM from your Astro components.
---

A simple library to query the DOM from your Astro components.

```astro
<button data-target={$('btn')}>Click me</button>

<script>
  $.ready(() => {
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

Then, use the same `$()` function from your client script to select that element. The query result will be a plain [`HTMLElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement). No, it's not a JQuery object. We just used `$` for the nostalgia 😉

```ts
$('btn').addEventListener(() => { /* ... */ });
```

You can also pass an `HTMLElement` or `SVGElement` type to access specific properties. For example, use `$<HTMLInputElement>()` to access `.value`:

```ts
$<HTMLInputElement>('input').value = '';
```

### `$.optional()` selector

`$()` throws when no matching element is found. To handle undefined values, use `$.optional()`:

```astro
---
const promoActive = Astro.url.searchParams.has('promo');
---

{promoActive && <p data-target={$('banner')}>Buy my thing</p>}

<script>
  $.ready(() => {
    $.optional('banner')?.addEventListener('mouseover', () => {
      console.log("They're about to buy it omg");
    });
  });
</script>
```

### `$.all()` selector

You may want to select multiple targets with the same name. Use `$.all()` to query for an array of results:

```astro
---
const links = ["wtw.dev", "bholmes.dev"];
---

{links.map(link => (
  <a href={link} data-target={$('link')}>{link}</a>
))}

<script>
  $.ready(() => {
    $.all('link').forEach(linkElement => { /* ... */ });
  });
</script>
```

## `$.ready()` function

All `$` queries should be nested in a `$.ready()` block. `$.ready()` will rerun on every page [when view transitions are enabled.](https://docs.astro.build/en/guides/view-transitions/)

```astro
<script>
  $.ready(() => {
    // ✅ Query code that should run on every navigation
    $('element').textContent = 'hey';
  })

  // ✅ Global code that should only run once
  class MyElement extends HTMLElement { /* ... */}
  customElements.define('my-element', MyElement);
</script>
```

### 🙋‍♂️ `$.ready()` isn't running for me

`$.ready()` runs when `data-target` is used by your component. This heuristic keeps simple query performant and ensures scripts run at the right time when view transitions are applied.

If `data-target` is applied conditionally, or not at all, the `$.ready()` block may not run. You can apply a `data-target` selector anywhere in your component to resolve the issue:

```astro ins="data-target={$('container')}"
<div data-target={$('container')}>
<!--...-->
</div>
```
