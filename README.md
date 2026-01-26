# 🎲 Meeple & Milestones

> Transformez vos sessions de jeu en un véritable grimoire de légendes. Suivez le "Challenge 10x10" avec une interface Premium conçue pour les collectionneurs exigeants.

![Status](https://img.shields.io/badge/Status-Beta-orange)
![License](https://img.shields.io/badge/License-MIT-blue)
![Tech](https://img.shields.io/badge/Stack-React%20%7C%20Supabase%20%7C%20Tailwind-blueviolet)

## 🎯 L'Objectif

Ce projet fournit une interface "App-like" haut de gamme pour les joueurs de société souhaitant immortaliser leurs défis ludiques. Plus qu'un simple tracker, il s'agit d'une **Chronique de l'Aventurier** qui permet de :

1.  **Gérer son Challenge** : Constituer sa liste de 10 jeux via l'API BoardGameGeek.
2.  **Sceller ses Souvenirs** : Enregistrer chaque partie avec un niveau de détail "Premium" (durée, victoires, photos, notes narratives).
3.  **Analyser ses Performances** : Visualiser ses statistiques globales et l'historique de ses exploits à travers une timeline immersive.

## 🛠 Stack Technique

**Front-end :**

- ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white) **React 18** (Vite + Hooks personnalisés)
- ![Tailwind](https://img.shields.io/badge/-Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white) **Tailwind CSS v3** (Architecture Mobile First, Design "Gold Edition")
- **React Router v6** (Navigation fluide et routes protégées)

**Back-end & Services :**

- ![Supabase](https://img.shields.io/badge/-Supabase-3ECF8E?logo=supabase&logoColor=white) **Supabase** (PostgreSQL avec RLS, Auth sécurisée et Storage Cloud)
- **BoardGameGeek API** : Extraction intelligente des métadonnées mondiales.

## 🚀 Fonctionnalités "Gold Edition" Implémentées

### 📜 Grimoire des Statistiques (Nouvelle Dimension)

- [x] **Header Immersif** : Bannière dynamique centrée avec traitement visuel "Cinématique".
- [x] **Timeline Narrative** : Chronique des parties alternant entre cartouches de texte et souvenirs visuels.
- [x] **Design "Token" Premium** : Cartes de parties avec bordures latérales (12px) et inférieures (6px) en relief, simulant des tuiles de jeu physiques.
- [x] **Esquisses de l'Archiviste** : Placeholders stylisés (dessins à la plume) pour les souvenirs sans photo, préservant l'immersion ludique.
- [x] **Légendes Contextuelles** : Génération de textes "flavor text" adaptés aux résultats de la partie (Victoire/Défaite).
- [x] **Micro-interactions** : Effets de survol discrets simulant le soulèvement des tuiles de jeu.

### 🎲 Gestion du Challenge & Tracking

- [x] **Visualisation Gamifiée** : Grille de progression avec Meeples interactifs et verrouillage séquentiel.
- [x] **Tracking Précis** : Gestion complète (CRUD) des parties : dates, durées, notes de session et victoires.
- [x] **Photos Souvenirs** : Système d'upload multiple optimisé pour le Cloud.

### 📱 Excellence UI / UX

- [x] **Responsive Radical** : Interface optimisée pour une lecture "Grand Format" sur PC et une timeline verticale simplifiée à gauche sur mobile.
- [x] **Lisibilité Haute Définition** : Échelles typographiques ajustées pour un confort de lecture optimal sur tous les écrans.
- [x] **Atmosphère Chaleureuse** : Utilisation de textures papier et de tons "Stone" pour briser la froideur du numérique.

## 💻 Installation en local

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

Projet réalisé par **Vangelis** dans le cadre d'une montée en compétence sur l'écosystème React moderne et le Design d'Expérience (UX).
