---
title: DRY - Don't Repeat Yourself
description: Éviter la duplication de code et de logique
---

> *"Chaque connaissance doit avoir une représentation unique, non ambiguë et faisant autorité dans un système"* - Andy Hunt & Dave Thomas

## Qu'est-ce que DRY ?

Le principe DRY nous encourage à éviter la duplication dans notre code. Cela concerne :

- **Le code** - Éviter de copier-coller du code identique
- **La logique métier** - Une règle = un seul endroit
- **Les données** - Configuration centralisée
- **La documentation** - Éviter les redondances

## Pourquoi DRY est important ?

### 🐛 **Moins de bugs**
Un bug corrigé à un endroit = corrigé partout

### 🔧 **Maintenance facile**
Une modification = un seul endroit à changer

### 📖 **Code plus lisible**
Moins de duplication = focus sur l'essentiel

## ❌ Exemples de violations DRY

### Duplication de code

```javascript
// ❌ Code dupliqué
function validateUser(user) {
  if (!user.name || user.name.length < 2) {
    throw new Error('Le nom doit faire au moins 2 caractères');
  }
  if (!user.email || !user.email.includes('@')) {
    throw new Error('Email invalide');
  }
  if (!user.age || user.age < 18 || user.age > 120) {
    throw new Error('Âge doit être entre 18 et 120 ans');
  }
}

function validateAdmin(admin) {
  if (!admin.name || admin.name.length < 2) {
    throw new Error('Le nom doit faire au moins 2 caractères');
  }
  if (!admin.email || !admin.email.includes('@')) {
    throw new Error('Email invalide');
  }
  if (!admin.age || admin.age < 18 || admin.age > 120) {
    throw new Error('Âge doit être entre 18 et 120 ans');
  }
  if (!admin.permissions || admin.permissions.length === 0) {
    throw new Error('Un admin doit avoir des permissions');
  }
}
```

### Duplication de logique métier

```javascript
// ❌ Calcul du prix dupliqué
class Product {
  calculatePrice() {
    let price = this.basePrice;
    if (this.category === 'electronics') {
      price = price * 1.2; // TVA 20%
    } else if (this.category === 'books') {
      price = price * 1.055; // TVA 5.5%
    }
    return price;
  }
}

class CartItem {
  calculateTotalPrice() {
    let price = this.product.basePrice * this.quantity;
    if (this.product.category === 'electronics') {
      price = price * 1.2; // TVA 20% - DUPLIQUÉ !
    } else if (this.product.category === 'books') {
      price = price * 1.055; // TVA 5.5% - DUPLIQUÉ !
    }
    return price;
  }
}
```

## ✅ Solutions DRY

### 1. Extraire les fonctions communes

```javascript
// ✅ Validation centralisée
class Validator {
  static validateName(name) {
    if (!name || name.length < 2) {
      throw new Error('Le nom doit faire au moins 2 caractères');
    }
  }
  
  static validateEmail(email) {
    if (!email || !email.includes('@')) {
      throw new Error('Email invalide');
    }
  }
  
  static validateAge(age) {
    if (!age || age < 18 || age > 120) {
      throw new Error('Âge doit être entre 18 et 120 ans');
    }
  }
}

function validateUser(user) {
  Validator.validateName(user.name);
  Validator.validateEmail(user.email);
  Validator.validateAge(user.age);
}

function validateAdmin(admin) {
  validateUser(admin); // Réutilise la validation de base
  
  if (!admin.permissions || admin.permissions.length === 0) {
    throw new Error('Un admin doit avoir des permissions');
  }
}
```

### 2. Centraliser la logique métier

