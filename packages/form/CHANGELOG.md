# simple-stack-form

## 0.1.12

### Patch Changes

- [#40](https://github.com/bholmesdev/simple-stack/pull/40) [`23cb93c`](https://github.com/bholmesdev/simple-stack/commit/23cb93cf35f4e8400c22289a655f4c4d2bb3bb08) Thanks [@dsnjunior](https://github.com/dsnjunior)! - Add `min` and `max` input props to number input if present on schema

## 0.1.11

### Patch Changes

- [#38](https://github.com/bholmesdev/simple-stack/pull/38) [`43eb52c`](https://github.com/bholmesdev/simple-stack/commit/43eb52cea8af0c2c5e62bff6dc2e6a2e957dda90) Thanks [@dsnjunior](https://github.com/dsnjunior)! - Set input type as email for inputs validating email values

## 0.1.10

### Patch Changes

- [#34](https://github.com/bholmesdev/simple-stack/pull/34) [`574fee1`](https://github.com/bholmesdev/simple-stack/commit/574fee1bf5cd3a78d36d412ecee4f87c75cc6999) Thanks [@bholmesdev](https://github.com/bholmesdev)! - Add a generic React template to use simple-form in non-Astro projects.

  To try it, install `simple-stack-form` as a dependency in your React-based project:

  ```bash
  # pnpm
  pnpm i simple-stack-form
  # npm
  npm i simple-stack-form
  ```

  And run the `simple-form create` command. This will create a base template for validation, and leave `onSubmit` handling to you.

  ```bash
  # pnpm
  pnpx run simple-form create
  # npm
  npx simple-form create
  ```

## 0.1.9

### Patch Changes

- [#31](https://github.com/bholmesdev/simple-stack/pull/31) [`0d489e5`](https://github.com/bholmesdev/simple-stack/commit/0d489e5f356e607a97a06766f9549666c599dae0) Thanks [@bholmesdev](https://github.com/bholmesdev)! - Async validation would cause the form to submit even when form errors are present. This fix updates all form templates to call Astro's submit method manually.

## 0.1.8

### Patch Changes

- [#29](https://github.com/bholmesdev/simple-stack/pull/29) [`79d5cc5`](https://github.com/bholmesdev/simple-stack/commit/79d5cc53fe1f6bb108e5ecb13b089d730b6c73c1) Thanks [@dsnjunior](https://github.com/dsnjunior)! - Make `inputProps` keys from created forms typed. This way will be easier to identify what inputs are available for the each form.

## 0.1.7

### Patch Changes

- [`3405d5b`](https://github.com/bholmesdev/simple-stack/commit/3405d5baa881460aaa98e03dc096b9f720824ae9) Thanks [@dsnjunior](https://github.com/dsnjunior)! - Add Solid JS template

## 0.1.6

### Patch Changes

- [#18](https://github.com/bholmesdev/simple-stack/pull/18) [`86034e4`](https://github.com/bholmesdev/simple-stack/commit/86034e4f0880f254fa033a09a66bd8c59b85e4a7) Thanks [@bholmesdev](https://github.com/bholmesdev)! - Fix accidental form submission on client validation errors
