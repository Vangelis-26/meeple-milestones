const BGG_API_URL = '/api/bgg';

// 1. Nos fausses données (pour quand l'API fait la tête)
const MOCK_RESULTS = [
   { bgg_id: 13, name: "Catan", year: 1995 },
   { bgg_id: 822, name: "Carcassonne", year: 2000 },
   { bgg_id: 30549, name: "Pandemic", year: 2008 },
   { bgg_id: 266192, name: "Wingspan", year: 2019 },
   { bgg_id: 167791, name: "Terraforming Mars", year: 2016 },
   { bgg_id: 174430, name: "Gloomhaven", year: 2017 },
   { bgg_id: 230802, name: "Azul", year: 2017 }
];

const parseXML = (xmlText) => {
   const parser = new DOMParser();
   const xmlDoc = parser.parseFromString(xmlText, "text/xml");
   const errorNode = xmlDoc.querySelector("parsererror");
   if (errorNode) throw new Error("Erreur parsing XML");
   return xmlDoc;
};

export const searchGames = async (query) => {
   // Sécurité : pas d'appel pour rien
   if (!query || query.length < 3) return [];

   console.log(`📡 Tentative appel BGG pour : ${query}`);

   try {
      // On tente l'appel réel via le proxy
      const response = await fetch(`${BGG_API_URL}/search?query=${encodeURIComponent(query)}&type=boardgame`);

      // Si l'API nous bloque (401, 403, 500...), on lève une erreur pour déclencher le plan B
      if (!response.ok) {
         throw new Error(`Erreur HTTP BGG: ${response.status}`);
      }

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

   } catch (error) {
      // PLAN B : Le Mocking
      console.error("⚠️ API BGG inaccessible (Mode Dégradé activé).", error.message);

      // On fait semblant d'attendre un peu (pour simuler un réseau)
      await new Promise(resolve => setTimeout(resolve, 500));

      // On renvoie les fausses données, mais on filtre un peu si possible pour faire "vrai"
      console.log("✅ Utilisation des données MOCK.");
      return MOCK_RESULTS.filter(game =>
         game.name.toLowerCase().includes(query.toLowerCase())
      );
   }
};
