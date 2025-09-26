---
title: Law of Demeter - Principle of Least Knowledge
description: Reducing coupling between objects for more maintainable code
---

> *"Only talk to your immediate friends"* — Law of Demeter

---

## What is the Law of Demeter?

The Law of Demeter (LoD) states that an object should only interact with:
1. **Itself** (its own methods and properties)
2. **Its parameters** (arguments passed to the method)
3. **Objects it creates** (instances created within the method)
4. **Its direct components** (properties of the object)

---

## Why Follow This Law?

### 🔗 **Less Coupling**
Objects depend on fewer other objects.

### 🧪 **Easier to Test**
Fewer dependencies to mock.

### 🔧 **Easier to Maintain**
A change in one object affects fewer other objects.

### 🐛 **Fewer Bugs**
Fewer fragile call chains.

---

## ❌ Violation of the Law of Demeter

### The Problem of "Train Wrecks"

```javascript
// ❌ Dangerous call chain
class OrderService {
  processOrder(order) {
    // Violation: Navigating through multiple objects
    const street = order.getCustomer().getAddress().getStreet();
    const city = order.getCustomer().getAddress().getCity();
    const country = order.getCustomer().getAddress().getCountry();

    console.log(`Delivery to ${street}, ${city}, ${country}`);

    // Another violation
    const discount = order.getCustomer().getMembership().getDiscountRate();
    const finalPrice = order.getTotalPrice() * (1 - discount);

    return finalPrice;
  }
}

// Problems with this approach:
// 1. If Address changes its structure, OrderService must change
// 2. If Customer has no Address, it crashes
// 3. Hard to test (need to mock Customer, Address, Membership...)
// 4. OrderService knows too much about other objects
```

### Excessive Coupling in Vue.js

```javascript
// ❌ Component violating the Law of Demeter
const UserProfile = {
  props: ['user'],
  template: `
    <div>
      <h1>{{ user.personalInfo.name.firstName }} {{ user.personalInfo.name.lastName }}</h1>
      <p>{{ user.contactInfo.address.street }}, {{ user.contactInfo.address.city }}</p>
      <p>Email: {{ user.contactInfo.email.primary }}</p>
      <p>Phone: {{ user.contactInfo.phone.mobile }}</p>
      <!-- If the user structure changes, this component must change -->
    </div>
  `
};
```

---

## ✅ Adherence to the Law of Demeter

### Solution 1: Delegation Methods

```javascript
// ✅ Objects respecting the Law of Demeter
class Address {
  constructor(street, city, country) {
    this.street = street;
    this.city = city;
    this.country = country;
  }

  getFullAddress() {
    return `${this.street}, ${this.city}, ${this.country}`;
  }
}

class Membership {
  constructor(type, discountRate) {
    this.type = type;
    this.discountRate = discountRate;
  }

  getDiscountRate() {
    return this.discountRate;
  }
}

class Customer {
  constructor(name, address, membership) {
    this.name = name;
    this.address = address;
    this.membership = membership;
  }

  // Delegation methods - Customer exposes what its clients need
  getDeliveryAddress() {
    return this.address.getFullAddress();
  }

  getDiscountRate() {
    return this.membership ? this.membership.getDiscountRate() : 0;
  }

  getName() {
    return this.name;
  }
}

class Order {
  constructor(customer, items, totalPrice) {
    this.customer = customer;
    this.items = items;
    this.totalPrice = totalPrice;
  }

  // Methods exposing necessary data
  getDeliveryAddress() {
    return this.customer.getDeliveryAddress();
  }

  getCustomerDiscount() {
    return this.customer.getDiscountRate();
  }

  getTotalPrice() {
    return this.totalPrice;
  }

  calculateFinalPrice() {
    const discount = this.getCustomerDiscount();
    return this.totalPrice * (1 - discount);
  }
}

class OrderService {
  processOrder(order) {
    // ✅ Now we only talk to our "immediate friends"
    console.log(`Delivery to ${order.getDeliveryAddress()}`);
    const finalPrice = order.calculateFinalPrice();
    return finalPrice;
  }
}
```

