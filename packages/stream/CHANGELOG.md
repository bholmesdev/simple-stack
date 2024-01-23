# simple-stack-stream

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
