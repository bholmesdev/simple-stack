# simple-stack-frame

## 0.0.4

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

## 0.0.3

### Patch Changes

- [`abbd3b3`](https://github.com/bholmesdev/simple-stack/commit/abbd3b3279f13df168bad1d787f67a7cac43ba41) - Add GET request handling

## 0.0.2

### Patch Changes

- [#59](https://github.com/bholmesdev/simple-stack/pull/59) [`53acd1f`](https://github.com/bholmesdev/simple-stack/commit/53acd1ffce21a956db9cba1c184f1c4464b2f78b) Thanks [@bholmesdev](https://github.com/bholmesdev)! - Introduce simple-stack-frame package. The goal: rerender **just the parts that change** on any Astro route. Use the `<Frame />` component to declare a target on the page, and use any form to rerender that target.
