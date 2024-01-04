# Simple stream 🌊

> Suspend Astro components with fallback content. Like React Server Components, but Just HTML ™️

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

📚 Visit [the docs](https://simple-stack-docs.vercel.app/packages/stream) for more information