### Solution 2: Data Transfer Objects (DTOs)

```javascript
// ✅ DTOs encapsulating necessary data
class DeliveryInfo {
  constructor(customerName, fullAddress, phone) {
    this.customerName = customerName;
    this.fullAddress = fullAddress;
    this.phone = phone;
  }
}

class PricingInfo {
  constructor(basePrice, discountRate, finalPrice) {
    this.basePrice = basePrice;
    this.discountRate = discountRate;
    this.finalPrice = finalPrice;
  }
}

class Order {
  // ... existing properties

  getDeliveryInfo() {
    return new DeliveryInfo(
      this.customer.getName(),
      this.customer.getDeliveryAddress(),
      this.customer.getPhone()
    );
  }

  getPricingInfo() {
    const discount = this.customer.getDiscountRate();
    const finalPrice = this.totalPrice * (1 - discount);

    return new PricingInfo(this.totalPrice, discount, finalPrice);
  }
}

class OrderService {
  processOrder(order) {
    const delivery = order.getDeliveryInfo();
    const pricing = order.getPricingInfo();

    console.log(`Delivery for ${delivery.customerName} to ${delivery.fullAddress}`);
    console.log(`Final price: ${pricing.finalPrice}€ (discount: ${pricing.discountRate * 100}%)`);

    return pricing.finalPrice;
  }
}
```

---

## Law of Demeter with Vue.js

### Decoupled Components

```javascript
// ✅ Flattened props respecting the Law of Demeter
const UserProfile = {
  props: {
    // Instead of passing the entire user object, pass necessary data
    fullName: String,
    email: String,
    address: String,
    phone: String,
    avatarUrl: String
  },
  template: `
    <div class="user-profile">
      <img :src="avatarUrl" :alt="fullName" />
      <h1>{{ fullName }}</h1>
      <p>{{ address }}</p>
      <p>Email: {{ email }}</p>
      <p>Phone: {{ phone }}</p>
    </div>
  `
};

// Parent component preparing the data
const UserPage = {
  props: ['user'],
  computed: {
    userProfileData() {
      return {
        fullName: this.user.getFullName(),
        email: this.user.getPrimaryEmail(),
        address: this.user.getDeliveryAddress(),
        phone: this.user.getPrimaryPhone(),
        avatarUrl: this.user.getAvatarUrl()
      };
    }
  },
  template: `
    <UserProfile v-bind="userProfileData" />
  `
};
```

### Composables Respecting the Law of Demeter

```javascript
// ✅ Composable encapsulating complexity
export function useUserData(userId) {
  const user = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Prepared and flattened data
  const userProfile = computed(() => {
    if (!user.value) return null;

    return {
      displayName: user.value.getDisplayName(),
      email: user.value.getPrimaryEmail(),
      address: user.value.getFormattedAddress(),
      membershipLevel: user.value.getMembershipLevel(),
      joinedDate: user.value.getJoinedDate()
    };
  });

  const fetchUser = async () => {
    loading.value = true;
    try {
      const response = await userService.getUserById(userId);
      user.value = new User(response.data);
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return {
    userProfile: readonly(userProfile),
    loading: readonly(loading),
    error: readonly(error),
    fetchUser
  };
}

// Usage in component
const UserComponent = {
  setup() {
    const { userProfile, loading, error, fetchUser } = useUserData(props.userId);

    onMounted(fetchUser);

    return {
      profile: userProfile, // Flattened and prepared data
      loading,
      error
    };
  },
  template: `
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="profile">
      <h1>{{ profile.displayName }}</h1>
      <p>{{ profile.email }}</p>
      <!-- No more object navigation! -->
    </div>
  `
};
```

### Vuex/Pinia Store Respecting the Law of Demeter

