---
title: "Singleton"
description: "Understanding the Singleton pattern, its uses, pitfalls, and how to implement it in TypeScript and Vue.js."
---

The **Singleton** is a **creational design pattern** that ensures a class has only **one instance** and provides a global point of access to that instance. This pattern is useful for managing shared resources like configurations, caches, or logging services.

---

## Why Use a Singleton?

### Common Use Cases
- **Configuration Management:** A single source of truth for application settings.
- **Database Connection:** A single connection instance to prevent resource leaks.
- **Shared Cache:** Avoid data duplication in memory.
- **Centralized Logging:** A single logger for the entire application.

### Advantages
✅ **Strict control** over instantiation.
✅ **Global access** to the unique instance.
✅ **Resource efficiency** (e.g., a single database connection).

### Disadvantages
❌ **Hard to test** (shared global state).
❌ **Can introduce hidden dependencies.**
❌ **Thread safety issues** if poorly implemented.

---

## Thread Safety: A Pitfall to Avoid

A **non-thread-safe** Singleton can create multiple instances if two threads instantiate it simultaneously. In JavaScript/TypeScript, this issue is less critical because Node.js is **single-threaded**. However, understanding best practices is important to avoid unexpected behavior in asynchronous environments.

### Solutions for Thread Safety

#### 1. Lazy Initialization
```typescript
class Singleton {
  private static instance: Singleton | null = null;
  private constructor() {}
  public static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }
}
```
✅ **Simple and effective** in single-threaded environments.

---

#### 2. Eager Initialization
```typescript
class Singleton {
  private static instance: Singleton = new Singleton();
  private constructor() {}
  public static getInstance(): Singleton {
    return Singleton.instance;
  }
}
```
✅ **Thread-safe** (instance is created when the class is loaded).
❌ **Less performant** if the instance is not always used.

---

#### 3. Double-Checked Locking (Recommended for multi-threaded environments)
```typescript
class Singleton {
  private static instance: Singleton | null = null;
  private constructor() {}
  public static getInstance(): Singleton {
    if (!Singleton.instance) {
      if (!Singleton.instance) {
        Singleton.instance = new Singleton();
      }
    }
    return Singleton.instance;
  }
}
```
✅ **Thread-safe** and performant.

---

## Example in TypeScript

### Basic Singleton
```typescript
class Database {
  private static instance: Database;
  private constructor() {
    console.log("Connecting to the database...");
  }
  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
  public query(sql: string): void {
    console.log(`Executing: ${sql}`);
  }
}
// Usage
const db1 = Database.getInstance();
const db2 = Database.getInstance();
console.log(db1 === db2); // true (same instance)
```

---

## Example in Vue.js

### Singleton for a Global Store
```javascript
// store.js
let instance = null;
class Store {
  constructor() {
    if (!instance) {
      this.state = { count: 0 };
      instance = this;
    }
    return instance;
  }
  increment() {
    this.state.count++;
  }
}
export const store = new Store();
```

### Usage in a Vue Component
```vue
<script setup>
import { store } from './store';
store.increment();
console.log(store.state.count); // 1
</script>
```

---

## When to Avoid Singleton?

- **Stateful Services:** If two parts of the application simultaneously modify shared state, it can lead to unexpected behavior.
- **Unit Testing:** Singletons make testing more difficult (global state).
- **Scalability:** In a multi-instance environment, a Singleton is no longer "global" to the entire application.

---

## Conclusion

The **Singleton** is a powerful pattern but should be used sparingly. In TypeScript and Vue.js, prefer:
- **Double-Checked Locking** for thread safety.
- **ES6 Modules** for a simple alternative.
- **Avoid it** if your application requires high testability.

> 💡 **Tip:** In JavaScript/TypeScript, a simple object literal (`const singleton = {}`) can often replace a Singleton!