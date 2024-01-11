This is a [Next.js](https://nextjs.org/) project demos simple:form in a non-Astro project.

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Breakdown

This repository demos how React server actions can be used with simple form. Here are the most significant files:

```bash
components/
  # form component scaffolded with `simple-form create`, modified to use server actions
  Form.tsx
app/
  # A signup form with live validation
  Signup.tsx
  # includes the form validator and renders a Signup form
  page.tsx
  # server action that validates form data server-side and logs the result
  action.ts
```