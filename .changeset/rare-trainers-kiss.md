---
"simple-stack-query": minor
---

Revamps APIs to fix bugs and unlock a new suite of features.

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
- Remove the `$` from your `data-target` selector (`data-target={$('btn')}` -> `data-target="btn"`). Scoping is now handled automatically.
- Change `$.ready()` to `RootElement.ready()`, and retrieve the `$` selector from the first function argument. The `$` selector is no longer a global.

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