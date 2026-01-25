# 🎲 Meeple & Milestones

> Une application moderne pour suivre le "Challenge 10x10" (10 parties de 10 jeux différents) et visualiser sa progression ludique.

![Status](https://img.shields.io/badge/Status-Beta-orange)
![License](https://img.shields.io/badge/License-MIT-blue)
![Tech](https://img.shields.io/badge/Stack-React%20%7C%20Supabase%20%7C%20Tailwind-blueviolet)

## 🎯 L'Objectif

Ce projet a pour but de fournir une interface fluide et agréable ("App-like") pour les joueurs de société souhaitant tracker leurs défis annuels. Il permet de :

1. Constituer sa liste de 10 jeux (via l'API BoardGameGeek).
2. Enregistrer ses parties avec détails (durée, victoire, photos, notes).
3. Visualiser sa progression via une interface gamifiée (Meeples interactifs).

Il sert également de "Sandbox" technique pour implémenter une architecture React robuste, scalable et sécurisée.

## 🛠 Stack Technique

**Front-end :**

- ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white) **React 18** (Vite + Hooks personnalisés)
- ![Tailwind](https://img.shields.io/badge/-Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white) **Tailwind CSS v3** (Mobile First, Animations)
- **React Router v6** (Gestion des routes protégées)

**Back-end & Services :**

- ![Supabase](https://img.shields.io/badge/-Supabase-3ECF8E?logo=supabase&logoColor=white) **Supabase** :
  - **Auth** : Gestion utilisateurs et sessions.
  - **Database** : PostgreSQL avec Row Level Security (RLS) pour la confidentialité des données.
  - **Storage** : Stockage cloud des photos souvenirs ("Buckets").
- **BoardGameGeek API** : Récupération des métadonnées des jeux (XML to JSON).

## 🚀 Fonctionnalités Implémentées

### 🔐 Authentification & Sécurité

- [x] Inscription / Connexion email (Supabase Auth).
- [x] Protection des routes (Redirection intelligente si non connecté).
- [x] RLS (Row Level Security) : Chaque utilisateur ne voit et ne modifie que ses propres données.

### 🎲 Gestion du Challenge

- [x] **Recherche BGG** : Recherche instantanée dans la base de données mondiale des jeux.
- [x] **Attribution Intelligente** : Assignation automatique d'une couleur de Meeple unique par jeu.
- [x] **Visualisation** : Grille de progression interactive avec meeples remplissables.

### 📝 Tracking des Parties (CRUD Complet)

- [x] **Enregistrement** : Date, durée, victoire/défaite, notes.
- [x] **Photos Souvenirs** : Upload multiple (jusqu'à 3 photos) stockées dans le Cloud.
- [x] **Historique** : Liste détaillée des parties par jeu.
- [x] **Édition & Suppression** : Correction des erreurs et recalcul automatique de la progression.

### 📱 UI / UX

- [x] **Design Responsive** : Interface optimisée mobile et desktop.
- [x] **Feedback Utilisateur** : Modales animées, états de chargement (skeletons/spinners), toasts.
- [x] **Logique Séquentielle** : Guidage de l'utilisateur (impossible de valider le meeple 5 avant le 4).

## 💻 Installation en local

Si vous souhaitez tester le projet :

1.  **Cloner le dépôt**

    ```bash
    git clone [https://github.com/Vangelis-26/meeple-milestones](https://github.com/Vangelis-26/meeple-milestones)
    cd meeple-milestones
    ```

2.  **Installer les dépendances**

    ```bash
    npm install
    ```

3.  **Configuration d'environnement**
    Créez un fichier `.env.local` à la racine avec vos clés Supabase :

    ```env
    VITE_SUPABASE_URL=votre_url_supabase
    VITE_SUPABASE_ANON_KEY=votre_cle_anon
    ```

4.  **Lancer le serveur de développement**
    ```bash
    npm run dev
    ```

## 👤 Auteur

Projet réalisé par **[Vangelis]** dans le cadre d'une montée en compétence sur l'écosystème React moderne et le Backend-as-a-Service.
