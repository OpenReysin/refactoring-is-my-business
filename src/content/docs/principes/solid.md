---
title: SOLID - The 5 OOP Principles
description: SOLID principles for robust object-oriented architecture
---

SOLID is an acronym that groups together 5 fundamental principles of object-oriented programming. These principles help us create more maintainable, extensible, and robust code.

---

## The 5 SOLID Principles
- **S** - Single Responsibility Principle (SRP)
- **O** - Open/Closed Principle (OCP)
- **L** - Liskov Substitution Principle (LSP)
- **I** - Interface Segregation Principle (ISP)
- **D** - Dependency Inversion Principle (DIP)

---

## S - Single Responsibility Principle
> *"A class should have only one reason to change."*

### ❌ Violation of the Principle
```javascript
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  // Responsibility 1: User data management
  getName() { return this.name; }
  setName(name) { this.name = name; }

  // Responsibility 2: Validation (should be elsewhere)
  validateEmail() {
    return this.email.includes('@');
  }

  // Responsibility 3: Persistence (should be elsewhere)
  save() {
    localStorage.setItem('user', JSON.stringify(this));
  }

  // Responsibility 4: Notification (should be elsewhere)
  sendWelcomeEmail() {
    console.log(`Email sent to ${this.email}`);
  }
}
```

### ✅ Adherence to the Principle
```javascript
// Responsibility 1: Data model
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

// Responsibility 2: Validation
class UserValidator {
  static validateEmail(email) {
    return email && email.includes('@') && email.includes('.');
  }

  static validateName(name) {
    return name && name.length > 0;
  }
}

// Responsibility 3: Persistence
class UserRepository {
  save(user) {
    localStorage.setItem(`user_${user.id}`, JSON.stringify(user));
  }

  findById(id) {
    const data = localStorage.getItem(`user_${id}`);
    return data ? JSON.parse(data) : null;
  }
}

// Responsibility 4: Notification
class EmailService {
  sendWelcomeEmail(user) {
    console.log(`Welcome email sent to ${user.getEmail()}`);
  }
}
```

---

## O - Open/Closed Principle
> *"Software entities should be open for extension but closed for modification."*

### ❌ Violation of the Principle
```javascript
class PaymentProcessor {
  processPayment(amount, method) {
    if (method === 'credit_card') {
      console.log(`Payment of ${amount}€ by credit card`);
      // Credit card specific logic
    } else if (method === 'paypal') {
      console.log(`Payment of ${amount}€ via PayPal`);
      // PayPal specific logic
    } else if (method === 'bitcoin') { // Modification required!
      console.log(`Payment of ${amount}€ in Bitcoin`);
      // Bitcoin specific logic
    }
    // Each new payment method requires modifying this class
  }
}
```

### ✅ Adherence to the Principle
```javascript
// Base interface
class PaymentMethod {
  process(amount) {
    throw new Error('The process method must be implemented');
  }
}

// Extensions closed for modification
class CreditCardPayment extends PaymentMethod {
  process(amount) {
    console.log(`Payment of ${amount}€ by credit card`);
    // Specific logic
  }
}

class PayPalPayment extends PaymentMethod {
  process(amount) {
    console.log(`Payment of ${amount}€ via PayPal`);
    // Specific logic
  }
}

// New extension without modifying existing code!
class BitcoinPayment extends PaymentMethod {
  process(amount) {
    console.log(`Payment of ${amount}€ in Bitcoin`);
    // Specific logic
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
processor.registerMethod('bitcoin', new BitcoinPayment()); // Extension!
```

---

## L - Liskov Substitution Principle
> *"Objects of a derived class should be able to replace objects of the base class."*

### ❌ Violation of the Principle
```javascript
class Bird {
  fly() {
    console.log('I fly!');
  }
}

class Penguin extends Bird {
  fly() {
    throw new Error('Penguins cannot fly!'); // Violates LSP!
  }
}

// Problem: Cannot substitute Bird with Penguin
function makeBirdFly(bird) {
  bird.fly(); // Will fail with a Penguin
}
```

### ✅ Adherence to the Principle
```javascript
// More appropriate abstraction
class Bird {
  move() {
    throw new Error('The move method must be implemented');
  }
}

class FlyingBird extends Bird {
  move() {
    this.fly();
  }

  fly() {
    console.log('I fly!');
  }
}

class SwimmingBird extends Bird {
  move() {
    this.swim();
  }

  swim() {
    console.log('I swim!');
  }
}

class Eagle extends FlyingBird {}
class Penguin extends SwimmingBird {}

// Now, all birds can be substituted
function makeBirdMove(bird) {
  bird.move(); // Works with all types of birds
}

const eagle = new Eagle();
const penguin = new Penguin();
makeBirdMove(eagle);   // "I fly!"
makeBirdMove(penguin); // "I swim!"
```

---

## I - Interface Segregation Principle
> *"Clients should not depend on interfaces they do not use."*

