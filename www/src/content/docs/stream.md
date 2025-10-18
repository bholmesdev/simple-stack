---
title: Simple stream 🌊
description: Suspend Astro components with fallback content. Like React Server Components, but Just HTML ™️
---

:::caution
**This package is no longer maintained.** Simple form was an experiment to see how we could make forms easier in Astro applications. Now, [Astro has Form Actions](https://docs.astro.build/en/guides/actions/#accepting-form-data-from-an-action), which makes validating form data on the server easier than ever. As for client-side validation, you can reference [my YouTube video on building your own client-side validation](https://www.youtube.com/watch?v=DwEkvie79xI&t=97s). If you want to package this up for others to use, feel free to fork the code in this repository and publish something yourself!
:::

Suspend Astro components with fallback content. Like React Server Components, but Just HTML ™️

<video controls width="100%" style="aspect-ratio:1.65/1" src="/assets/simple-stream-intro.mov"></video>

```astro
---
import { Suspense } from 'simple-stack-stream/components';
---

<h1>Simple stream</h1>


<!--Suspend slow-to-load content-->
<Suspense>
  <VideoPlayer />
  <!--Show fallback content-->
  <LoadingSkeleton slot="fallback" />
</Suspense>

<Footer />
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
