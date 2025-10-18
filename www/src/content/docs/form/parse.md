---
title: Parse form requests 
description: Validate forms server-side
sidebar:
  order: 2
---

:::caution
⚠️ **This package is no longer maintained.** Astro now has [Server Islands](https://docs.astro.build/en/guides/server-islands/), which largely replace the use cases explored by this package. Server Islands also offer a simpler mental model for streaming content that scales to a number of deployment hosts.

That said, if you want to understand how this package works to fork the functionality for your own use, [watch my YouTube walkthrough!](https://www.youtube.com/watch?v=cdOyOgwt9Zc&t=128s)
:::

Simple form exposes helpers to parse and validate form requests with generic APIs and the [`Astro.locals.form`](#astrolocalsform) object when using Astro frontmatter.

## `validateForm()`

**Type:** `validateForm<T extends ZodRawShape>(params: { formData: FormData, validator: T): Promise<GetDataResult<T>>`

The `validateForm()` function can be used to validate any form request using a simple form validator. This returns data parsed by your validator or a `fieldErrors` object:

```ts
import { validateForm, createForm } from 'simple:form';

const signup = createForm(...);

const parsed = await validateForm({ formData, validator: signup.validator });
if (parsed.data) {
  console.info(parsed.data);
}
```

## `Astro.locals.form`

Simple form exposes helpers to parse form requests from your Astro frontmatter.

### `getData()`

**Type:** `getData<T extends { validator: FormValidator }>(form: T): Promise<GetDataResult<T["validator"]> | undefined>`

`Astro.locals.form.getData()` parses any incoming form request with the method POST. This will return `undefined` if no form request was sent, or return form data parsed by your [Zod validator](https://github.com/colinhacks/zod#safeparse).

If successful, `result.data` will contain the parsed result. Otherwise, `result.fieldErrors` will contain validation error messages by field name:

```astro
---
import { z } from 'zod';
import { createForm } from 'simple:form';

const checkout = createForm({
  quantity: z.number(),
});

const result = await Astro.locals.form.getData(checkout);

if (result?.data) {
  console.log(result.data);
  // { quantity: number }
}
---

<form method="POST">
  <label for="quantity">Quantity</label>
  <input id="quantity" {...checkout.inputProps.quantity} />
  {
    result?.fieldErrors?.quantity?.map(error => (
      <p class="error">{error}</p>
    ))
  }
  ...
</form>
```

### `getDataByName()`

**Type:** `getDataByName<T extends { validator: FormValidator }>(name: string, form: T): Promise<GetDataResult<T["validator"]> | undefined>`

You may have multiple forms on the page you want to parse separately. You can define a unique form name in this case, and pass the name as a hidden input within the form using `<FormName>`:

```astro
---
import { z } from 'zod';
import { createForm } from 'simple:form';

const checkout = createForm({
  quantity: z.number(),
});

const result = await Astro.locals.form.getDataByName(
  'checkout',
  checkout,
);

if (result?.data) {
  console.log(result.data);
  // { quantity: number }
}
---

<form method="POST">
  <label for="quantity">Quantity</label>
  <input id="quantity" {...checkout.inputProps.quantity} />

  <FormName value="checkout" />
  <!--Renders the following hidden input-->
  <!--<input type="hidden" name="_formName" value="checkout" />-->
</form>
```