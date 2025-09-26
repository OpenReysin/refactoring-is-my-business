---
title: Loi de Déméter - Principe de connaissance minimale
description: Réduire les couplages entre objets pour un code plus maintenable
---

> *"Ne parlez qu'à vos amis immédiats"* - Loi de Déméter

## Qu'est-ce que la Loi de Déméter ?

La Loi de Déméter (Law of Demeter - LoD) stipule qu'un objet ne doit interagir qu'avec :

1. **Lui-même** (ses propres méthodes et propriétés)
2. **Ses paramètres** (arguments passés à la méthode)
3. **Les objets qu'il crée** (instances créées dans la méthode)
4. **Ses composants directs** (propriétés de l'objet)

## Pourquoi respecter cette loi ?

### 🔗 **Moins de couplage**
Les objets dépendent de moins d'autres objets

### 🧪 **Plus facile à tester**
Moins de dépendances à mocker

### 🔧 **Plus facile à maintenir**
Un changement dans un objet affecte moins d'autres objets

### 🐛 **Moins de bugs**
Moins de chaînes d'appels fragiles

## ❌ Violation de la Loi de Déméter

### Le problème des "train wrecks"

```javascript
// ❌ Chaîne d'appels dangereuse
class OrderService {
  processOrder(order) {
    // Violation : on navigue dans plusieurs objets
    const street = order.getCustomer().getAddress().getStreet();
    const city = order.getCustomer().getAddress().getCity();
    const country = order.getCustomer().getAddress().getCountry();
    
    console.log(`Livraison à ${street}, ${city}, ${country}`);
    
    // Autre violation
    const discount = order.getCustomer().getMembership().getDiscountRate();
    const finalPrice = order.getTotalPrice() * (1 - discount);
    
    return finalPrice;
  }
}

// Problèmes de cette approche :
// 1. Si Address change sa structure, OrderService doit changer
// 2. Si Customer n'a pas d'Address, ça plante
// 3. Difficile à tester (il faut mocker Customer, Address, Membership...)
// 4. OrderService connaît trop de détails sur les autres objets
```

### Couplage excessif en Vue.js

```javascript
// ❌ Composant qui viole la Loi de Déméter
const UserProfile = {
  props: ['user'],
  template: `
    <div>
      <h1>{{ user.personalInfo.name.firstName }} {{ user.personalInfo.name.lastName }}</h1>
      <p>{{ user.contactInfo.address.street }}, {{ user.contactInfo.address.city }}</p>
      <p>Email: {{ user.contactInfo.email.primary }}</p>
      <p>Téléphone: {{ user.contactInfo.phone.mobile }}</p>
      <!-- Si la structure de user change, ce composant doit changer -->
    </div>
  `
};
```

## ✅ Respect de la Loi de Déméter

### Solution 1: Méthodes de délégation

```javascript
// ✅ Objets qui respectent la Loi de Déméter
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
  
  // Méthodes de délégation - Customer expose ce dont ses clients ont besoin
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
  
  // Méthodes qui exposent les données nécessaires
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
    // ✅ Maintenant on ne parle qu'à nos "amis immédiats"
    console.log(`Livraison à ${order.getDeliveryAddress()}`);
    const finalPrice = order.calculateFinalPrice();
    return finalPrice;
  }
}
```

### Solution 2: Objets de transfert de données (DTOs)

```javascript
// ✅ DTOs qui encapsulent les données nécessaires
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
  // ... propriétés existantes
  
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
    
    console.log(`Livraison pour ${delivery.customerName} à ${delivery.fullAddress}`);
    console.log(`Prix final: ${pricing.finalPrice}€ (remise: ${pricing.discountRate * 100}%)`);
    
    return pricing.finalPrice;
  }
}
```

## Loi de Déméter avec Vue.js

### Composants bien découplés

```javascript
// ✅ Props aplaties qui respectent la Loi de Déméter
const UserProfile = {
  props: {
    // Au lieu de passer l'objet user complet, on passe les données nécessaires
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
      <p>Téléphone: {{ phone }}</p>
    </div>
  `
};

// Composant parent qui prépare les données
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

### Composables qui respectent la Loi de Déméter

```javascript
// ✅ Composable qui encapsule la complexité
export function useUserData(userId) {
  const user = ref(null);
  const loading = ref(false);
  const error = ref(null);
  
  // Données préparées et aplaties
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

// Usage dans le composant
const UserComponent = {
  setup() {
    const { userProfile, loading, error, fetchUser } = useUserData(props.userId);
    
    onMounted(fetchUser);
    
    return {
      profile: userProfile, // Données aplaties et préparées
      loading,
      error
    };
  },
  template: `
    <div v-if="loading">Chargement...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="profile">
      <h1>{{ profile.displayName }}</h1>
      <p>{{ profile.email }}</p>
      <!-- Plus de navigation dans les objets ! -->
    </div>
  `
};
```

### Store Vuex/Pinia qui respecte la Loi de Déméter

