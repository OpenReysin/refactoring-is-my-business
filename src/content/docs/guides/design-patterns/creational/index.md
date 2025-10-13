---
title: Overview
description: Design Patterns for object creation.
---

**Creational Design Patterns** provide flexible and reusable mechanisms for creating objects. They help solve problems related to object instantiation by hiding creation logic and enabling greater flexibility.

---

## List of Creational Patterns

| Pattern            | Description                                                                 | Use Cases                                                                 |
|--------------------|-----------------------------------------------------------------------------|---------------------------------------------------------------------------|
| **Singleton**      | Ensures a class has only one instance.                                    | Managing configurations, logs, or database connections.                  |
| **Factory Method** | Defines an interface for creating objects but lets subclasses decide which class to instantiate. | Frameworks or libraries where client code doesn’t know concrete classes. |
| **Abstract Factory** | Provides an interface for creating families of related or dependent objects. | Systems requiring multiple interchangeable object families.          |
| **Builder**        | Separates the construction of a complex object from its representation.    | Creating objects with many optional parameters.                          |
| **Prototype**      | Creates new objects by copying an existing prototype.                      | Avoiding the overhead of creating similar objects.                       |

---

## When to Use Creational Patterns?

Use **Creational Patterns** when:
- You need to control the object creation process.
- You want to decouple client code from concrete classes.
- You need to manage object lifecycle and dependencies.
