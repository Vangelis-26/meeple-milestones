# 🎲 Meeple & Milestones

> Transformez vos sessions de jeu en un véritable grimoire de légendes. Suivez le "Challenge 10x10" avec une interface Premium conçue pour les collectionneurs exigeants.

![Status](https://img.shields.io/badge/Status-Beta-orange)
![License](https://img.shields.io/badge/License-MIT-blue)
![Tech](https://img.shields.io/badge/Stack-React%20%7C%20Supabase%20%7C%20Tailwind-blueviolet)

## 🎯 L'Objectif

Ce projet fournit une interface "App-like" haut de gamme pour les joueurs de société souhaitant immortaliser leurs défis ludiques. Plus qu'un simple tracker, il s'agit d'une **Chronique de l'Aventurier** qui permet de :

1.  **Gérer son Challenge** : Constituer sa liste de 10 jeux via l'API BoardGameGeek.
2.  **Sceller ses Souvenirs** : Enregistrer chaque partie avec un niveau de détail "Premium" (durée, victoires, photos, notes narratives).
3.  **Analyser ses Performances** : Visualiser ses statistiques globales au sein du **Sanctuaire** et suivre son ascension à travers un système de grades évolutifs.

## 🛠 Stack Technique

**Front-end :**

- ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white) **React 18** (Vite + Hooks personnalisés)
- ![Tailwind](https://img.shields.io/badge/-Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white) **Tailwind CSS v3** (Architecture Mobile First, Design "Gold Edition")
- **React Router v6** (Navigation fluide et routes protégées)
- **Recharts** : Visualisation de données pour le suivi de la maîtrise ludique.

**Back-end & Services :**

- ![Supabase](https://img.shields.io/badge/-Supabase-3ECF8E?logo=supabase&logoColor=white) **Supabase** (PostgreSQL avec RLS, Auth sécurisée et Storage Cloud)
- **BoardGameGeek API** : Extraction intelligente des métadonnées mondiales.

## 🚀 Fonctionnalités "Gold Edition" Implémentées

### 🏛 Le Sanctuaire des Statistiques (Nouveau)

- [x] **Système de Rangs "Plaisir"** : Progression gamifiée sur 11 niveaux, du _Vagabond des Plateaux_ à l' _Architecte du Destin_.
- [x] **Sceaux de Gloire** : Icônes SVG premium évolutives (Lanterne, Épée, Éclair divin) marquant les étapes clés du challenge.
- [x] **Suivi d'XP Premium** : Barre d'avancement avec affichage de pourcentage abstrait pour une immersion accrue.
- [x] **Analyse d'Activité** : Graphique "Rythme des Épopées" (ComposedChart) pour visualiser le volume de jeu mensuel et cumulé.
- [x] **KPI Dynamiques** : Calcul automatique du ratio de triomphe, du temps de jeu total et des paliers de gloire.

### 📜 Grimoire des Jeux & Timeline

- [x] **Header Cinématique** : Bannières dynamiques avec traitement visuel immersif.
- [x] **Timeline Narrative** : Chronique alternant souvenirs visuels et notes textuelles.
- [x] **Design "Token"** : Cartes simulant des tuiles de jeu physiques (relief 12px/6px).
- [x] **Légendes Contextuelles** : Génération automatique de "flavor text" adaptés aux résultats des parties.

### 🎲 Gestion du Challenge & UX

- [x] **Navigation Centralisée** : Navbar intelligente avec accès rapide au Dashboard, au Sanctuaire et aux Archives.
- [x] **Tracking Précis** : Gestion complète (CRUD) des parties avec upload de photos souvenirs optimisé.
- [x] **Responsive Radical** : Expérience fluide sur PC et mobile, avec menu latéral tactile pour les Archives.

## 🏆 Le Système de Progression

Le challenge n'est pas qu'une question de chiffres, c'est une ascension. Le système de progression est conçu pour récompenser la régularité sans devenir punitif :

| Grade       | Titre                  | Seuil (Parties)          |
| :---------- | :--------------------- | :----------------------- |
| **Rank 1**  | Vagabond des Plateaux  | 0                        |
| **Rank 5**  | Gardien des Savoirs    | 45                       |
| **Rank 10** | **Maître de l'Olympe** | **100 (Objectif Final)** |
| **Rank 11** | Architecte du Destin   | 110+                     |

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
    Créez un fichier `.env.local` à la racine :

    ```env
    VITE_SUPABASE_URL=votre_url_supabase
    VITE_SUPABASE_ANON_KEY=votre_cle_anon
    ```

4.  **Lancer le projet**
    ```bash
    npm run dev
    ```

## 👤 Auteur

Projet réalisé par **Vangelis** dans le cadre d'une montée en compétence sur l'écosystème React moderne et le Design d'Expérience (UX) appliqué au monde ludique.
