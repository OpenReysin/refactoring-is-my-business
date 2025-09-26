---
title: DRY - Don't Repeat Yourself
description: Avoiding Code and Logic Duplication
---

> *"Every piece of knowledge must have a single, unambiguous, authoritative representation within a system."* — Andy Hunt & Dave Thomas

---

## What Is DRY?

The DRY principle encourages us to avoid duplication in our code. This applies to:
- **Code** — Avoid copying and pasting identical code
- **Business Logic** — One rule = one place
- **Data** — Centralized configuration
- **Documentation** — Avoid redundancies

---

## Why Is DRY Important?

### 🐛 **Fewer Bugs**
A bug fixed in one place = fixed everywhere

### 🔧 **Easier Maintenance**
One change = one place to modify

### 📖 **More Readable Code**
Less duplication = focus on what matters

---

## ❌ Examples of DRY Violations

### Code Duplication

```javascript
// ❌ Duplicated code
function validateUser(user) {
  if (!user.name || user.name.length < 2) {
    throw new Error('Name must be at least 2 characters long');
  }
  if (!user.email || !user.email.includes('@')) {
    throw new Error('Invalid email');
  }
  if (!user.age || user.age < 18 || user.age > 120) {
    throw new Error('Age must be between 18 and 120');
  }
}

function validateAdmin(admin) {
  if (!admin.name || admin.name.length < 2) {
    throw new Error('Name must be at least 2 characters long');
  }
  if (!admin.email || !admin.email.includes('@')) {
    throw new Error('Invalid email');
  }
  if (!admin.age || admin.age < 18 || admin.age > 120) {
    throw new Error('Age must be between 18 and 120');
  }
  if (!admin.permissions || admin.permissions.length === 0) {
    throw new Error('An admin must have permissions');
  }
}
```

### Business Logic Duplication

```javascript
// ❌ Duplicated price calculation
class Product {
  calculatePrice() {
    let price = this.basePrice;
    if (this.category === 'electronics') {
      price = price * 1.2; // 20% VAT
    } else if (this.category === 'books') {
      price = price * 1.055; // 5.5% VAT
    }
    return price;
  }
}

class CartItem {
  calculateTotalPrice() {
    let price = this.product.basePrice * this.quantity;
    if (this.product.category === 'electronics') {
      price = price * 1.2; // 20% VAT — DUPLICATED!
    } else if (this.product.category === 'books') {
      price = price * 1.055; // 5.5% VAT — DUPLICATED!
    }
    return price;
  }
}
```

---

## ✅ DRY Solutions

### 1. Extract Common Functions

```javascript
// ✅ Centralized validation
class Validator {
  static validateName(name) {
    if (!name || name.length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }
  }

  static validateEmail(email) {
    if (!email || !email.includes('@')) {
      throw new Error('Invalid email');
    }
  }

  static validateAge(age) {
    if (!age || age < 18 || age > 120) {
      throw new Error('Age must be between 18 and 120');
    }
  }
}

function validateUser(user) {
  Validator.validateName(user.name);
  Validator.validateEmail(user.email);
  Validator.validateAge(user.age);
}

function validateAdmin(admin) {
  validateUser(admin); // Reuse base validation

  if (!admin.permissions || admin.permissions.length === 0) {
    throw new Error('An admin must have permissions');
  }
}
```

### 2. Centralize Business Logic

```javascript
// ✅ Centralized VAT logic
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

### 3. Centralized Configuration

```javascript
// ❌ Scattered configuration
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

// ✅ Centralized configuration
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

---

## DRY with Vue.js

### Reusable Composables

```javascript
// ✅ Reusable business logic
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

// Usage in different components
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

### Generic Components

```javascript
// ✅ Generic list component
const GenericList = {
  props: {
    items: Array,
    itemComponent: String,
    loading: Boolean,
    error: String,
    emptyMessage: { type: String, default: 'No items found' }
  },
  template: `
    <div class="generic-list">
      <div v-if="loading" class="loading">Loading...</div>
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

// Specific components
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
      empty-message="No users found"
    />
  `
};
```

### Shared Utilities

```javascript
// ✅ Reusable utilities
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
  required: (value) => !!value || 'This field is required',
  email: (value) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(value) || 'Invalid email';
  },
  minLength: (min) => (value) =>
    value.length >= min || `Minimum ${min} characters`,
  maxLength: (max) => (value) =>
    value.length <= max || `Maximum ${max} characters`
};
```

---

## ⚠️ Beware of Over-DRYing

### False Abstraction

```javascript
// ❌ Premature abstraction
function processData(data, type) {
  if (type === 'user') {
    return data.map(item => ({ id: item.id, name: item.fullName }));
  } else if (type === 'product') {
    return data.map(item => ({ id: item.id, name: item.title }));
  } else if (type === 'order') {
    return data.map(item => ({ id: item.id, name: `Order ${item.number}` }));
  }
  // This function does too many different things!
}

// ✅ Specialized functions
const transformUsers = (users) =>
  users.map(user => ({ id: user.id, name: user.fullName }));

const transformProducts = (products) =>
  products.map(product => ({ id: product.id, name: product.title }));

const transformOrders = (orders) =>
  orders.map(order => ({ id: order.id, name: `Order ${order.number}` }));
```

### Excessive Coupling

```javascript
// ❌ Forced reuse coupling
function validateAndSaveUser(userData, saveToDatabase = true, sendEmail = true) {
  // Validation
  if (!userData.email) throw new Error('Email required');

  // Optional save
  if (saveToDatabase) {
    database.save(userData);
  }

  // Optional email
  if (sendEmail) {
    emailService.send(userData.email, 'Welcome');
  }

  return userData;
}

// ✅ Separated responsibilities
function validateUser(userData) {
  if (!userData.email) throw new Error('Email required');
  return userData;
}

function saveUser(userData) {
  return database.save(userData);
}

function sendWelcomeEmail(userData) {
  return emailService.send(userData.email, 'Welcome');
}

// Compose at usage
async function createUser(userData) {
  const validUser = validateUser(userData);
  const savedUser = await saveUser(validUser);
  await sendWelcomeEmail(savedUser);
  return savedUser;
}
```

---

## Strategies for Applying DRY

### 1. **Rule of Three**
Wait until you have three similar occurrences before abstracting.

### 2. **Identify True Duplicates**
```javascript
// Similar but not identical — don't force DRY
const validateUserEmail = (email) => email.includes('@');
const validateAdminEmail = (email) => email.includes('@') && email.includes('.com');
```

### 3. **Start Small**
```javascript
// ✅ Start by extracting constants
const MIN_PASSWORD_LENGTH = 8;
const MAX_LOGIN_ATTEMPTS = 3;

// Then utility functions
const isValidPassword = (password) => password.length >= MIN_PASSWORD_LENGTH;

// Finally, more complex abstractions
class AuthService {
  // ...
}
```

---

## Summary

### ✅ **Apply DRY for:**
- Identical copied-and-pasted code
- Repeated business logic
- Scattered configuration
- Redundant validation

### ❌ **Avoid DRY when:**
- Code is similar but not identical
- Abstraction would create more complexity
- There are only two occurrences
- Usage contexts are very different

### 🎯 **Practical Tips:**
- **Wait** until you have multiple duplicates before abstracting
- **Name** your abstractions well
- **Test** each abstraction separately
- **Document** the intention behind the abstraction

---
> *DRY is a powerful tool, but like any tool, it must be used at the right time and in the right way!*