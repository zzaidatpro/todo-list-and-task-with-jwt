# 🧪 Projet = todo persons mongodb Atlas avec express react redux
# Stratégie de Test - Todo App (React / Redux / Vite)

Ce projet intègre un pipeline de tests complet couvrant la pyramide de tests à trois niveaux : **Unitaires**, **Intégration** et **End-to-End (E2E)**.

---

## 📐 Architecture des Tests

```text
├── src/
│   ├── redux/
│   │   └── taskSlice.test.js      # 🧪 Tests Unitaires (Actions & Reducers Redux Toolkit)
│   ├── tests/
│   │   └── integration/
│   │       └── AppIntegration.test.jsx # 🧩 Tests d'Intégration (Composants React + Store)
│   └── setupTests.js              # ⚙️ Mocks globaux (window.matchMedia, jest-dom)
├── e2e/
│   └── todo.spec.js               # 🌐 Tests End-to-End (Navigateur Chromium via Playwright)
└── run-tests.js                   # 🚀 Script CLI pour exécuter les suites de tests

🛠️ Technologies UtiliséesType de TestOutils PrincipauxDescription / RôleUnitairesVitestValidation isolée de la logique Redux Toolkit (taskSlice).IntégrationVitest + React Testing Library + jsdomSimulation des interactions composants React avec le Redux Store dans un DOM virtuel.End-to-End (E2E)PlaywrightScénario réel dans un navigateur (Chromium) connecté au serveur local Vite (http://localhost:5173).🚀 Exécution des TestsUn script CLI sur mesure (run-tests.js) permet d'exécuter chaque suite indépendamment ou de lancer le pipeline global.1. Lancer l'ensemble de la suite (Pipeline Complet)Exécute séquentiellement les tests unitaires, d'intégration et E2E :PowerShellnode run-tests.js all
# ou simplement
node run-tests.js
2. Lancer les Tests Unitaires uniquementPowerShellnode run-tests.js unit
3. Lancer les Tests d'Intégration uniquementPowerShellnode run-tests.js integration
4. Lancer les Tests E2E (Playwright)PowerShellnode run-tests.js e2e
⚙️ Détails des Configurations ParticulièresMocks de l'environnement DOM (src/setupTests.js) :Un mock global de window.matchMedia est configuré pour éviter les erreurs TypeError: window.matchMedia is not a function générées par les composants d'interface (comme la gestion du thème clair/sombre).Séparation Vitest / Playwright (playwright.config.js) :Playwright est configuré avec testDir: './e2e' et ignore le dossier src/ afin d'éviter tout conflit d'analyse syntaxique avec le CSS Tailwind v4 ou les dépendances de modules Vitest.Serveur de développement automatique :Playwright démarre et gère automatiquement le serveur Vite (npm run dev) si celui-ci n'est pas déjà actif lors du lancement des tests E2E.📝 Commandes npm équivalentesSi vous préférez utiliser npm scripts :Bashnpm test                 # Lance Vitest en mode Watch
npx vitest run           # Lance tous les tests Vitest une seule fois
npx playwright test e2e  # Lance la suite Playwright E2E

<ElicitationsGroup message="Souhaitez-vous aller plus loin sur la gestion de vos tests ?">
  <Elicitation label="Ajouter un badge de statut de test au README" query="Peux-tu m'aider à ajouter des badges GitHub Actions de statut de test dans le README.md ?"/>
  <Elicitation label="Configurer un workflow GitHub Actions (CI/CD)" query="Comment configurer un fichier .github/workflows/tests.yml pour exécuter node run-tests.js all à chaque commit ?"/>
</ElicitationsGroup>


# 🚀 MERN Stack Application - Checkpoint GoMyCode

Application web full-stack développée dans le cadre du checkpoint **GoMyCode** (Session **Green Forest**), mettant en œuvre une architecture **MERN** (MongoDB, Express, React, Node.js) avec une gestion avancée des données via **Mongoose** et une interface utilisateur moderne conçue avec **Tailwind CSS**.

---

## 📋 Table des matières
- [Fonctionnalités principales](#-fonctionnalités-principales)
- [Architecture & Stack Technique](#-architecture--stack-technique)
- [Routes Backend (API Mongoose)](#-routes-backend-api-mongoose)
- [Interface Utilisateur & Fonctionnalités UI](#-interface-utilisateur--fonctionnalités-ui)
- [Installation & Démarrage](#-installation--démarrage)

---

## 🌟 Fonctionnalités principales

- **Gestion des profils (CRUD complet) :** Création, lecture, mise à jour (via ID ou nom) et suppression de documents (individuelle ou en masse).
- **Opérations Avancées Mongoose :** Utilisation de requêtes chaînées (`find`, `sort`, `limit`, `select`), de méthodes de mise à jour atomiques (`findOneAndUpdate`) et de suppression conditionnelle (`deleteMany`).
- **Expérience Utilisateur (UI/UX) interactive :** 
  - Panneau de test de l'API intégré directement dans l'interface.
  - Mode d'édition dynamique : un clic sur un profil de la liste le recharge instantanément dans le formulaire pour modification (basculement fluide entre POST et PUT).
  - Visualiseur de résultats d'API intelligent (affichage structuré des données, des erreurs ou des compteurs de suppression).
- **Design moderne & Mode Sombre :** Interface épurée, responsive, supportant le mode sombre (Dark Mode) avec Tailwind CSS.

---

## 🛠 Architecture & Stack Technique

- **Frontend :** 
  - React (avec Hooks `useState`, `useEffect`)
  - Tailwind CSS (pour un design moderne et responsive)
- **Backend :** 
  - Node.js & Express.js (API REST)
- **Base de données :** 
  - MongoDB & Mongoose (Modélisation des données avec un schéma enrichi incluant nom, prénom, âge, date de naissance, email, adresse, hobbies et plats favoris).

---

## 🔌 Routes Backend (API Mongoose)

L'API REST expose les endpoints suivants pour interagir avec la base de données :

1. **`POST /api/persons`** : Enregistrer une nouvelle personne.
2. **`GET /api/persons`** : Récupérer la liste complète des profils.
3. **`GET /api/persons/food/:food`** : Trouver toutes les personnes aimant un plat spécifique.
4. **`GET /api/persons/:id`** : Trouver une personne par son identifiant unique (`_id`).
5. **`PUT /api/persons/:id`** : Mettre à jour les informations d'un profil par son ID.
6. **`PUT /api/persons/update-age/:name`** : Mettre à jour l'âge d'une personne à 20 ans en recherchant par son nom.
7. **`DELETE /api/persons/remove-by-id/:id`** : Supprimer une personne par son ID (`findByIdAndDelete`).
8. **`DELETE /api/persons/remove-mary`** : Supprimer toutes les personnes prénommées "Mary" (`deleteMany`).
9. **`GET /api/persons/search/burritos`** : Requête chaînée avancée (Recherche des fans de burritos, triés par nom, limités à 2 résultats, en masquant le champ de l'âge).

---

## 💻 Interface Utilisateur & Panneau de Test

L'application intègre un panneau de diagnostic et de test permettant de simuler et de valider visuellement chaque route de l'API en un clic :
- Affichage dynamique de la liste des profils enregistrés en base.
- Boutons dédiés pour chaque opération spécifique (ex: fixer l'âge à 20 ans, supprimer les "Mary", rechercher les burritos).
- Visionneuse de résultats claire et formatée.

---

## ⚙️ Installation & Démarrage

1. **Cloner le projet**
   ```bash
   git clone <url-du-repo>
   cd <nom-du-projet>

   Configurer le Backend

