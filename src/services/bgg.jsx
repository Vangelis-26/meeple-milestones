// =================================================================================
// SERVICE : BOARD GAME GEEK API
// Rôle : Recherche et récupération des métadonnées de jeux (XML API v2).
// =================================================================================

const BGG_BASE_URL = 'https://boardgamegeek.com/xmlapi2';
// Note : L'API BGG ne nécessite pas de clé API pour les requêtes publiques, 
// mais on garde la structure si jamais on utilise un proxy ou une clé à l'avenir.
const API_KEY = import.meta.env.VITE_BGG_API_KEY;

// Fonction utilitaire générique pour fetcher et parser le XML
const parseBGGXml = async (endpoint, params = {}) => {
   const url = new URL(`${BGG_BASE_URL}/${endpoint}`);
   Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

   const headers = { 'Accept': 'application/xml' };
   if (API_KEY) headers['Authorization'] = `Bearer ${API_KEY}`;

   const response = await fetch(url, { headers });

   // Gestion du "Queuing" BGG (Code 202 = Reviens plus tard, je calcule)
   if (response.status === 202) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return parseBGGXml(endpoint, params);
   }

   const xmlText = await response.text();
   return new DOMParser().parseFromString(xmlText, "application/xml");
};

// 1. RECHERCHE DE JEUX
export const searchGames = async (query) => {
   if (!query || query.length < 3) return [];
   try {
      // Étape A : Recherche simple pour avoir les IDs
      const xml = await parseBGGXml('search', { query, type: 'boardgame' });
      const items = xml.querySelectorAll('item');

      if (items.length === 0) return [];

      // On limite à 10 résultats pour ne pas surcharger la requête suivante
      const ids = Array.from(items)
         .slice(0, 10)
         .map(item => item.getAttribute('id'))
         .join(',');

      // Étape B : Récupération des détails (Images + Notes) pour ces IDs
      const detailsXml = await parseBGGXml('thing', { id: ids, stats: 1 });
      const detailItems = detailsXml.querySelectorAll('item');

      // Mapping des résultats
      return Array.from(detailItems).map(item => ({
         bgg_id: item.getAttribute('id'),
         name: item.querySelector('name[type="primary"]')?.getAttribute('value') || item.querySelector('name')?.getAttribute('value'),
         thumbnail: item.querySelector('thumbnail')?.textContent,
         year: item.querySelector('yearpublished')?.getAttribute('value'),
         rating: parseFloat(item.querySelector('statistics ratings average')?.getAttribute('value') || 0).toFixed(1)
      }));

   } catch (error) {
      console.error("Erreur Search BGG:", error);
      return [];
   }
};

// 2. DÉTAILS D'UN JEU UNIQUE
export const getGameDetails = async (bggId) => {
   try {
      const xml = await parseBGGXml('thing', { id: bggId, stats: 1 });
      const item = xml.querySelector('item');
      if (!item) return null;

      const stats = item.querySelector('statistics ratings');

      return {
         bgg_id: bggId,
         name: item.querySelector('name[type="primary"]')?.getAttribute('value'),
         thumbnail_url: item.querySelector('thumbnail')?.textContent,
         image_url: item.querySelector('image')?.textContent,
         description: item.querySelector('description')?.textContent || "",
         year_published: parseInt(item.querySelector('yearpublished')?.getAttribute('value')),
         min_players: parseInt(item.querySelector('minplayers')?.getAttribute('value')),
         max_players: parseInt(item.querySelector('maxplayers')?.getAttribute('value')),
         min_age: parseInt(item.querySelector('minage')?.getAttribute('value')),
         playing_time: parseInt(item.querySelector('playingtime')?.getAttribute('value')),
         rating: parseFloat(stats?.querySelector('average')?.getAttribute('value') || 0),
         complexity: parseFloat(stats?.querySelector('averageweight')?.getAttribute('value') || 0)
      };
   } catch (error) {
      console.error("Erreur BGG Details:", error);
      return null;
   }
};
