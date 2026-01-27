// src/services/bgg.js (MOCK HYBRIDE : Vrais Noms/Images + Fausses Stats)

// 1. Tes données fixes (Vrais jeux connus)
const MOCK_RESULTS = [
   { bgg_id: '13', name: "Catan", year: '1995' },
   { bgg_id: '822', name: "Carcassonne", year: '2000' },
   { bgg_id: '30549', name: "Pandemic", year: '2008' },
   { bgg_id: '266192', name: "Wingspan", year: '2019' },
   { bgg_id: '167791', name: "Terraforming Mars", year: '2016' },
   { bgg_id: '174430', name: "Gloomhaven", year: '2017' },
   { bgg_id: '230802', name: "Azul", year: '2017' }
];

// 2. Tes images réelles (Mappées par ID)
const MOCK_IMAGES = {
   13: "https://cdn3.philibertnet.com/797512-thickbox_default/catane.jpg", // Catan (Style Catan)
   30549: "https://cdn3.philibertnet.com/523831-thickbox_default/pandemie.jpg", // Pandemic (Virus/Carte)
   266192: "https://cdn3.philibertnet.com/430895-thickbox_default/wingspan.jpg", // Wingspan (Oiseau)
   230802: "https://cdn2.philibertnet.com/402193-thickbox_default/azul.jpg", // Azul (Mosaique)
   822: "https://cdn2.philibertnet.com/542823-thickbox_default/carcassonne-vf.jpg", // Carcassonne (Chateau)
   167791: "https://cdn1.philibertnet.com/450870-thickbox_default/terraforming-mars.jpg", // Terraforming Mars (Planete)
   174430: "https://cdn1.philibertnet.com/467870-thickbox_default/gloomhaven.jpg" // Gloomhaven (Aventure)
};

// 3. Recherche (Filtre dans ta liste ou renvoie tout si vide)
export const searchGames = async (query) => {
   console.log(`[MOCK] Recherche dans la liste prédéfinie: "${query}"`);
   await new Promise(resolve => setTimeout(resolve, 300));

   if (!query) return [];

   // Filtre les jeux qui contiennent la recherche (insensible à la casse)
   const results = MOCK_RESULTS.filter(g =>
      g.name.toLowerCase().includes(query.toLowerCase())
   );

   // Si on trouve rien, on renvoie une liste par défaut pour pas bloquer l'utilisateur
   return results.length > 0 ? results : MOCK_RESULTS;
};

// 4. Détails (Mélange Vraie Image + Fausses Stats)
export const getGameDetails = async (bggId) => {
   console.log(`[MOCK] Récupération détails ID: ${bggId}`);
   await new Promise(resolve => setTimeout(resolve, 400));

   // Récupération de l'image réelle ou fallback
   const realImage = MOCK_IMAGES[bggId] || 'https://images.unsplash.com/photo-1632501641765-e568d9088bed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';

   // On retrouve le nom et l'année dans notre liste
   const gameInfo = MOCK_RESULTS.find(g => g.bgg_id === bggId) || { name: "Jeu Inconnu", year: 2024 };

   const isComplex = Math.random() > 0.5;

   return {
      bgg_id: bggId,
      name: gameInfo.name,
      thumbnail_url: realImage, // On utilise la même image pour le thumbnail
      image_url: realImage,     // Et pour la HD

      // Description générique mais adaptée
      description: `Découvrez ${gameInfo.name}, un classique du jeu de société sorti en ${gameInfo.year}. Dans ce jeu captivant, vous devrez faire preuve de stratégie pour l'emporter. Idéal pour vos soirées entre amis ou en famille.`,

      // Stats générées aléatoirement pour le test
      year_published: parseInt(gameInfo.year),
      min_age: isComplex ? 14 : 8,
      playing_time: isComplex ? 120 : 45,
      rating: (7 + Math.random() * 2).toFixed(1), // Note entre 7.0 et 9.0 (ce sont de bons jeux !)
      complexity: (1.5 + Math.random() * 3).toFixed(2)
   };
};
