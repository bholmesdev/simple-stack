# Simple stack query

A simple library to query the DOM from your Astro components.

```astro
<RootElement>
  <button data-target="btn">Click me</button>
</RootElement>

<script>
  RootElement.ready(($) => {
    $('btn').addEventListener('click', () => {
      console.log("It's like JQuery but not!");
    });
  });
</script>
```

📚 Visit [the docs](https://simple-stack.dev/query) for more information and usage examples.