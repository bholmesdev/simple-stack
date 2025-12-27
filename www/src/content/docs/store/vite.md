---
title: Vite + React
description: Using Simple Store with Vite and React
sidebar:
  order: 2
---

## 1. Create a store

Create stores outside of components so they aren't recreated on each render:

```ts
// src/stores/counter.ts
import { store } from "@simplestack/store";

export const counterStore = store(0);
```

---

## 2. Use the store in a component

```tsx
// src/components/Counter.tsx
import { useStoreValue } from "@simplestack/store/react";
import { counterStore } from "../stores/counter";

export function Counter() {
  const count = useStoreValue(counterStore);

  return (
    <button onClick={() => counterStore.set((n) => n + 1)}>
      Count: {count}
    </button>
  );
}
```

---

## 3. Working with objects and `select()`

For object stores, use `select()` to read and write specific properties:

```ts
// src/stores/user.ts
import { store } from "@simplestack/store";

export const userStore = store({
  name: "Guest",
  preferences: {
    theme: "dark",
  },
});

// Create sub-stores for fine-grained updates
export const nameStore = userStore.select("name");
export const themeStore = userStore.select("preferences").select("theme");
```

```tsx
// src/components/ThemeToggle.tsx
import { useStoreValue } from "@simplestack/store/react";
import { themeStore } from "../stores/user";

export function ThemeToggle() {
  const theme = useStoreValue(themeStore);

  return (
    <button onClick={() => themeStore.set(theme === "dark" ? "light" : "dark")}>
      Theme: {theme}
    </button>
  );
}
```

Changes to `themeStore` automatically update `userStore`, and vice versa.

---

## Recommended directory structure

```
src/
  stores/
    counter.ts
    user.ts
  components/
    Counter.tsx
    ThemeToggle.tsx
```