Se placer dans le dossier backend, installer les dépendances et configurer votre fichier .env (URI MongoDB, Port 5000).

Bash
npm install
npm run dev
Configurer le Frontend

Se placer dans le dossier client/frontend, installer les dépendances et lancer l'application React.

Bash
npm install
npm run dev


todo-mongo/
├── index.html                 # Point d'entrée HTML de l'application React
├── package.json               # Dépendances et scripts du Frontend
├── vite.config.js             # Configuration du bundler Vite
├── server/                    # 🟢 Partie Backend (Node.js & Express)
│   ├── models/                # Schémas Mongoose pour MongoDB
│   │   ├── Todo.js            # Modèle pour la gestion des tâches
│   │   └── persons.js         # Modèle pour la gestion des profils (Personnes)
│   ├── .env                   # Variables d'environnement (URI MongoDB, Port)
│   ├── package.json           # Dépendances du Backend (express, mongoose, etc.)
│   └── server.js              # Point d'entrée du serveur Express et routes API
└── src/                       # 🔵 Partie Frontend (React & Redux)
    ├── component/             # Composants d'interface utilisateur (UI)
    │   ├── AddTask.jsx        # Formulaire d'ajout / modification de tâches ou profils
    │   ├── ListTask.jsx       # Composant d'affichage de la liste
    │   ├── Task.jsx           # Composant pour une tâche ou un profil individuel
    │   ├── ThemeToggle.jsx    # Bascule entre le mode clair et le mode sombre
    │   └── footer.jsx         # Pied de page discret (GoMyCode - Green Forest - 2026)
    ├── redux/                 # Gestion d'état global
    │   ├── store.js           # Configuration du store Redux
    │   ├── taskSlice.js       # Actions et reducers pour les tâches
    │   └── taskSlice.test.js  # Tests unitaires du slice Redux
    ├── App.css                # Styles spécifiques à l'application
    ├── App.jsx                # Composant racine principal (assemble les vues et tests API)
    ├── index.css              # Styles globaux (Tailwind CSS)
    └── main.jsx               # Point d'entrée de l'application React

Détail des dossiers clés
1. Le Serveur (/server) — Le Backend
server.js : Le cœur de l'API REST. Il initialise Express, gère les connexions CORS, connecte MongoDB via Mongoose et orchestre toutes les routes (gestion des tâches et des profils avec les opérations Mongoose chaînées, suppressions et mises à jour).

models/ : Contient les définitions de schémas de données (Todo.js et persons.js) qui structurent les documents enregistrés dans la base de données MongoDB.

.env : Stocke en toute sécurité les informations sensibles (URL de connexion MongoDB Atlas/Locale, port du serveur).

2. Le Code Source Frontend (/src) — L'Interface Utilisateur
component/ :

Contient les briques visuelles modulaires de l'application.

On y retrouve la logique d'interaction (formulaires, listes, panneaux de test de l'API) ainsi que les composants utilitaires comme le ThemeToggle (gestion du mode sombre) et le footer.jsx.

redux/ :

Gère l'état global de l'application front-end de manière prévisible.

Le fichier taskSlice.js centralise les actions et la logique métier liée aux tâches, accompagné de ses tests unitaires (taskSlice.test.js).

App.jsx : Le chef d'orchestre de l'interface. Il assemble la navigation, le panneau de diagnostic/test des routes de l'API Mongoose, et intègre les composants d'affichage et le pied de page.