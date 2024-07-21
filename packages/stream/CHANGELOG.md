# simple-stack-stream

## 0.3.4

### Patch Changes

- [#64](https://github.com/bholmesdev/simple-stack/pull/64) [`51c5ae0`](https://github.com/bholmesdev/simple-stack/commit/51c5ae024867777407d0fcc5359d35fc2de7d65d) Thanks [@Mupu](https://github.com/Mupu)! - Fix unhandled crash when a connection is closed before Suspense components are streamed.

## 0.3.3

### Patch Changes

- [#50](https://github.com/bholmesdev/simple-stack/pull/50) [`25bf781`](https://github.com/bholmesdev/simple-stack/commit/25bf7816a81457a755a06afb5ad96b8e711db24b) Thanks [@jonathantneal](https://github.com/jonathantneal)! - Change Suspense wrapper from a `<div>` to a `<span>`. This ensures inline HTML content is correctly parsed.

## 0.3.2

### Patch Changes

- [#55](https://github.com/bholmesdev/simple-stack/pull/55) [`44460a5`](https://github.com/bholmesdev/simple-stack/commit/44460a55aa99c40d23c15473b523bd4e64497d37) Thanks [@parrad0](https://github.com/parrad0)! - Fix missing `text/html` header on Astro pages when using the simple-stack-stream middleware.

## 0.3.1

### Patch Changes

- [#52](https://github.com/bholmesdev/simple-stack/pull/52) [`314eac6`](https://github.com/bholmesdev/simple-stack/commit/314eac6ee074f07d6abd34427de209e9bd5e80fd) Thanks [@bholmesdev](https://github.com/bholmesdev)! - Handle cases where child Suspense boundaries resolve faster than their parent.

## 0.3.0

### Minor Changes

- [#46](https://github.com/bholmesdev/simple-stack/pull/46) [`edfe2a7`](https://github.com/bholmesdev/simple-stack/commit/edfe2a761b55fab26a757e6b18e90a0bf0094e74) Thanks [@lubieowoce](https://github.com/lubieowoce)! - Don't show a fallback if the content renders quickly enough (current timeout: 5ms)

### Patch Changes

- [#46](https://github.com/bholmesdev/simple-stack/pull/46) [`edfe2a7`](https://github.com/bholmesdev/simple-stack/commit/edfe2a761b55fab26a757e6b18e90a0bf0094e74) Thanks [@lubieowoce](https://github.com/lubieowoce)! - Reduced the size of the `<script>` tags that insert streamed content into the DOM

## 0.2.0

### Minor Changes

- [#44](https://github.com/bholmesdev/simple-stack/pull/44) [`08b907c`](https://github.com/bholmesdev/simple-stack/commit/08b907c964412110f6c089e09b4cba61431aafbf) Thanks [@bholmesdev](https://github.com/bholmesdev)! - Update simple:stream internals to support parallel Suspense boundaries and fix nested Suspense edge cases.

## 0.1.0

### Minor Changes

- [#42](https://github.com/bholmesdev/simple-stack/pull/42) [`3e72f1c`](https://github.com/bholmesdev/simple-stack/commit/3e72f1cc2ed02b3015fd918d32e0ff9cb9bf6d1e) Thanks [@bholmesdev](https://github.com/bholmesdev)! - Fix rendering issues when using Layouts with simple stream. This change replaces the `ResolveSuspended` component with automatic rendering via middleware. Once updated, you should now remove `ResolveSuspended` from your project code:

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

## 0.0.3

### Patch Changes

- [#22](https://github.com/bholmesdev/simple-stack/pull/22) [`b645806`](https://github.com/bholmesdev/simple-stack/commit/b645806d3a8f58a8bf1cc21fad8f3295adfa07c5) Thanks [@aarongarciah](https://github.com/aarongarciah)! - Fix simple-stream integration name

## 0.0.2

### Patch Changes

- [#20](https://github.com/bholmesdev/simple-stack/pull/20) [`a36d92d`](https://github.com/bholmesdev/simple-stack/commit/a36d92d24c36d00f6fd547930bb2483da817e2ef) Thanks [@bholmesdev](https://github.com/bholmesdev)! - Simple stream initial release. Who said suspense had to be hard?