```javascript
// ✅ Logique de TVA centralisée
class TaxCalculator {
  static TAX_RATES = {
    electronics: 0.20,
    books: 0.055,
    default: 0.20
  };
  
  static calculateTax(category, basePrice) {
    const rate = this.TAX_RATES[category] || this.TAX_RATES.default;
    return basePrice * rate;
  }
  
  static calculatePriceWithTax(category, basePrice) {
    const tax = this.calculateTax(category, basePrice);
    return basePrice + tax;
  }
}

class Product {
  calculatePrice() {
    return TaxCalculator.calculatePriceWithTax(this.category, this.basePrice);
  }
}

class CartItem {
  calculateTotalPrice() {
    const unitPrice = TaxCalculator.calculatePriceWithTax(
      this.product.category, 
      this.product.basePrice
    );
    return unitPrice * this.quantity;
  }
}
```

### 3. Configuration centralisée

```javascript
// ❌ Configuration dispersée
const API_ENDPOINTS = {
  users: 'https://api.example.com/users',
  products: 'https://api.example.com/products',
  orders: 'https://api.example.com/orders'
};

const VALIDATION_RULES = {
  minNameLength: 2,
  maxAge: 120,
  minAge: 18
};

const UI_CONSTANTS = {
  primaryColor: '#007bff',
  errorColor: '#dc3545',
  maxItemsPerPage: 20
};

// ✅ Configuration centralisée
class Config {
  static API = {
    BASE_URL: 'https://api.example.com',
    ENDPOINTS: {
      users: '/users',
      products: '/products',
      orders: '/orders'
    }
  };
  
  static VALIDATION = {
    name: { min: 2, max: 50 },
    age: { min: 18, max: 120 },
    email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
  };
  
  static UI = {
    colors: {
      primary: '#007bff',
      error: '#dc3545',
      success: '#28a745'
    },
    pagination: {
      defaultPageSize: 20,
      maxPageSize: 100
    }
  };
}
```

## DRY avec Vue.js

### Composables réutilisables

```javascript
// ✅ Logique métier réutilisable
export function useApi(baseUrl) {
  const loading = ref(false);
  const error = ref(null);
  
  const request = async (endpoint, options = {}) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  return { loading: readonly(loading), error: readonly(error), request };
}

// Usage dans différents composants
export function useUsers() {
  const { loading, error, request } = useApi('/api');
  
  const getUsers = () => request('/users');
  const createUser = (userData) => request('/users', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
  
  return { loading, error, getUsers, createUser };
}

export function useProducts() {
  const { loading, error, request } = useApi('/api');
  
  const getProducts = () => request('/products');
  const createProduct = (productData) => request('/products', {
    method: 'POST',
    body: JSON.stringify(productData)
  });
  
  return { loading, error, getProducts, createProduct };
}
```

### Composants génériques

```javascript
// ✅ Composant de liste générique
const GenericList = {
  props: {
    items: Array,
    itemComponent: String,
    loading: Boolean,
    error: String,
    emptyMessage: { type: String, default: 'Aucun élément trouvé' }
  },
  template: `
    <div class="generic-list">
      <div v-if="loading" class="loading">Chargement...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="items.length === 0" class="empty">{{ emptyMessage }}</div>
      <div v-else class="items">
        <component 
          v-for="item in items" 
          :key="item.id"
          :is="itemComponent"
          :item="item"
        />
      </div>
    </div>
  `
};

// Composants spécifiques
const UserItem = {
  props: ['item'],
  template: `<div class="user-item">{{ item.name }} - {{ item.email }}</div>`
};

const ProductItem = {
  props: ['item'],
  template: `<div class="product-item">{{ item.name }} - {{ item.price }}€</div>`
};

// Usage
const UserList = {
  components: { GenericList, UserItem },
  template: `
    <GenericList 
      :items="users"
      :loading="loading"
      :error="error"
      item-component="UserItem"
      empty-message="Aucun utilisateur trouvé"
    />
  `
};
```

### Utilitaires partagés

