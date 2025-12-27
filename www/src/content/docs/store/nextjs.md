---
title: Next.js
description: Using Simple Store with Next.js
sidebar:
  order: 3
---

## 1. Create a store (server-safe)

Create stores outside of components (e.g. `lib/counter.ts`) so they aren't recreated on each render:

```ts
// lib/counter.ts
import { store } from "@simplestack/store";

export const counterStore = store(0);
```

---

## 2. Use the store in a client component

Any component that uses `useStoreValue` must be a `"use client"` component:

```tsx
// app/components/Counter.tsx
"use client";

import { useStoreValue } from "@simplestack/store/react";
import { counterStore } from "@/lib/counter";

export default function Counter() {
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
// lib/user.ts
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
// app/components/ThemeToggle.tsx
"use client";

import { useStoreValue } from "@simplestack/store/react";
import { themeStore } from "@/lib/user";

export default function ThemeToggle() {
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

## 4. Using stores in server components

You cannot subscribe to a store in a server component, but you can read its current value:

```tsx
// app/page.tsx (server component)
import { counterStore } from "@/lib/counter";

export default function Page() {
  const count = counterStore.get(); // OK: read-only on server

  return (
    <div>
      <p>Server-rendered count: {count}</p>
    </div>
  );
}
```

---

## 5. SSR & Hydration

- The store is initialized only once per server request (safe for App Router)
- Client components hydrate with the store's initial value—no mismatch issues
- Avoid calling `store()` inside components (same rule as Zustand)

If you need to sync server data into a store, use `useEffect`:

```tsx
"use client";

import { useEffect } from "react";
import { userStore } from "@/lib/user";

export default function UserProvider({ serverUser }: { serverUser: User }) {
  useEffect(() => {
    userStore.set(serverUser);
  }, [serverUser]);

  return null;
}
```

---

## Recommended directory structure

```
lib/
  counter.ts
  user.ts
app/
  components/
    Counter.tsx
    ThemeToggle.tsx
```
