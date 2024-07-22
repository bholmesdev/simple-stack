---
"simple-stack-query": minor
---

Change from a global `ready()` block from client scripts to a namespaced `$.ready()` block. Should be safer to avoid collisions with any local variables called `ready`.