```javascript
// ✅ Store with getters respecting the Law of Demeter
const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    currentUser: null
  }),

  getters: {
    // Getters exposing flattened data
    currentUserProfile: (state) => {
      if (!state.currentUser) return null;

      return {
        id: state.currentUser.id,
        displayName: state.currentUser.getDisplayName(),
        email: state.currentUser.getPrimaryEmail(),
        isAdmin: state.currentUser.hasRole('admin'),
        preferences: state.currentUser.getFormattedPreferences()
      };
    },

    usersList: (state) => {
      return state.users.map(user => ({
        id: user.id,
        name: user.getDisplayName(),
        email: user.getPrimaryEmail(),
        status: user.getStatus(),
        lastActive: user.getLastActiveFormatted()
      }));
    }
  },

  actions: {
    async fetchCurrentUser() {
      const response = await userApi.getCurrentUser();
      this.currentUser = new User(response.data);
    }
  }
});
```

---

## Practical Application Cases

### API and Services

```javascript
// ❌ Service violating the Law of Demeter
class NotificationService {
  sendOrderConfirmation(order) {
    const email = order.getCustomer().getContactInfo().getEmail();
    const name = order.getCustomer().getPersonalInfo().getName();
    const address = order.getCustomer().getAddress().getFormatted();
    // Too much navigation!
  }
}

// ✅ Service respecting the Law of Demeter
class NotificationService {
  sendOrderConfirmation(order) {
    const notification = order.getNotificationData();
    this.emailService.send({
      to: notification.customerEmail,
      subject: `Order confirmation ${order.getNumber()}`,
      template: 'order-confirmation',
      data: notification
    });
  }
}

class Order {
  getNotificationData() {
    return {
      customerEmail: this.customer.getPrimaryEmail(),
      customerName: this.customer.getDisplayName(),
      orderNumber: this.number,
      deliveryAddress: this.customer.getDeliveryAddress(),
      items: this.items.map(item => item.getDisplayInfo()),
      totalPrice: this.calculateFinalPrice()
    };
  }
}
```

### Forms and Validation

```javascript
// ✅ Decoupled form component
const AddressForm = {
  emits: ['submit'],
  data() {
    return {
      form: {
        street: '',
        city: '',
        postalCode: '',
        country: 'France'
      }
    };
  },
  methods: {
    handleSubmit() {
      // The component doesn't know the complex structure of User
      this.$emit('submit', {
        street: this.form.street,
        city: this.form.city,
        postalCode: this.form.postalCode,
        country: this.form.country
      });
    }
  }
};

// Parent component managing complexity
const UserSettings = {
  methods: {
    handleAddressUpdate(addressData) {
      // Here we can translate to our complex model
      this.user.updateAddress(new Address(
        addressData.street,
        addressData.city,
        addressData.postalCode,
        addressData.country
      ));
    }
  },
  template: `
    <AddressForm @submit="handleAddressUpdate" />
  `
};
```

---

## Benefits of the Law of Demeter

### 🔧 **Easier Maintenance**

```javascript
// If Address changes its internal structure, only the Address class needs to change
class Address {
  // Internal structure can evolve freely
  constructor(data) {
    this.streetInfo = { number: data.number, name: data.street };
    this.locationInfo = { city: data.city, zip: data.zip };
  }

  // Stable public interface
  getFullAddress() {
    return `${this.streetInfo.number} ${this.streetInfo.name}, ${this.locationInfo.city}`;
  }
}
```

### 🧪 **Simpler Tests**

```javascript
// ✅ Simple test with minimal mocks
describe('OrderService', () => {
  test('should process order correctly', () => {
    const mockOrder = {
      getDeliveryAddress: () => '123 Main St, Paris',
      calculateFinalPrice: () => 99.99,
      getNumber: () => 'ORD-123'
    };

    const service = new OrderService();
    const result = service.processOrder(mockOrder);

    expect(result).toBe(99.99);
    // No need to mock Customer, Address, Membership, etc.
  });
});
```

