# 🎲 Meeple & Milestones

> Une application moderne pour suivre le "Challenge 10x10" (10 parties de 10 jeux différents) et visualiser sa progression ludique.

![Status](https://img.shields.io/badge/Status-In%20Development-yellow)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🎯 L'Objectif

Ce projet a pour but de fournir une interface fluide et agréable pour les joueurs de société souhaitant tracker leurs défis annuels. Il sert également de "Sandbox" technique pour implémenter une architecture React robuste et scalable.

## 🛠 Stack Technique

**Front-end :**

- ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white) **React 18** (via Vite)
- ![Tailwind](https://img.shields.io/badge/-Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white) **Tailwind CSS v3** (Mobile First)
- **React Router v6** (Data APIs)

**Back-end & Services :**

- ![Supabase](https://img.shields.io/badge/-Supabase-3ECF8E?logo=supabase&logoColor=white) **Supabase** (Auth, Database PostgreSQL)
- **BoardGameGeek API** (Data Source XML)

## 🚀 Fonctionnalités (Roadmap)

- [x] **Initialisation** : Architecture dossier "Feature-based", Configuration Vite/Tailwind.
- [x] **Authentification** : Inscription/Connexion via Supabase Auth + Routes protégées.
- [ ] **Gestion des Challenges** : Créer un défi 10x10 pour l'année en cours.
- [ ] **Base de Données Jeux** : Recherche et import depuis l'API BoardGameGeek.
- [ ] **Tracking** : Enregistrement des parties (Date, Joueurs, Scores, Photos).
- [ ] **Dashboard** : Visualisation de la progression (Barres, Pourcentages).

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
    Créez un fichier `.env.local` à la racine et renseignez vos clés Supabase :

    ```env
    VITE_SUPABASE_URL=votre_url_supabase
    VITE_SUPABASE_ANON_KEY=votre_cle_anon
    ```

4.  **Lancer le serveur de développement**
    ```bash
    npm run dev
    ```

## 👤 Auteur

Projet réalisé par **[Vangelis]** dans le cadre d'une remise à niveau technique avancée (Architecture React, State Management, API Integration).
