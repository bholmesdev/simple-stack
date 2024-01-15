# simple scope 🔎

> Get a scoped ID for whatever file you're in. Resolved at build-time with zero client JS.

```jsx
import { scope } from 'simple:scope';

function Form() {
  return (
    <form>
      <label htmlFor={scope('email')}>Email</label>
      <input id={scope('email')} name="email" />
    </form>
  );
}

/*
Output:

<form>
  <label for="email-dj23i_ka">Email</label>
  <input id="email-dj23i_ka" name="email">
</form>
*/
```

📚 Visit [the docs](https://simple-stack.dev/scope) for more information and usage examples.