```javascript
// ✅ Utilitaires réutilisables
export const formatters = {
  currency: (amount, currency = 'EUR') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency
    }).format(amount);
  },
  
  date: (date, options = {}) => {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    }).format(new Date(date));
  },
  
  truncate: (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
};

export const validators = {
  required: (value) => !!value || 'Ce champ est requis',
  email: (value) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(value) || 'Email invalide';
  },
  minLength: (min) => (value) => 
    value.length >= min || `Minimum ${min} caractères`,
  maxLength: (max) => (value) => 
    value.length <= max || `Maximum ${max} caractères`
};
```

## ⚠️ Attention aux excès de DRY

### Fausse abstraction

```javascript
// ❌ Abstraction prématurée
function processData(data, type) {
  if (type === 'user') {
    return data.map(item => ({ id: item.id, name: item.fullName }));
  } else if (type === 'product') {
    return data.map(item => ({ id: item.id, name: item.title }));
  } else if (type === 'order') {
    return data.map(item => ({ id: item.id, name: `Commande ${item.number}` }));
  }
  // Cette fonction fait trop de choses différentes !
}

// ✅ Fonctions spécialisées
const transformUsers = (users) => 
  users.map(user => ({ id: user.id, name: user.fullName }));

const transformProducts = (products) => 
  products.map(product => ({ id: product.id, name: product.title }));

const transformOrders = (orders) => 
  orders.map(order => ({ id: order.id, name: `Commande ${order.number}` }));
```

### Couplage excessif

```javascript
// ❌ Couplage par réutilisation forcée
function validateAndSaveUser(userData, saveToDatabase = true, sendEmail = true) {
  // Validation
  if (!userData.email) throw new Error('Email requis');
  
  // Sauvegarde optionnelle
  if (saveToDatabase) {
    database.save(userData);
  }
  
  // Email optionnel
  if (sendEmail) {
    emailService.send(userData.email, 'Bienvenue');
  }
  
  return userData;
}

// ✅ Responsabilités séparées
function validateUser(userData) {
  if (!userData.email) throw new Error('Email requis');
  return userData;
}

function saveUser(userData) {
  return database.save(userData);
}

function sendWelcomeEmail(userData) {
  return emailService.send(userData.email, 'Bienvenue');
}

// Composition à l'usage
async function createUser(userData) {
  const validUser = validateUser(userData);
  const savedUser = await saveUser(validUser);
  await sendWelcomeEmail(savedUser);
  return savedUser;
}
```

## Stratégies pour appliquer DRY

### 1. **Règle des 3**
Avant d'abstraire, attendez d'avoir 3 occurrences similaires

### 2. **Identifier les vrais duplicatas**
```javascript
// Similaire mais pas identique - ne pas forcer DRY
const validateUserEmail = (email) => email.includes('@');
const validateAdminEmail = (email) => email.includes('@') && email.includes('.com');
```

### 3. **Commencer petit**
```javascript
// ✅ Commencer par extraire des constantes
const MIN_PASSWORD_LENGTH = 8;
const MAX_LOGIN_ATTEMPTS = 3;

// Puis des fonctions utilitaires
const isValidPassword = (password) => password.length >= MIN_PASSWORD_LENGTH;

// Enfin des abstractions plus complexes
class AuthService {
  // ...
}
```

## Récapitulatif

### ✅ **Appliquer DRY pour :**
- Code identique copié-collé
- Logique métier répétée
- Configuration dispersée
- Validation redondante

### ❌ **Éviter DRY quand :**
- Le code est similaire mais pas identique
- L'abstraction créerait plus de complexité
- Il n'y a que 2 occurrences
- Les contextes d'usage sont très différents

### 🎯 **Conseils pratiques :**
- **Attendez** d'avoir plusieurs duplicatas avant d'abstraire
- **Nommez bien** vos abstractions
- **Testez** séparément chaque abstraction
- **Documentez** l'intention derrière l'abstraction

---

> *DRY est un outil puissant, mais comme tout outil, il doit être utilisé au bon moment et de la bonne façon !*