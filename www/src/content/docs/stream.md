---
title: Simple stream 🌊
description: Suspend Astro components with fallback content. Like React Server Components, but Just HTML ™️
---

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
