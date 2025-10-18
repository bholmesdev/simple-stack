# Simple form

> ⚠️ **This package is no longer maintained.** Simple form was an experiment to see how we could make forms easier in Astro applications. Now, [Astro has Form Actions](https://docs.astro.build/en/guides/actions/#accepting-form-data-from-an-action), which makes validating form data on the server easier than ever. As for client-side validation, you can reference [my YouTube video on building your own client-side validation](https://www.youtube.com/watch?v=DwEkvie79xI&t=97s). If you want to package this up for others to use, feel free to fork the code in this repository and publish something yourself!

```astro
---
import { z } from "zod";
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

📚 Visit [the docs](https://simple-stack.dev/form) for more information and usage examples.
