---
title: "Le Design Pattern Singleton en TypeScript et Vue.js"
description: "Comprendre le pattern Singleton, son utilité, ses pièges, et comment l'implémenter en TypeScript et Vue.js."
---

Le **Singleton** est un **design pattern de création** qui garantit qu'une classe n'a qu'**une seule instance** et fournit un point d'accès global à cette instance. Ce pattern est utile pour gérer des ressources partagées comme une configuration, un cache, ou un service de logging.

---

## Pourquoi utiliser un Singleton ?

### Cas d'usage courants
- **Gestion de configuration** : Une seule source de vérité pour les paramètres de l'application.
- **Connexion à une base de données** : Une seule instance de connexion pour éviter les fuites de ressources.
- **Cache partagé** : Éviter la duplication de données en mémoire.
- **Logging centralisé** : Un seul logger pour toute l'application.

### Avantages
✅ **Contrôle strict** sur l'instantiation.
✅ **Accès global** à l'instance unique.
✅ **Économie de ressources** (ex : une seule connexion DB).

### Inconvénients
❌ **Difficile à tester** (état global partagé).
❌ **Peut introduire des dépendances cachées**.
❌ **Problèmes de thread safety** si mal implémenté.

---

## Thread Safety : Un Piège à Éviter

Un Singleton **non thread-safe** peut créer plusieurs instances si deux threads l'instancient simultanément. En JavaScript/TypeScript, ce problème est moins critique car Node.js est **mono-threadé**. Cependant, il est important de comprendre les bonnes pratiques pour éviter les comportements inattendus dans des environnements asynchrones.

### Solutions pour la Thread Safety

#### 1. Initialisation Paresseuse (Lazy Initialization)
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
✅ **Simple et efficace** en environnement mono-threadé.

---

#### 2. Initialisation Immédiate (Eager Initialization)
```typescript
class Singleton {
  private static instance: Singleton = new Singleton();

  private constructor() {}

  public static getInstance(): Singleton {
    return Singleton.instance;
  }
}
```
✅ **Thread-safe** (l'instance est créée au chargement de la classe).
❌ **Moins performant** si l'instance n'est pas toujours utilisée.

---

#### 3. Double-Checked Locking (Recommandé pour les environnements multi-threadés)
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
✅ **Thread-safe** et performant.

---

## Exemple en TypeScript

### Singleton de Base
```typescript
class Database {
  private static instance: Database;

  private constructor() {
    console.log("Connexion à la base de données...");
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public query(sql: string): void {
    console.log(`Exécution de : ${sql}`);
  }
}

// Utilisation
const db1 = Database.getInstance();
const db2 = Database.getInstance();

console.log(db1 === db2); // true (même instance)
```

---

## Exemple en Vue.js

### Singleton pour un Store Global
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

### Utilisation dans un Composant Vue
```vue
<script setup>
import { store } from './store';

store.increment();
console.log(store.state.count); // 1
</script>
```

---

## Quand Éviter le Singleton ?

- **Services avec état mutable** : Si deux parties de l'application modifient simultanément un état partagé, cela peut causer des comportements inattendus.
- **Tests unitaires** : Les Singletons rendent les tests plus difficiles (état global).
- **Scalabilité** : Dans un environnement multi-instance, un Singleton n'est plus "global" à toute l'application.

---

## Conclusion

Le **Singleton** est un pattern puissant, mais à utiliser avec parcimonie. En TypeScript et Vue.js, privilégiez :
- **Double-Checked Locking** pour la thread safety.
- **Modules ES6** pour une alternative simple.
- **Évitez-le** si votre application nécessite une forte testabilité.

> 💡 **Astuce** : En JavaScript/TypeScript, un simple objet littéral (`const singleton = {}`) peut souvent remplacer un Singleton !