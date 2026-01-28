const BGG_BASE_URL = 'https://boardgamegeek.com/xmlapi2';
const API_KEY = import.meta.env.VITE_BGG_API_KEY;

const parseBGGXml = async (endpoint, params = {}) => {
   const url = new URL(`${BGG_BASE_URL}/${endpoint}`);
   Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

   const response = await fetch(url, {
      headers: {
         'Authorization': `Bearer ${API_KEY}`,
         'Accept': 'application/xml'
      }
   });

   if (response.status === 202) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return parseBGGXml(endpoint, params);
   }

   const xmlText = await response.text();
   return new DOMParser().parseFromString(xmlText, "application/xml");
};

export const searchGames = async (query) => {
   if (!query || query.length < 3) return [];
   try {
      const xml = await parseBGGXml('search', { query, type: 'boardgame' });
      const items = xml.querySelectorAll('item');
      return Array.from(items).map(item => ({
         bgg_id: item.getAttribute('id'),
         name: item.querySelector('name')?.getAttribute('value'),
         year: item.querySelector('yearpublished')?.getAttribute('value')
      })).slice(0, 10);
   } catch (error) { return []; }
};

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

         // ✅ EXTRACTION DES JOUEURS
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
