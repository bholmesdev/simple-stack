# vite-plugin-simple-scope

## 2.0.1

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

## 2.0.0

### Major Changes

- [#25](https://github.com/bholmesdev/simple-stack/pull/25) [`054fe3c`](https://github.com/bholmesdev/simple-stack/commit/054fe3cfa8c5640359b6ce7e29ec11e910aa9d36) Thanks [@dsnjunior](https://github.com/dsnjunior)! - Generate Scope IDs deterministically. This means IDs will match between development and production builds.

## 1.0.4

### Patch Changes

- [#16](https://github.com/bholmesdev/simple-stack/pull/16) [`bfd7834`](https://github.com/bholmesdev/simple-stack/commit/bfd783467eb3e9f39d014a59316e8715d290e76d) Thanks [@bholmesdev](https://github.com/bholmesdev)! - Update package.json to use new github URL
