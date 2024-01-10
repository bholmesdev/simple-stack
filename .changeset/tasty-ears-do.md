---
"simple-stack-form": patch
---

Async validation would cause the form to submit even when form errors are present. This fix updates all form templates to call Astro's submit method manually.
