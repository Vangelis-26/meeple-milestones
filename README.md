# 🎲 Meeple & Milestones

> **"Transformez vos sessions de jeu en un véritable grimoire de légendes."**
>
> Une expérience numérique immersive conçue pour les ludistes souhaitant immortaliser leur **Challenge 10x10**. Plus qu'un simple tracker, c'est une chronique visuelle et narrative qui donne du poids à chaque victoire et documente chaque défaite.

![Status](https://img.shields.io/badge/Status-Production_Ready-amber)
![License](https://img.shields.io/badge/License-MIT-stone)
![Stack](https://img.shields.io/badge/Stack-React_18_%7C_Supabase_%7C_Tailwind-blueviolet)

---

## 🏛️ La Philosophie du Projet

Ce projet refuse l'austérité des tableaux de bord classiques. Il a été pensé comme un **carnet de voyage ludique**, où l'interface s'efface devant le récit de vos parties. L'esthétique repose sur une palette **Stone & Amber**, des typographies Serif élégantes et des effets de profondeur simulant le toucher du papier et du cuir.

L'objectif est triple :

1.  **Gérer** : Un Dashboard fluide pour piloter son challenge 10x10.
2.  **Narrer** : Chaque partie est une histoire (Notes, Photos, Récits).
3.  **Célébrer** : Un "Sanctuaire" statistique qui transforme la progression en héritage.

---

## 💎 Fonctionnalités Clés

### 📖 Chroniques & Souvenirs (Tracking)

- **Le Sceau du Destin** : Chaque partie est enregistrée avec un feedback visuel fort. Victoire éclatante (Ambre) ou Défaite amère (Pierre).
- **Épreuves par l'Image** : Système de preuve avec upload de photos (max 3 par partie) stockées via **Supabase Storage**.
- **Timeline "Scrapbook"** : Vos parties s'affichent sous forme de Polaroïds et de cartes narratives, créant un véritable historique organique.

### 🛡️ Le Sanctuaire (Gamification)

- **Système de Rangs RPG** : Votre ascension est rythmée par 11 niveaux honorifiques, du _Vagabond_ à l'_Architecte du Destin_.
- **KPIs Cinématiques** : Suivi du taux de victoire, calcul des "Heures Perdues" (temps de jeu total) et jauges de challenge circulaires.

### 🔍 Bibliothèque & Immersion

- **Connexion BGG** : Recherche et import automatique des métadonnées BoardGameGeek (Images, complexité, âge).
- **Interface Réactive** : Menu "Mes Archives" avec prévisualisation des miniatures et synchronisation instantanée via `CustomEvents`.
- **Design "Tuiles 3D"** : Cartes de jeux avec effets de relief et ombres portées dynamiques.

---

## 🛠 Stack Technique

- **Front-end** : React 18 (Vite), Tailwind CSS v3, Recharts (Graphiques), React Router DOM.
- **Back-end & Services** : **Supabase** (Database PostgreSQL, Auth, Storage).
- **Sécurité** : **Row Level Security (RLS)** pour une isolation stricte des données par utilisateur.

---

## 🌳 Workflow de Développement

Pour maintenir l'intégrité du **Grimoire**, nous suivons une méthodologie de branchement (Feature Branching) stricte :

1.  **`main`** : La source de vérité absolue. Elle doit **toujours** être fonctionnelle et prête pour la production.
2.  **Branches de tâches** : Pour chaque nouvelle fonctionnalité ou correction, créer une branche `feat/nom-de-la-tache`.
3.  **Processus de validation** :
    - Coder et committer sur la branche `feat/`.
    - Pusher la branche sur le dépôt distant.
    - Créer une **Pull Request (PR)** sur GitHub de `feat/...` vers `main`.
    - Fusionner (Merge) une fois la tâche validée.

---

## 🏆 Système de Progression (Rangs)

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

Le projet repose sur 4 tables principales dans **Supabase** :

1.  **`games`** : Référentiel unique des jeux (données BGG). Partagé mais unique par BGG ID.
2.  **`challenges`** : Table de liaison utilisateur / année.
3.  **`challenge_items`** : Les jeux spécifiques suivis par un utilisateur (avec progression et couleur de meeple).
4.  **`plays`** : Historique des parties (Date, Durée, Victoire, Notes, URLs Images).

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

**Vangelis** — _Architecte du Destin_ Projet réalisé avec passion pour la communauté ludique.

> _"Le silence est d'or, mais une victoire écrite est éternelle."_
