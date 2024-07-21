---
"simple-stack-stream": patch
"simple-stack-frame": patch
"simple-stack-query": patch
"vite-plugin-simple-scope": patch
"simple-stack-form": patch
---

introduces the new `simple-stack-query` package, a simple library to query the DOM from your Astro components.

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

View the package README for more information.