```javascript
// ✅ Store avec getters qui respectent la Loi de Déméter
const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    currentUser: null
  }),
  
  getters: {
    // Getters qui exposent des données aplaties
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

## Cas pratiques d'application

### API et services

```javascript
// ❌ Service qui viole la Loi de Déméter
class NotificationService {
  sendOrderConfirmation(order) {
    const email = order.getCustomer().getContactInfo().getEmail();
    const name = order.getCustomer().getPersonalInfo().getName();
    const address = order.getCustomer().getAddress().getFormatted();
    // Trop de navigation !
  }
}

// ✅ Service qui respecte la Loi de Déméter
class NotificationService {
  sendOrderConfirmation(order) {
    const notification = order.getNotificationData();
    this.emailService.send({
      to: notification.customerEmail,
      subject: `Confirmation de commande ${order.getNumber()}`,
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

### Formulaires et validation

```javascript
// ✅ Composant de formulaire découplé
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
      // Le composant ne connaît pas la structure complexe de User
      this.$emit('submit', {
        street: this.form.street,
        city: this.form.city,
        postalCode: this.form.postalCode,
        country: this.form.country
      });
    }
  }
};

// Composant parent qui gère la complexité
const UserSettings = {
  methods: {
    handleAddressUpdate(addressData) {
      // Ici on peut faire la traduction vers notre modèle complexe
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

## Avantages de la Loi de Déméter

### 🔧 **Maintenance facilitée**
```javascript
// Si Address change sa structure interne, seule la classe Address doit changer
class Address {
  // Structure interne peut évoluer librement
  constructor(data) {
    this.streetInfo = { number: data.number, name: data.street };
    this.locationInfo = { city: data.city, zip: data.zip };
  }
  
  // Interface publique stable
  getFullAddress() {
    return `${this.streetInfo.number} ${this.streetInfo.name}, ${this.locationInfo.city}`;
  }
}
```

### 🧪 **Tests plus simples**
```javascript
// ✅ Test simple avec mocks minimaux
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
    // Pas besoin de mocker Customer, Address, Membership, etc.
  });
});
```

## ⚠️ Quand la Loi de Déméter peut être assouplie

### Objets de données simples
```javascript
// ✅ Acceptable pour des objets de données pures
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

// C'est OK car config est un objet de données, pas un objet métier
const apiUrl = config.api.baseUrl;
```

### Chaînes courtes et stables
```javascript
// ✅ Acceptable si la chaîne est courte et stable
const userName = user.profile.name; // OK si cette structure est stable
```

### Fluent APIs
```javascript
// ✅ Les APIs fluides sont une exception acceptable
const query = queryBuilder
  .select('name', 'email')
  .from('users')
  .where('active', true)
  .orderBy('name')
  .build();
```

## Techniques pour respecter la Loi de Déméter

### 1. **Méthodes de délégation**
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

### 2. **Interfaces de façade**
```javascript
class UserFacade {
  constructor(user) {
    this.user = user;
  }
  
  // Interface simplifiée qui cache la complexité
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

### 3. **Injection de dépendances**
```javascript
// Au lieu de naviguer pour trouver des services
class OrderProcessor {
  constructor(emailService, paymentService, inventoryService) {
    this.emailService = emailService;
    this.paymentService = paymentService;
    this.inventoryService = inventoryService;
  }
  
  process(order) {
    // Utilise directement les services injectés
    this.emailService.sendConfirmation(order.getNotificationData());
    // ...
  }
}
```

## Application avec TypeScript

### Types qui encouragent le découplage

```typescript
// ✅ Types qui définissent des interfaces claires
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
  // Méthodes qui retournent des types simples
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

### Generic constraints pour limiter l'accès

```typescript
// ✅ Contraintes génériques qui limitent l'exposition
interface Summarizable {
  getSummary(): object;
}

class ReportGenerator<T extends Summarizable> {
  generateReport(items: T[]): string {
    // Peut seulement utiliser getSummary(), pas accéder aux propriétés internes
    return items.map(item => item.getSummary()).join('\n');
  }
}
```

## Récapitulatif

### ✅ **La Loi de Déméter encourage :**
- **Encapsulation forte** - Les objets cachent leurs détails internes
- **Couplage faible** - Les objets dépendent de moins d'autres objets
- **Interfaces stables** - Les changements internes n'affectent pas les clients
- **Code plus testable** - Moins de dépendances à mocker

### ❌ **Éviter :**
- Les "train wrecks" (`obj.getProp().getOther().getValue()`)
- L'exposition des détails d'implémentation
- Les dépendances transitives
- Les chaînes d'appels fragiles

### 🎯 **Techniques pratiques :**
- **Délégation** - Exposer des méthodes qui cachent la complexité
- **DTOs/VOs** - Objets de transfert qui encapsulent les données
- **Façades** - Interfaces simplifiées pour des sous-systèmes complexes
- **Injection** - Fournir les dépendances plutôt que les chercher

---

> *La Loi de Déméter nous aide à créer des objets qui sont de bons citoyens dans notre système : ils respectent la vie privée des autres et exposent une interface claire et stable !*
