# Simple stream 🌊

Suspend Astro components with fallback content. Like React Server Components, but Just HTML ™️

https://github.com/bholmesdev/simple-stack/assets/51384119/99ed15a4-5a70-4f19-bc2a-712d4039c0a7

```astro
---
import { Suspense, ResolveSuspended } from 'simple-stack-stream/components';
---

<h1>Simple stream</h1>


<!--Suspend slow-to-load content-->
<Suspense>
  <VideoPlayer />
  <!--Show fallback content-->
  <LoadingSkeleton slot="fallback" />
</Suspense>

<Footer />
<!--Render suspended content-->
<ResolveSuspended />
```

## Installation

Simple stream is an Astro integration. You can install and configure this via the Astro CLI using `astro add`:

```bash
npm run astro add simple-stack-stream
```

## Usage

Simple stream exposes a "Suspense" utility to show fallback content while your server-side components load.

### `Suspense`

`<Suspense>` is a wrapper component for any content you want to load out-of-order with a fallback. Pass any suspended content as children, and use `slot="fallback"` to define your fallback:

```astro
---
import { Suspense } from 'simple-stack-stream/components';
---

<Suspense>
  <VideoPlayer />
  <p slot="fallback">Loading...</p>
</Suspense>
```

⚠️ **Client JS is required** for suspended content to render. For progressive enhancement, we recommend including `<noscript>` content as part of your fallback:

```astro
---
import { Suspense } from 'simple-stack-stream/components';
---

<Suspense>
  <VideoPlayer />
  <div slot="fallback">
    <noscript>JavaScript is required for video playback.</noscript>
    <p>Loading...</p>
  </div>
</Suspense>
```

### `ResolveSuspended`

The `<ResolveSuspended />` component renders all suspended content. This component should be placed at the _end_ of your HTML document, ideally before the closing `</body>` tag. This prevents `ResolveSuspended` from blocking components below it when [using Astro SSR](https://docs.astro.build/en/guides/server-side-rendering/#html-streaming).

We recommend [a reusable Layout](https://docs.astro.build/en/core-concepts/layouts/) to ensure this component is present wherever `<Suspense>` is used:

```astro
---
// src/layouts/Layout.astro
import { ResolveSuspended } from 'simple-stack-form/components';
---

<!DOCTYPE html>
<html lang="en">
<head>...</head>
<body>
  <slot />
  <ResolveSuspended />
</body>
</html>
```