### ❌ Violation of the Principle
```javascript
// Interface too large
class Worker {
  work() { throw new Error('To be implemented'); }
  eat() { throw new Error('To be implemented'); }
  sleep() { throw new Error('To be implemented'); }
  code() { throw new Error('To be implemented'); }
  design() { throw new Error('To be implemented'); }
}

// The designer must implement methods they don't use
class Designer extends Worker {
  work() { this.design(); }
  eat() { console.log('I eat'); }
  sleep() { console.log('I sleep'); }
  code() { throw new Error('I do not code!'); } // Problem!
  design() { console.log('I design'); }
}
```

### ✅ Adherence to the Principle
```javascript
// Separated and specific interfaces
class Workable {
  work() { throw new Error('To be implemented'); }
}

class Eatable {
  eat() { throw new Error('To be implemented'); }
}

class Sleepable {
  sleep() { throw new Error('To be implemented'); }
}

class Codeable {
  code() { throw new Error('To be implemented'); }
}

class Designable {
  design() { throw new Error('To be implemented'); }
}

// Each class implements only what it needs
class Developer extends Workable {
  constructor() {
    super();
    Object.assign(this, new Eatable(), new Sleepable(), new Codeable());
  }

  work() { this.code(); }
  eat() { console.log('I eat'); }
  sleep() { console.log('I sleep'); }
  code() { console.log('I code'); }
}

class Designer extends Workable {
  constructor() {
    super();
    Object.assign(this, new Eatable(), new Sleepable(), new Designable());
  }

  work() { this.design(); }
  eat() { console.log('I eat'); }
  sleep() { console.log('I sleep'); }
  design() { console.log('I design'); }
  // No code() method - perfect!
}
```

---

## D - Dependency Inversion Principle
> *"Depend on abstractions, not on concrete implementations."*

### ❌ Violation of the Principle
```javascript
// Strong coupling with concrete implementations
class MySQLDatabase {
  save(data) {
    console.log('Saving to MySQL');
  }
}

class UserService {
  constructor() {
    this.database = new MySQLDatabase(); // Strong dependency!
  }

  createUser(userData) {
    // Business logic...
    this.database.save(userData);
  }
}

// Problem: Difficult to change databases or test
```

### ✅ Adherence to the Principle
```javascript
// Abstraction
class DatabaseInterface {
  save(data) { throw new Error('To be implemented'); }
  find(id) { throw new Error('To be implemented'); }
}

// Concrete implementations
class MySQLDatabase extends DatabaseInterface {
  save(data) {
    console.log('Saving to MySQL:', data);
  }

  find(id) {
    console.log('Searching in MySQL:', id);
  }
}

class MongoDatabase extends DatabaseInterface {
  save(data) {
    console.log('Saving to MongoDB:', data);
  }

  find(id) {
    console.log('Searching in MongoDB:', id);
  }
}

class InMemoryDatabase extends DatabaseInterface {
  constructor() {
    super();
    this.data = [];
  }

  save(data) {
    this.data.push(data);
    console.log('Saving in memory:', data);
  }

  find(id) {
    return this.data.find(item => item.id === id);
  }
}

// Service that depends on abstraction
class UserService {
  constructor(database) {
    this.database = database; // Dependency injection!
  }

  createUser(userData) {
    // Validation
    if (!userData.name || !userData.email) {
      throw new Error('Invalid data');
    }

    // Business logic
    const user = {
      id: Date.now(),
      ...userData,
      createdAt: new Date()
    };

    // Save via abstraction
    this.database.save(user);
    return user;
  }
}

// Flexible usage
const mysqlDb = new MySQLDatabase();
const mongoDb = new MongoDatabase();
const testDb = new InMemoryDatabase();
const userService1 = new UserService(mysqlDb);   // Production
const userService2 = new UserService(mongoDb);   // Migration
const userService3 = new UserService(testDb);    // Tests
```

---

## SOLID in Practice with Vue.js
```javascript
// S - Components with single responsibility
const UserProfile = {
  // Only displays data
  props: ['user'],
  template: `<div>{{ user.name }} - {{ user.email }}</div>`
};

const UserForm = {
  // Only manages the form
  emits: ['submit'],
  template: `<form @submit="handleSubmit">...</form>`,
  methods: {
    handleSubmit(event) {
      this.$emit('submit', this.formData);
    }
  }
};

// O - Extensible composables
const usePayment = (paymentStrategy) => {
  const processPayment = (amount) => {
    return paymentStrategy.process(amount);
  };

  return { processPayment };
};

// D - Dependency injection
const UserService = {
  provide() {
    return {
      userRepository: new UserRepository(),
      emailService: new EmailService()
    };
  }
};
```

---

## Summary

### ✅ **Benefits of SOLID:**
- **Maintainability** - Easier to modify code
- **Testability** - Each part can be tested independently
- **Reusability** - More modular components
- **Scalability** - New features without breaking existing code

### 🎯 **Practical Tips:**
- Start with **S** (Single Responsibility) - the most important
- **O** (Open/Closed) comes naturally with experience
- **L** (Liskov): Think "substitution" when inheriting
- **I** (Interface Segregation): Prefer many small interfaces
- **D** (Dependency Inversion): Inject dependencies

---
> *SOLID may seem complex at first, but these principles will become natural with practice!*