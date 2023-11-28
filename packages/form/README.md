# Simple form

> The simple way to handle forms in your Astro project 🧘‍♂️


```astro
---
import { z } from "astro/zod";

const checkoutForm = await Astro.locals.form.getData({
  quantity: z.number(),
  email: z.string().email(),
  allowAlerts: z.boolean(),
});

if (checkoutForm?.success) {
  await myDb.insert(checkoutForm.data);
  // proceed to checkout
}
---

<form method="POST">
  <label for="quantity">Quantity</label>
  <input id="quantity" name="quantity" type="number" />

  <label for="email">Email</label>
  <input id="email" name="email" type="email" />

  <label for="allowAlerts">Allow alerts</label>
  <input id="allowAlerts" name="allowAlerts" type="checkbox" />
</form>
```

## Installation

Simple form is an Astro integration. You can install and configure this via the Astro CLI using `astro add`:

```bash
npm astro add simple-stack-form
```

After installing, you'll need to add a type definition to your environment for editor hints. Add this reference to a new or existing `src/env.d.ts` file:

```ts
/// <reference types="simple-stack-form/types" />
```

## Usage

Simple form exposes helpers in your Astro templates via [`Astro.locals.form`](https://docs.astro.build/en/reference/api-reference/#astrolocals).

### `form.getData()`

**Type:** `getData(validator: ZodRawShape): undefined | SafeParseReturnType<typeof validator>`

`Astro.locals.form.getData()` parses any incoming form request with the method POST. This will return `undefined` if no form request was sent, or return form data when present parsed by your [Zod validator](https://github.com/colinhacks/zod#safeparse).

The result will include a `success` flag for whether or not validation succeeded. If so, `result.data` will contain the parsed result. If not, `result.errors.formErrors.fieldErrors` will contain all error messages by field name:

```astro
---
import { z } from "astro/zod";

const checkoutForm = await Astro.locals.form.getData({
  quantity: z.number(),
  email: z.string().email(),
  allowAlerts: z.boolean(),
});

if (checkoutForm?.success) {
  console.log(checkoutForm.data);
  // { quantity: number, email: string, allowAlerts: boolean }
}
---

<form method="POST">
  <label for="quantity">Quantity</label>
  <input id="quantity" name="quantity" type="number" />
  {
    !checkoutForm?.success && checkoutForm.errors.formErrors.fieldErrors.map(error => (
      <p class="error">{error}</p>
    ))
  }
  ...
</form>
```

### `form.getDataByName()`

**Type:** `getDataByName(name: string, validator: ZodRawShape): undefined | SafeParseReturnType<typeof validator>`

You may have multiple forms on the page you want to parse separately. You can define a unique form name in this case, and pass the name as a hidden input within the form using `<FormName>`:

```astro
---
import { z } from "astro/zod";
import { FormName } from "simple-stack-form/components";

// will only return for forms with the hidden input `checkout`
const checkoutForm = await Astro.locals.form.getDataByName("checkout", {
  quantity: z.number(),
  email: z.string().email(),
  allowAlerts: z.boolean(),
});
---

<form method="POST">
  <label for="quantity">Quantity</label>
  <input id="quantity" name="quantity" type="number" />

  <FormName value="checkout" />
  <!--Renders the following hidden input-->
  <!--<input type="hidden" name="_formName" value="checkout" />-->
</form>
```