---
title:  Add client validation
description: Add client validation to your forms
sidebar:
  order: 3
---

simple form helps generate a client-validated form in your framework of choice.

> ⚠️ When using Astro, client validation relies on Astro view transitions. Ensure [view transitions are enabled](https://docs.astro.build/en/guides/view-transitions/#adding-view-transitions-to-a-page) on your page.

## Create a form with the `simple-form` CLI

You can generate a client form component with the `simple-form create` command:

```bash
# npm
npx simple-form create

# pnpm
pnpm dlx simple-form create
```

This will output form and input components in your directory of choice.

<details>
<summary><strong>🙋‍♀️ Why code generation?</strong></summary>

We know form libraries have [come](https://react-hook-form.com/) and [gone](https://formik.org/) over the years. We think the reason is _ahem_ simple: **forms are just hard.** There's countless pieces to tweak, from debounced inputs to live vs. delayed validation to styling your components.

So, we decided to take a hint from the popular [shadcn/ui](https://ui.shadcn.com/docs/theming) library and pass the code off to you.

We expose internal functions to manage your form state and handle both synchronous and asynchronous validation. Then, we generate components with accessible defaults based on [the "Reward now, punish late" pattern.](https://www.smashingmagazine.com/2022/09/inline-validation-web-forms-ux/#4-reward-early-punish-late) We invite you to tweak and override the code from here!

</details>

## Reward early, punish late pattern

Simple form uses the "reward early, punish late" pattern for input validation.

- **Punish late:** Only show error messaging when the user has moved on to the next input. This uses the [input `blur` event.](https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event)
- **Reward early:** Remove error messaging the moment the user corrects an error. This uses the [input `change` event.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event)

This is simple form's implementation of the pattern using React:

```tsx
<input
  onChange={async (e) => {
    const value = e.target.value;
    // Check if the input has errored before.
    // If so, enter live validation mode (reward early)
    if (!hasErroredOnce) return;
    formContext.validateField(value);
  }}
  // Validate once the user blurs the input (punish late)
  onBlur={async (e) => {
    const value = e.target.value;
    // Exception: Avoid validating empty inputs on blur.
    // It's best to hide "required" errors 
    // until the user submits the form.
    if (value === "") return;
    formContext.validateField(value);
  }}
/>
```

You will likely find exceptions to this pattern, like live password rules or postal code suggestions. This is why simple form uses code generation! You are free to copy generated code and massage to your intended use case. 

**Sources**

- [📚 Vitaly Friedman on form validation UX](https://www.smashingmagazine.com/2022/09/inline-validation-web-forms-ux/#4-reward-early-punish-late)

## Online playground

We recommend our online playgrounds to try client validation in your framework of choice:

- [Astro playground](https://stackblitz.com/github/bholmesdev/simple-stack/tree/main/examples/playground)
- [Next.js playground](https://stackblitz.com/github/bholmesdev/simple-stack/tree/main/examples/nextjs-app-router)
