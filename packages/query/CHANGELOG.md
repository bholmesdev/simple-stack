# simple-stack-query

## 0.0.3

### Patch Changes

- Updated dependencies [[`7ff6c6d`](https://github.com/bholmesdev/simple-stack/commit/7ff6c6dc2f1aae9b26f574ec93aef1cc8014495b)]:
  - vite-plugin-simple-scope@2.0.2

## 0.0.2

### Patch Changes

- [#68](https://github.com/bholmesdev/simple-stack/pull/68) [`017e3ea`](https://github.com/bholmesdev/simple-stack/commit/017e3ea9de946148b7c02ae1b63e360ef45e9a99) Thanks [@bholmesdev](https://github.com/bholmesdev)! - introduces the new `simple-stack-query` package, a simple library to query the DOM from your Astro components.

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

  Visit the package README for more information.

- Updated dependencies [[`017e3ea`](https://github.com/bholmesdev/simple-stack/commit/017e3ea9de946148b7c02ae1b63e360ef45e9a99)]:
  - vite-plugin-simple-scope@2.0.1
