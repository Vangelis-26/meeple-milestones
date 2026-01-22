const BGG_API_URL = "https://www.boardgamegeek.com/xmlapi2";

// 1. Liste des résultats de recherche (Déjà en place)
const MOCK_RESULTS = [
   { bgg_id: 13, name: "Catan", year: 1995 },
   { bgg_id: 822, name: "Carcassonne", year: 2000 },
   { bgg_id: 30549, name: "Pandemic", year: 2008 },
   { bgg_id: 266192, name: "Wingspan", year: 2019 },
   { bgg_id: 167791, name: "Terraforming Mars", year: 2016 },
   { bgg_id: 174430, name: "Gloomhaven", year: 2017 },
   { bgg_id: 230802, name: "Azul", year: 2017 }
];

// 2. NOUVEAU : Dictionnaire d'images de secours (Vraies URLs d'images)
const MOCK_IMAGES = {
   13: "https://cdn3.philibertnet.com/797512-thickbox_default/catane.jpg", // Catan (Style Catan)
   30549: "https://cdn3.philibertnet.com/523831-thickbox_default/pandemie.jpg", // Pandemic (Virus/Carte)
   266192: "https://cdn3.philibertnet.com/430895-thickbox_default/wingspan.jpg", // Wingspan (Oiseau)
   230802: "https://cdn2.philibertnet.com/402193-thickbox_default/azul.jpg", // Azul (Mosaique)
   822: "https://cdn2.philibertnet.com/542823-thickbox_default/carcassonne-vf.jpg" // Carcassonne (Chateau)
};

const parseXML = (xmlText) => {
   const parser = new DOMParser();
   const xmlDoc = parser.parseFromString(xmlText, "text/xml");
   const errorNode = xmlDoc.querySelector("parsererror");
   if (errorNode) throw new Error("Erreur parsing XML");
   return xmlDoc;
};

export const searchGames = async (query) => {
   if (!query || query.length < 3) return [];
   console.log(`📡 Tentative appel BGG pour : ${query}`);

   try {
      const response = await fetch(`${BGG_API_URL}/search?query=${encodeURIComponent(query)}&type=boardgame`);
      if (!response.ok) throw new Error(`Erreur HTTP BGG: ${response.status}`);

      const xmlText = await response.text();
      const xmlDoc = parseXML(xmlText);
      const items = Array.from(xmlDoc.querySelectorAll("item"));

      return items.map(item => ({
         bgg_id: parseInt(item.getAttribute("id")),
         name: item.querySelector("name")?.getAttribute("value"),
         year: item.querySelector("yearpublished")?.getAttribute("value")
            ? parseInt(item.querySelector("yearpublished").getAttribute("value"))
            : null,
      }));

      // eslint-disable-next-line no-unused-vars
   } catch (error) {
      console.error("⚠️ Passage en mode MOCK (Recherche).");
      await new Promise(resolve => setTimeout(resolve, 300)); // Petit délai réaliste
      return MOCK_RESULTS.filter(game =>
         game.name.toLowerCase().includes(query.toLowerCase())
      );
   }
};

export const getGameDetails = async (bggId) => {
   try {
      const response = await fetch(`${BGG_API_URL}/thing?id=${bggId}`);
      if (!response.ok) throw new Error("Erreur BGG Details");

      const xmlText = await response.text();
      const xmlDoc = parseXML(xmlText);
      const item = xmlDoc.querySelector("item");

      const thumbnail = item.querySelector("thumbnail")?.textContent;
      const image = item.querySelector("image")?.textContent;
      const minPlayers = item.querySelector("minplayers")?.getAttribute("value");
      const maxPlayers = item.querySelector("maxplayers")?.getAttribute("value");

      return {
         thumbnail_url: thumbnail || image || null,
         min_players: minPlayers ? parseInt(minPlayers) : null,
         max_players: maxPlayers ? parseInt(maxPlayers) : null,
      };

      // eslint-disable-next-line no-unused-vars
   } catch (error) {
      console.warn("⚠️ Passage en mode MOCK (Détails/Images).");

      // C'est ici qu'on sauve les meubles : on renvoie une image "en dur"
      return {
         thumbnail_url: MOCK_IMAGES[bggId] || "https://placehold.co/400x400/e2e8f0/475569?text=Box+Art", // Fallback générique
         min_players: 2,
         max_players: 4,
      };
   }
};
