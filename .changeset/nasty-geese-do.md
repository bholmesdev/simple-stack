---
"simple-stack-stream": minor
---

Fix rendering issues when using Layouts with simple stream. This change replaces the `ResolveSuspended` component with automatic rendering via middleware. Once updated, you should now remove `ResolveSuspended` from your project code:

```diff
---
import {
  Suspense,
- ResolveSuspended
} from 'simple-stack-stream/components';
---

<Suspense>
  <VideoPlayer />
  <LoadingSkeleton slot="fallback" />
</Suspense>

<Footer />
- <ResolveSuspended />
```

