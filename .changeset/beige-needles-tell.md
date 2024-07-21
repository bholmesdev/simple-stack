---
"simple-stack-stream": patch
"simple-stack-frame": patch
"simple-stack-query": patch
"vite-plugin-simple-scope": patch
"simple-stack-form": patch
---

Introduces the new `simple-stack-query` package. This makes querying the DOM from an Astro component simple and safely scoped.

```astro
<button data-target={$('btn')}>Click me</button>
<!--data-target="btn-lsk34da"-->
<script>
$('btn').addEventListener('click', () => {});
</script>
```