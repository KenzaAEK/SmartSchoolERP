# SGAI 2.0 - Système de Gestion Académique Intégré (Optimisé par l'IA)

**SGAI 2.0** est une plateforme ERP scolaire complète destinée aux établissements d'enseignement supérieur. Contrairement aux solutions classiques, elle intègre nativement des modules d'Intelligence Artificielle pour l'aide à la décision, l'optimisation des ressources et la recommandation pédagogique.

Ce projet a été réalisé dans le cadre du Projet Libre de 3ème année à l'**ENSA Tanger** (Département Génie Informatique).

## 🚀 Fonctionnalités Principales

Le système combine une gestion administrative robuste avec des micro-services d'IA.

### 🧠 Modules d'Intelligence Artificielle
*   **Recommandation de Parcours (KNN) :** Système d'orientation suggérant les filières les plus adaptées aux étudiants via un algorithme de filtrage collaboratif (précision > 76%).
*   **Optimisation des Emplois du Temps :** Génération automatique de plannings sans conflits utilisant des Algorithmes Génétiques (bibliothèque DEAP).
*   **Dashboard Prédictif :** Analyse des risques d'échec et prévision des tendances de réussite.

### 🎓 Gestion Académique (Core)
*   **Administration :** Gestion de la structure (années, filières, classes), import massif d'étudiants (CSV), automatisation des délibérations.
*   **Espace Enseignant :** Saisie des notes, gestion de l'assiduité (appel numérique), diagnostic pédagogique de la classe.
*   **Espace Étudiant :** Consultation des notes en temps réel, téléchargement de bulletins PDF, suivi de l'assiduité, recommandations d'orientation.
*   **Sécurité :** Authentification multi-rôles (RBAC) et chiffrement des données.

## 🛠 Stack Technologique

Le projet repose sur une architecture **hybride N-Tiers** et **Micro-services**.

| Catégorie | Technologies |
|-----------|--------------|
| **Backend Métier** | Java 17, Spring Boot 3.2, Spring Security, Spring Data JPA |
| **Micro-services IA** | Python 3.9, Flask, Scikit-learn, DEAP (Genetic Algo) |
| **Base de Données** | PostgreSQL 15 |
| **Frontend** | Thymeleaf, Bootstrap 5, Chart.js |
| **DevOps** | Docker, Docker Compose, GitHub Actions (CI/CD) |
| **Outils** | Maven, Git, JUnit 5 |

## 📂 Structure du Projet

```text
sgai-project/
├── src/main/java/       # Backend Spring Boot (Monolithe modulaire)
│   ├── controllers/     # Gestion HTTP & Vues
│   ├── services/        # Logique Métier & Intégration IA
│   ├── repositories/    # Accès Données (JPA)
│   ├── entities/        # Modèle de données
│   └── security/        # Config Spring Security (RBAC)
├── ai-services/         # Micro-services Python
│   ├── recommendation/  # Service Flask (KNN)
│   └── schedule-optimizer/ # Service Flask (Algorithme Génétique)
├── docker-compose.yml   # Orchestration des conteneurs
├── Dockerfile           # Image Spring Boot
└── pom.xml              # Dépendances Maven
```

## 🐳 Installation et Démarrage

Le projet est entièrement "dockerisé" pour un déploiement rapide.

### Prérequis
*   Docker & Docker Compose
*   Git

### Lancement
1. **Cloner le repository :**
   ```bash
   git clone https://github.com/KenzaAEK/SmartSchoolERP.git
   cd SmartSchoolERP
   ```

2. **Démarrer les services (Backend + BD + Services IA) :**
   ```bash
   docker-compose up --build -d
   ```

3. **Accéder à l'application :**
   *   Application Web : `http://localhost:8080`
   *   API Recommandation : `http://localhost:5000`
   *   API Optimisation : `http://localhost:5001`

### Comptes de Démonstration

| Rôle | Nom d'utilisateur | Mot de passe |
|------|-------------------|--------------|
| **Administrateur** | `admin` | `admin123` |
| **Enseignant** | `teacher1` | `teacher123` |
| **Étudiant** | `student1` | `student123` |

## 👥 L'Équipe (Groupe 2)

*   **SYLLA N’Faly** : Développement Backend & Frontend
*   **ARIB Aymane** : Base de Données & Architecture
*   **ABOU-EL KASEM Kenza** : Intelligence Artificielle
*   **EL BAKALI Malak** : Dockerisation & CI/CD

**Encadré par :** Pr. BADIR Hassan

---
© 2026 ENSA Tanger - Département Génie Informatique
```
