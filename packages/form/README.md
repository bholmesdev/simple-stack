# Simple form 🧘‍♂️

> The simple way to handle forms in your Astro project

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
