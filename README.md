# 🎲 Meeple & Milestones (Gold Edition)

> **"Transformez vos sessions de jeu en un véritable grimoire de légendes."**
>
> Une application "Premium" conçue pour les ludistes exigeants souhaitant immortaliser leur **Challenge 10x10**. Plus qu'un simple tracker, c'est une chronique visuelle et narrative de votre parcours.

![Status](https://img.shields.io/badge/Status-Production_Ready-amber)
![License](https://img.shields.io/badge/License-MIT-stone)
![Stack](https://img.shields.io/badge/Stack-React_18_%7C_Supabase_%7C_Tailwind-blueviolet)

---

## 🏛️ La Philosophie du Projet

Ce projet n'est pas un tableau Excel déguisé. C'est une **expérience utilisateur (UX)** soignée, inspirée des interfaces de luxe et des carnets de voyage anciens.

L'objectif est triple :

1.  **Gérer** : Un "Cockpit" (Dashboard) fluide pour piloter son challenge 10x10.
2.  **Narrer** : Chaque partie est une histoire (Notes, Photos, Victoire/Défaite).
3.  **Célébrer** : Un "Sanctuaire" statistique qui gamifie la progression du joueur.

---

## 💎 Fonctionnalités Clés

### 1. Le Grimoire (Gestion des Jeux)

- **Intégration BoardGameGeek (BGG)** : Recherche instantanée et import automatique des métadonnées (Images, Complexité, Année).
- **Cartes "Tuiles 3D"** : Design unique des cartes de jeux avec effet de relief et ombres portées dynamiques.
- **Modales Immersives** : Fiches de détails avec effets de flou (backdrop-blur), jauges de complexité colorées et navigation fluide.

### 2. Chroniques & Souvenirs (Tracking)

- **Système de Preuve** : Upload de photos (jusqu'à 3 par partie) stockées sur **Supabase Storage**.
- **Timeline Narrative** : Affichage des parties sous forme de fil temporel avec distinction visuelle "Glorieuse Victoire" (Or) vs "Lamentable Défaite" (Pierre).
- **Édition Complète** : Possibilité de modifier ou supprimer une entrée passée via l'historique.

### 3. Le Sanctuaire (Statistiques & Gamification)

- **Système de Rangs RPG** : Progression sur 11 niveaux, du _Vagabond_ à l' _Architecte du Destin_.
- **Visualisation de Données** : Graphiques (Recharts) pour l'activité mensuelle et jauges circulaires pour les taux de succès.
- **KPIs Dynamiques** : Calcul en temps réel du temps de jeu total ("Heures Perdues") et du ratio de triomphe.

### 4. Architecture Réactive (UX)

- **Navigation Intelligente** : Menu "Mes Archives" avec prévisualisation des miniatures et barres de progression dorées.
- **Hot Reload (Event-Driven)** : Synchronisation instantanée entre le Dashboard et la Navbar sans rechargement de page (via `CustomEvent`).
- **Mobile First** : Interface totalement adaptative, du grand écran au smartphone.

---

## 🛠 Stack Technique

### Front-end

- **React 18** (Vite) : Performance et modernité.
- **Tailwind CSS v3** : Design System personnalisé (Palette Stone/Amber, ombres complexes, typographie Serif).
- **Recharts** : Librairie de graphiques pour le Sanctuaire.
- **React Router DOM** : Gestion des routes et modales contextuelles.

### Back-end & Services (Supabase)

- **Database (PostgreSQL)** : Modèle relationnel robuste (`games`, `plays`, `challenges`).
- **Authentication** : Gestion sécurisée des utilisateurs.
- **Storage** : Bucket `game-memories` pour le stockage des photos de parties.
- **Row Level Security (RLS)** : Sécurité des données au niveau de la ligne (chaque joueur ne voit que ses données).
- **Realtime** : Configuration via `REPLICA IDENTITY FULL` pour la synchronisation.

---

## 🏆 Système de Progression

Le challenge est rythmé par l'obtention de titres honorifiques basés sur le nombre total de parties jouées :

| Niveau  | Titre                   | Parties Requises | Icône |
| :------ | :---------------------- | :--------------- | :---- |
| **1**   | Vagabond des Plateaux   | 0+               | 🥾    |
| **2**   | Aventurier Novice       | 5+               | 🎒    |
| **3**   | Chasseur de Reliques    | 15+              | 🔍    |
| **4**   | Stratège Reconnu        | 30+              | 📜    |
| **5**   | **Gardien des Savoirs** | **50+**          | 🕯️    |
| **...** | ...                     | ...              | ...   |
| **10**  | **Maître de l'Olympe**  | **100**          | ⚡    |
| **11**  | Architecte du Destin    | 110+             | 🌌    |

---

## 💾 Structure de la Base de Données

Le projet repose sur 4 tables principales :

1.  `games` : Référentiel unique des jeux (données BGG). Partagé mais unique par BGG ID.
2.  `challenges` : Table de liaison utilisateur/année.
3.  `challenge_items` : Les jeux spécifiques suivis par un utilisateur (avec progression et couleur de meeple).
4.  `plays` : Historique des parties (Date, Durée, Victoire, Notes, URLs Images).

---

## 💻 Installation en local

1.  **Cloner le dépôt**

    ```bash
    git clone [https://github.com/Vangelis-26/meeple-milestones.git](https://github.com/Vangelis-26/meeple-milestones.git)
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

---

## 👤 Auteur

**Vangelis** - _Architecte du Destin_
Projet réalisé avec passion pour la communauté ludique.

> _"Le silence est d'or, mais une victoire écrite est éternelle."_
