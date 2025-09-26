---
title: SOLID - Les 5 Principes POO
description: Les principes SOLID pour une architecture orientée objet robuste
---

SOLID est un acronyme qui regroupe 5 principes fondamentaux de la programmation orientée objet. Ces principes nous aident à créer du code plus maintenable, extensible et robuste.

## Les 5 Principes SOLID

- **S** - Single Responsibility Principle (Responsabilité unique)
- **O** - Open/Closed Principle (Ouvert/Fermé)
- **L** - Liskov Substitution Principle (Substitution de Liskov)
- **I** - Interface Segregation Principle (Ségrégation d'interfaces)
- **D** - Dependency Inversion Principle (Inversion de dépendances)

---

## S - Single Responsibility Principle

> *"Une classe ne devrait avoir qu'une seule raison de changer"*

### ❌ Violation du principe

```javascript
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  
  // Responsabilité 1: Gestion des données utilisateur
  getName() { return this.name; }
  setName(name) { this.name = name; }
  
  // Responsabilité 2: Validation (devrait être ailleurs)
  validateEmail() {
    return this.email.includes('@');
  }
  
  // Responsabilité 3: Persistance (devrait être ailleurs)
  save() {
    localStorage.setItem('user', JSON.stringify(this));
  }
  
  // Responsabilité 4: Notification (devrait être ailleurs)  
  sendWelcomeEmail() {
    console.log(`Email envoyé à ${this.email}`);
  }
}
```

### ✅ Respect du principe

```javascript
// Responsabilité 1: Modèle de données
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  
  getName() { return this.name; }
  setName(name) { this.name = name; }
  getEmail() { return this.email; }
  setEmail(email) { this.email = email; }
}

// Responsabilité 2: Validation
class UserValidator {
  static validateEmail(email) {
    return email && email.includes('@') && email.includes('.');
  }
  
  static validateName(name) {
    return name && name.length > 0;
  }
}

// Responsabilité 3: Persistance
class UserRepository {
  save(user) {
    localStorage.setItem(`user_${user.id}`, JSON.stringify(user));
  }
  
  findById(id) {
    const data = localStorage.getItem(`user_${id}`);
    return data ? JSON.parse(data) : null;
  }
}

// Responsabilité 4: Notification
class EmailService {
  sendWelcomeEmail(user) {
    console.log(`Email de bienvenue envoyé à ${user.getEmail()}`);
  }
}
```

---

## O - Open/Closed Principle

> *"Les entités logicielles doivent être ouvertes à l'extension mais fermées à la modification"*

### ❌ Violation du principe

```javascript
class PaymentProcessor {
  processPayment(amount, method) {
    if (method === 'credit_card') {
      console.log(`Paiement de ${amount}€ par carte bancaire`);
      // Logique spécifique carte bancaire
    } else if (method === 'paypal') {
      console.log(`Paiement de ${amount}€ via PayPal`);
      // Logique spécifique PayPal
    } else if (method === 'bitcoin') { // Modification nécessaire !
      console.log(`Paiement de ${amount}€ en Bitcoin`);
      // Logique spécifique Bitcoin
    }
    // Chaque nouveau moyen de paiement nécessite de modifier cette classe
  }
}
```

### ✅ Respect du principe

```javascript
// Interface de base
class PaymentMethod {
  process(amount) {
    throw new Error('La méthode process doit être implémentée');
  }
}

// Extensions fermées à la modification
class CreditCardPayment extends PaymentMethod {
  process(amount) {
    console.log(`Paiement de ${amount}€ par carte bancaire`);
    // Logique spécifique
  }
}

class PayPalPayment extends PaymentMethod {
  process(amount) {
    console.log(`Paiement de ${amount}€ via PayPal`);
    // Logique spécifique
  }
}

// Nouvelle extension sans modifier le code existant !
class BitcoinPayment extends PaymentMethod {
  process(amount) {
    console.log(`Paiement de ${amount}€ en Bitcoin`);
    // Logique spécifique
  }
}

class PaymentProcessor {
  constructor() {
    this.methods = new Map();
  }
  
  registerMethod(name, method) {
    this.methods.set(name, method);
  }
  
  processPayment(amount, methodName) {
    const method = this.methods.get(methodName);
    if (method) {
      method.process(amount);
    }
  }
}

// Usage
const processor = new PaymentProcessor();
processor.registerMethod('credit_card', new CreditCardPayment());
processor.registerMethod('paypal', new PayPalPayment());
processor.registerMethod('bitcoin', new BitcoinPayment()); // Extension !
```

---

## L - Liskov Substitution Principle

> *"Les objets d'une classe dérivée doivent pouvoir remplacer les objets de la classe de base"*

### ❌ Violation du principe

```javascript
class Bird {
  fly() {
    console.log('Je vole !');
  }
}

class Penguin extends Bird {
  fly() {
    throw new Error('Les pingouins ne volent pas !'); // Viole LSP !
  }
}

// Problème : on ne peut pas substituer Bird par Penguin
function makeBirdFly(bird) {
  bird.fly(); // Plantera avec un Penguin
}
```

### ✅ Respect du principe

```javascript
// Abstraction plus appropriée
class Bird {
  move() {
    throw new Error('La méthode move doit être implémentée');
  }
}

class FlyingBird extends Bird {
  move() {
    this.fly();
  }
  
  fly() {
    console.log('Je vole !');
  }
}

class SwimmingBird extends Bird {
  move() {
    this.swim();
  }
  
  swim() {
    console.log('Je nage !');
  }
}

class Eagle extends FlyingBird {}
class Penguin extends SwimmingBird {}

// Maintenant, tous les oiseaux peuvent être substitués
function makeBirdMove(bird) {
  bird.move(); // Fonctionne avec tous les types d'oiseaux
}

const eagle = new Eagle();
const penguin = new Penguin();

makeBirdMove(eagle);   // "Je vole !"
makeBirdMove(penguin); // "Je nage !"
```

---

## I - Interface Segregation Principle

> *"Les clients ne devraient pas dépendre d'interfaces qu'ils n'utilisent pas"*

### ❌ Violation du principe

```javascript
// Interface trop grosse
class Worker {
  work() { throw new Error('À implémenter'); }
  eat() { throw new Error('À implémenter'); }
  sleep() { throw new Error('À implémenter'); }
  code() { throw new Error('À implémenter'); }
  design() { throw new Error('À implémenter'); }
}

// Le designer doit implémenter des méthodes qu'il n'utilise pas
class Designer extends Worker {
  work() { this.design(); }
  eat() { console.log('Je mange'); }
  sleep() { console.log('Je dors'); }
  code() { throw new Error('Je ne code pas !'); } // Problème !
  design() { console.log('Je design'); }
}
```

### ✅ Respect du principe

```javascript
// Interfaces séparées et spécifiques
class Workable {
  work() { throw new Error('À implémenter'); }
}

class Eatable {
  eat() { throw new Error('À implémenter'); }
}

class Sleepable {
  sleep() { throw new Error('À implémenter'); }
}

class Codeable {
  code() { throw new Error('À implémenter'); }
}

class Designable {
  design() { throw new Error('À implémenter'); }
}

// Chaque classe implémente seulement ce dont elle a besoin
class Developer extends Workable {
  constructor() {
    super();
    Object.assign(this, new Eatable(), new Sleepable(), new Codeable());
  }
  
  work() { this.code(); }
  eat() { console.log('Je mange'); }
  sleep() { console.log('Je dors'); }
  code() { console.log('Je code'); }
}

class Designer extends Workable {
  constructor() {
    super();
    Object.assign(this, new Eatable(), new Sleepable(), new Designable());
  }
  
  work() { this.design(); }
  eat() { console.log('Je mange'); }
  sleep() { console.log('Je dors'); }
  design() { console.log('Je design'); }
  // Pas de méthode code() - c'est parfait !
}
```

---

## D - Dependency Inversion Principle

> *"Dépendez des abstractions, pas des implémentations concrètes"*

### ❌ Violation du principe

```javascript
// Couplage fort avec des implémentations concrètes
class MySQLDatabase {
  save(data) {
    console.log('Sauvegarde dans MySQL');
  }
}

class UserService {
  constructor() {
    this.database = new MySQLDatabase(); // Dépendance forte !
  }
  
  createUser(userData) {
    // logique métier...
    this.database.save(userData);
  }
}
// Problème : difficile de changer de base de données ou de tester
```

### ✅ Respect du principe

```javascript
// Abstraction
class DatabaseInterface {
  save(data) { throw new Error('À implémenter'); }
  find(id) { throw new Error('À implémenter'); }
}

// Implémentations concrètes
class MySQLDatabase extends DatabaseInterface {
  save(data) {
    console.log('Sauvegarde dans MySQL:', data);
  }
  
  find(id) {
    console.log('Recherche dans MySQL:', id);
  }
}

class MongoDatabase extends DatabaseInterface {
  save(data) {
    console.log('Sauvegarde dans MongoDB:', data);
  }
  
  find(id) {
    console.log('Recherche dans MongoDB:', id);
  }
}

class InMemoryDatabase extends DatabaseInterface {
  constructor() {
    super();
    this.data = [];
  }
  
  save(data) {
    this.data.push(data);
    console.log('Sauvegarde en mémoire:', data);
  }
  
  find(id) {
    return this.data.find(item => item.id === id);
  }
}

// Service qui dépend de l'abstraction
class UserService {
  constructor(database) {
    this.database = database; // Injection de dépendance !
  }
  
  createUser(userData) {
    // Validation
    if (!userData.name || !userData.email) {
      throw new Error('Données invalides');
    }
    
    // Logique métier
    const user = {
      id: Date.now(),
      ...userData,
      createdAt: new Date()
    };
    
    // Sauvegarde via l'abstraction
    this.database.save(user);
    return user;
  }
}

// Usage flexible
const mysqlDb = new MySQLDatabase();
const mongoDb = new MongoDatabase();
const testDb = new InMemoryDatabase();

const userService1 = new UserService(mysqlDb);   // Production
const userService2 = new UserService(mongoDb);   // Migration
const userService3 = new UserService(testDb);    // Tests
```

## SOLID en pratique avec Vue.js

```javascript
// S - Composants avec responsabilité unique
const UserProfile = {
  // Se contente d'afficher les données
  props: ['user'],
  template: `<div>{{ user.name }} - {{ user.email }}</div>`
};

const UserForm = {
  // Se contente de gérer le formulaire
  emits: ['submit'],
  template: `<form @submit="handleSubmit">...</form>`,
  methods: {
    handleSubmit(event) {
      this.$emit('submit', this.formData);
    }
  }
};

// O - Composables extensibles
const usePayment = (paymentStrategy) => {
  const processPayment = (amount) => {
    return paymentStrategy.process(amount);
  };
  
  return { processPayment };
};

// D - Injection de dépendances
const UserService = {
  provide() {
    return {
      userRepository: new UserRepository(),
      emailService: new EmailService()
    };
  }
};
```

## Récapitulatif

### ✅ **Les bénéfices de SOLID :**
- **Maintenabilité** - Code plus facile à modifier
- **Testabilité** - Chaque partie peut être testée indépendamment
- **Réutilisabilité** - Composants plus modulaires
- **Évolutivité** - Nouvelles fonctionnalités sans casser l'existant

### 🎯 **Conseils pratiques :**
- Commencez par **S** (Single Responsibility) - le plus important
- **O** (Open/Closed) vient naturellement avec l'expérience
- **L** (Liskov) : pensez "substitution" lors de l'héritage
- **I** (Interface Segregation) : préférez plusieurs petites interfaces
- **D** (Dependency Inversion) : injectez les dépendances

---

> *SOLID peut sembler complexe au début, mais ces principes deviendront naturels avec la pratique !*