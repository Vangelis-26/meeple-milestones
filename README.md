# 🏰 Meeple & Milestones

> **Forgez votre légende, une partie après l'autre.**

**Meeple & Milestones** est une application web sophistiquée de suivi de collection et de progression pour les passionnés de jeux de société. Plus qu'un simple tracker, c'est un sanctuaire numérique qui transforme chaque partie en une étape vers un rang légendaire.

---

## 💎 Vision & Design

L'application adopte une esthétique "Grimoire Moderne", mêlant une typographie serif élégante à une interface minimaliste et réactive.

### Points forts du design :

- **Heroic Progression :** Un système de grades évolutif (de "Vagabond" à "Architecte du Destin") basé sur des illustrations PNG personnalisées.
- **Dashboard Analytique :** Visualisation des données de jeu via des graphiques complexes (Recharts).
- **Interface "Premium" :** Utilisation de textures subtiles, d'effets de verre dépoli (Glassmorphism) et d'animations fluides au survol.

---

## 🛠 Stack Technique

| Technologie      | Usage                                                     |
| :--------------- | :-------------------------------------------------------- |
| **React 18**     | Architecture composant et gestion d'état UI.              |
| **Tailwind CSS** | Design system sur-mesure et responsive.                   |
| **Supabase**     | Authentification sécurisée et base de données PostgreSQL. |
| **Recharts**     | Moteur de rendu des statistiques de progression.          |
| **BGG API**      | Intégration et parsing des données de BoardGameGeek.      |

---

## 🚀 Défis Techniques Relevés

### 1. Synchronisation avec BoardGameGeek (XML/JSON)

L'un des défis majeurs a été de consommer l'API de BoardGameGeek (BGG). J'ai implémenté une logique de parsing robuste pour transformer les flux XML de BGG en données JSON exploitables, permettant une récupération fluide des couvertures et des métadonnées des jeux.

### 2. Système de Progression Dynamique

Conception d'un algorithme mémorisé (`useMemo`) calculant en temps réel le niveau de l'utilisateur, son pourcentage de progression vers le rang suivant et l'attribution des icônes de rangs en fonction du volume de parties enregistrées.

### 3. Architecture "Private by Design"

Pour garantir la confidentialité des données, l'application est verrouillée par un système d'invitation strict via Supabase Auth. L'inscription publique est désactivée, faisant de chaque instance un espace privé et sécurisé.

---

## 🛡 Confidentialité & Sécurité

- **Accès Restreint :** Authentification obligatoire via liste d'invitation.
- **RGPD :** Option de suppression totale du compte et des données en un clic (Droit à l'oubli).
- **Visibilité :** Fichier `robots.txt` configuré pour interdire l'indexation par les moteurs de recherche.

---

## 📚 Crédits

- **Données :** Un immense merci à **BoardGameGeek** pour leur API inestimable.
- **Concept :** Meeple & Milestones est un projet indépendant créé par et pour des passionnés de jeux de plateau.

---

_Note : Le code source de ce projet est privé. Une démonstration vidéo ou un accès temporaire peut être fourni sur demande pour examen technique._
