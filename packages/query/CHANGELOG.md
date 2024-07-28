# simple-stack-query

## 0.2.0

### Minor Changes

- [#77](https://github.com/bholmesdev/simple-stack/pull/77) [`f1431d5`](https://github.com/bholmesdev/simple-stack/commit/f1431d56e6a25b8854b749614e5d8af865e33c82) Thanks [@bholmesdev](https://github.com/bholmesdev)! - Revamps APIs to fix bugs and unlock a new suite of features.

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

  - Support multiple instances of the same component. Before, only the first instance would become interactive.
  - Enable data passing from the server to your client script using the `data` property.
  - Add an `effect()` utility to interact with the [Signal polyfill](https://github.com/proposal-signals/signal-polyfill?tab=readme-ov-file#creating-a-simple-effect) for state management.

  [Visit revamped documentation page](https://simple-stack.dev/query) to learn how to use the new features.

  ## Migration for v0.1

  If you were an early adopter of v0.1, thank you! You'll a few small updates to use the new APIs:

  - Wrap any HTML you want to target with the global `RootElement` component.
  - Remove the `# simple-stack-query from your `data-target` selector (`data-target={$('btn')}`->`data-target="btn"`). Scoping is now handled automatically.
  - Change `$.ready()` to `RootElement.ready()`, and retrieve the `# simple-stack-query selector from the first function argument. The `# simple-stack-query selector is no longer a global.

  ```diff
  + <RootElement>
  -   <button data=target={$('btn')}>
  +   <button data-target="btn">
        Click me
      </button>
  + </RootElement>

  <script>
  - $.ready(() => {
  + RootElement.ready(($) => {
      $('btn').addEventListener('click', () => {
        console.log("It's like JQuery but not!");
      });
    });
  </script>
  ```

  Since the syntax for `data-target` is now simpler, we have also **removed the VS Code snippets prompt.** We recommend deleting the snippets file created by v0.1: `.vscode/simple-query.code-snippets`.

## 0.1.1

### Patch Changes

- [#75](https://github.com/bholmesdev/simple-stack/pull/75) [`56a4000`](https://github.com/bholmesdev/simple-stack/commit/56a4000810aed4ddb07f5d8fccd3b7e1c7c8bbd4) Thanks [@bholmesdev](https://github.com/bholmesdev)! - fixes issue where `$.ready` does not fire in Safari or Firefox when using Astro view transitions with `fallback="none"`

## 0.1.0

### Minor Changes

- [#72](https://github.com/bholmesdev/simple-stack/pull/72) [`72e2630`](https://github.com/bholmesdev/simple-stack/commit/72e26309278afc4312fc1b477536c8999dba8e8a) Thanks [@bholmesdev](https://github.com/bholmesdev)! - Change from a global `ready()` block from client scripts to a namespaced `$.ready()` block. Should be safer to avoid collisions with any local variables called `ready`.

### Patch Changes

- [#74](https://github.com/bholmesdev/simple-stack/pull/74) [`20f1ab9`](https://github.com/bholmesdev/simple-stack/commit/20f1ab937f2d4210f62e0b386297690719f3517b) Thanks [@bholmesdev](https://github.com/bholmesdev)! - Add CLI prompt to add VS Code snippets in development.

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