---

## ⚠️ When the Law of Demeter Can Be Relaxed

### Simple Data Objects

```javascript
// ✅ Acceptable for pure data objects
const config = {
  api: {
    baseUrl: 'https://api.example.com',
    timeout: 5000
  },
  ui: {
    theme: 'dark',
    language: 'fr'
  }
};
// OK because config is a data object, not a business object
const apiUrl = config.api.baseUrl;
```

### Short and Stable Chains

```javascript
// ✅ Acceptable if the chain is short and stable
const userName = user.profile.name; // OK if this structure is stable
```

### Fluent APIs

```javascript
// ✅ Fluent APIs are an acceptable exception
const query = queryBuilder
  .select('name', 'email')
  .from('users')
  .where('active', true)
  .orderBy('name')
  .build();
```

---

## Techniques to Follow the Law of Demeter

### 1. **Delegation Methods**

```javascript
class Customer {
  getShippingCost() {
    return this.address.calculateShippingCost();
  }

  getFormattedAddress() {
    return this.address.getFormatted();
  }
}
```

### 2. **Facade Interfaces**

```javascript
class UserFacade {
  constructor(user) {
    this.user = user;
  }

  // Simplified interface hiding complexity
  getDisplayInfo() {
    return {
      name: this.user.personalInfo.getFullName(),
      avatar: this.user.profile.getAvatarUrl(),
      status: this.user.account.getStatus(),
      joinDate: this.user.account.getCreatedDate()
    };
  }
}
```

### 3. **Dependency Injection**

```javascript
// Instead of navigating to find services
class OrderProcessor {
  constructor(emailService, paymentService, inventoryService) {
    this.emailService = emailService;
    this.paymentService = paymentService;
    this.inventoryService = inventoryService;
  }

  process(order) {
    // Directly use injected services
    this.emailService.sendConfirmation(order.getNotificationData());
    // ...
  }
}
```

---

## Application with TypeScript

### Types Encouraging Decoupling

```typescript
// ✅ Types defining clear interfaces
interface UserDisplayData {
  readonly fullName: string;
  readonly email: string;
  readonly avatarUrl: string;
  readonly membershipLevel: string;
}

interface OrderSummary {
  readonly id: string;
  readonly customerName: string;
  readonly totalAmount: number;
  readonly status: OrderStatus;
  readonly estimatedDelivery: Date;
}

class User {
  // Methods returning simple types
  getDisplayData(): UserDisplayData {
    return {
      fullName: this.getFullName(),
      email: this.getPrimaryEmail(),
      avatarUrl: this.getAvatarUrl(),
      membershipLevel: this.getMembershipLevel()
    };
  }
}
```

### Generic Constraints to Limit Access

```typescript
// ✅ Generic constraints limiting exposure
interface Summarizable {
  getSummary(): object;
}

class ReportGenerator<T extends Summarizable> {
  generateReport(items: T[]): string {
    // Can only use getSummary(), not access internal properties
    return items.map(item => item.getSummary()).join('\n');
  }
}
```

---

## Summary

### ✅ **The Law of Demeter Encourages:**
- **Strong encapsulation** — Objects hide their internal details.
- **Loose coupling** — Objects depend on fewer other objects.
- **Stable interfaces** — Internal changes don't affect clients.
- **More testable code** — Fewer dependencies to mock.

### ❌ **Avoid:**
- "Train wrecks" (`obj.getProp().getOther().getValue()`)
- Exposing implementation details
- Transitive dependencies
- Fragile call chains

### 🎯 **Practical Techniques:**
- **Delegation** — Expose methods that hide complexity.
- **DTOs/VOs** — Transfer objects encapsulating data.
- **Facades** — Simplified interfaces for complex subsystems.
- **Injection** — Provide dependencies rather than seeking them.

---
> *The Law of Demeter helps us create objects that are good citizens in our system: they respect the privacy of others and expose a clear, stable interface!*