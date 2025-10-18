# Simple stream 🌊

> ⚠️ **This package is no longer maintained.** Astro now has [Server Islands](https://docs.astro.build/en/guides/server-islands/), which largely replace the use cases explored by this package. Server Islands also offer a simpler mental model for streaming content that scales to a number of deployment hosts.
>
> That said, if you want to understand how this package works to fork the functionality for your own use, [watch my YouTube walkthrough!](https://www.youtube.com/watch?v=cdOyOgwt9Zc&t=128s)

https://github.com/bholmesdev/simple-stack/assets/51384119/99ed15a4-5a70-4f19-bc2a-712d4039c0a7

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


📚 Visit [the docs](https://simple-stack.dev/stream) for more information and usage examples.
