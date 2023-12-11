# Simple form

> The simple way to handle forms in your Astro project 🧘‍♂️


```astro
---
import { z } from "astro/zod";
import { createForm } from "simple:form";

const checkout = createForm({
  quantity: z.number(),
  email: z.string().email(),
  allowAlerts: z.boolean(),
});

const result = await Astro.locals.form.getData(checkout);

if (result?.data) {
  await myDb.insert(result.data);
  // proceed to checkout
}
---

<form method="POST">
  <label for="quantity">Quantity</label>
  <input id="quantity" {...checkout.inputProps.quantity} />

  <label for="email">Email</label>
  <input id="email" {...checkout.inputProps.email} />

  <label for="allowAlerts">Allow alerts</label>
  <input id="allowAlerts" {...checkout.inputProps.allowAlerts} />
</form>
```

## Installation

Simple form is an Astro integration. You can install and configure this via the Astro CLI using `astro add`:

```bash
npm run astro add simple-stack-form
```

After installing, you'll need to add a type definition to your environment for editor hints. Add this reference to a new or existing `src/env.d.ts` file:

```ts
/// <reference types="simple-stack-form/types" />
```

## Usage

### Create a validated form

**Type:** `createForm(ZodRawShape): { inputProps: Record<string, InputProps>, validator: ZodRawShape }`

You can create a simple form with the `createForm()` function. This lets you specify a validation schema using [Zod](https://zod.dev/), where each input corresponds to an object key. Simple form supports string, number, or boolean (checkbox) fields.

```ts
import { createForm } from 'simple:form';
import z from 'zod';

const signupForm = createForm({
  name: z.string(),
  age: z.number().min(18).optional(),
  newsletterOptIn: z.boolean(),
});
```

`createForm()` returns both a validator and the `inputProps` object. `inputProps` converts each key of your validator to matching HTML props / attributes. The following props are generated today:

- `name` - the object key.
- `type` - `checkbox` for booleans, `number` for numbers, and `text` for strings.
- `aria-required` - `true` by default, `false` when `.optional()` is used. Note `aria-required` is used to add semantic meaning for screenreaders, but leave room to add a custom error banner.

Our `signupForm` example generates the following `inputProps` object:

```ts
const signupForm = createForm({
  name: z.string(),
  age: z.number().min(18).optional(),
  newsletterOptIn: z.boolean(),
});

signupForm.inputProps
/*
  name: { name: 'name', type: 'text', 'aria-required': true }
  age: { name: 'age', type: 'number', 'aria-required': false }
  newsletterOptIn: { name: 'newsletterOptIn', type: 'checkbox', 'aria-required': true }
*/
```

### Parse form requests

You can parse form requests from your Astro component frontmatter. Simple form exposes helpers to parse and validate these requests with the [`Astro.locals.form`](https://docs.astro.build/en/reference/api-reference/#astrolocals) object.

#### `getData()`

**Type:** `getData<T extends { validator: FormValidator }>(form: T): Promise<GetDataResult<T["validator"]> | undefined>`

`Astro.locals.form.getData()` parses any incoming form request with the method POST. This will return `undefined` if no form request was sent, or return form data parsed by your [Zod validator](https://github.com/colinhacks/zod#safeparse).

If successful, `result.data` will contain the parsed result. Otherwise, `result.fieldErrors` will contain validation error messages by field name:

```astro
---
import { z } from 'astro/zod';
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

#### `getDataByName()`

**Type:** `getDataByName<T extends { validator: FormValidator }>(name: string, form: T): Promise<GetDataResult<T["validator"]> | undefined>`

You may have multiple forms on the page you want to parse separately. You can define a unique form name in this case, and pass the name as a hidden input within the form using `<FormName>`:

```astro
---
import { z } from 'astro/zod';
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

## Client validation

Astro supports any UI component framework. To take advantage of this, simple form helps generate a client-validated form in your framework of choice.

> Okay, we only support ReactJS today. But the rest are on the way 😉

### Create a form with the `simple-form` CLI

You can generate a client form component with the `simple-form create` command:

```bash
# npm
npx simple-form create

# pnpm 
pnpm dlx simple-form create
```

This will output a form component in your directory of choice.

<details>
<summary><strong>🙋‍♀️ Why code generation?</strong></summary>

We know form libraries have [come](https://react-hook-form.com/) and [gone](https://formik.org/) over the years. We think the reason is _ahem_ simple: **forms are just hard.** There's countless pieces to tweak, from debounced inputs to live vs. delayed validation to styling your components.

So, we decided to take a hint from the popular [shadcn/ui](https://ui.shadcn.com/docs/theming) library and pass the code off to you.

We expose internal functions to manage your form state and handle both synchronous and asynchronous validation. Then, we generate components with accessible defaults based on [the "Reward now, punish late" pattern.](https://www.smashingmagazine.com/2022/09/inline-validation-web-forms-ux/#4-reward-early-punish-late) We invite you to tweak and override the code from here!

</details>

### Usage

An demo using ReactJS can be found in our repository `examples`:

- [StackBlitz playground](https://stackblitz.com/github/bholmesdev/simple-stack/tree/main/examples/form)
- [GitHub](https://github.com/bholmesdev/simple-stack/tree/main/examples/form)
