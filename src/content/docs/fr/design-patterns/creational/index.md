---
title: Design Pattern Creationnels
description: Modèles de conception pour la création d'objets.
---

Les **modèles de conception de création** offrent des mécanismes flexibles et réutilisables pour créer des objets. Ils aident à résoudre les problèmes liés à l'instanciation d'objets en masquant la logique de création et en permettant une plus grande flexibilité.

---

## Liste des Modèles de Création

| Modèle               | Description                                                                 | Cas d'utilisation                                                      |
|----------------------|-----------------------------------------------------------------------------|-------------------------------------------------------------------------|
| **Singleton**        | Garantit qu'une classe n'a qu'une seule instance.                         | Gestion des configurations, des logs ou des connexions à une base de données. |
| **Méthode de Fabrique** | Définit une interface pour créer des objets, mais laisse les sous-classes décider quelle classe instancier. | Frameworks ou bibliothèques où le code client ne connaît pas les classes concrètes. |
| **Fabrique Abstraite** | Fournit une interface pour créer des familles d'objets liés ou dépendants. | Systèmes nécessitant plusieurs familles d'objets interchangeables. |
| **Constructeur**     | Sépare la construction d'un objet complexe de sa représentation.          | Création d'objets avec de nombreux paramètres optionnels.               |
| **Prototype**        | Crée de nouveaux objets en copiant un prototype existant.                 | Éviter le surcoût de création d'objets similaires.                      |

---

## Quand utiliser les Modèles de Création ?

Utilisez les **modèles de création** lorsque :
- Vous avez besoin de contrôler le processus de création des objets.
- Vous souhaitez découpler le code client des classes concrètes.
- Vous devez gérer le cycle de vie des objets et leurs dépendances.