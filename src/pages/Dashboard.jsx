import { useState } from 'react';
import { searchGames } from '../services/bgg';
import { supabase } from '../services/supabase';
import ChallengeGrid from '../components/ChallengeGrid';

export default function Dashboard() {
   const [query, setQuery] = useState('');
   const [results, setResults] = useState([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);

   // Fonction déclenchée quand on soumet le formulaire
   const handleSearch = async (e) => {
      e.preventDefault();
      if (query.length < 3) return;

      setLoading(true);
      setError(null);
      setResults([]);

      try {
         const data = await searchGames(query);
         setResults(data);
         if (data.length === 0) setError("Aucun jeu trouvé.");
         // eslint-disable-next-line no-unused-vars
      } catch (err) {
         setError("Erreur critique lors de la recherche.");
      } finally {
         setLoading(false);
      }
   };

   const addToCollection = async (gameBgg) => {
      const MY_CHALLENGE_ID = 1;
      // eslint-disable-next-line no-unused-vars
      const { user } = supabase.auth.getUser();

      if (!confirm(`Ajouter ${gameBgg.name} à ton Challenge ?`)) return;

      try {
         // 1. Upsert dans le catalogue GLOBAL (comme avant)
         const { data: gameData, error: gameError } = await supabase
            .from('games')
            .upsert({
               bgg_id: gameBgg.bgg_id,
               name: gameBgg.name,
            }, { onConflict: 'bgg_id' })
            .select()
            .single();

         if (gameError) throw gameError;

         // 2. Insert dans TON challenge (La nouveauté)
         const { error: linkError } = await supabase
            .from('challenge_items')
            .insert({
               challenge_id: MY_CHALLENGE_ID,
               game_id: gameData.id, // On utilise l'ID interne de notre base
               progress: 0,
               target: 10
            });

         if (linkError) {
            if (linkError.code === '23505') { // Code SQL pour "Doublon"
               alert("Ce jeu est déjà dans ton challenge !");
            } else {
               throw linkError;
            }
         } else {
            alert(`🎉 ${gameData.name} ajouté à ton challenge !`);
         }

      } catch (error) {
         console.error("Erreur ajout:", error);
         alert("Erreur : " + error.message);
      }
   };

   return (
      <div className="max-w-4xl mx-auto">
         <h1 className="text-3xl font-bold mb-6 text-gray-800">Ajouter un jeu au challenge</h1>

         {/* Barre de recherche */}
         <form onSubmit={handleSearch} className="mb-8 flex gap-2">
            <input
               type="text"
               placeholder="Rechercher un jeu (ex: Catan, Azul...)"
               className="flex-1 p-3 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
               value={query}
               onChange={(e) => setQuery(e.target.value)}
            />
            <button
               type="submit"
               disabled={loading || query.length < 3}
               className="bg-blue-600 text-white px-6 py-3 rounded font-bold hover:bg-blue-700 disabled:opacity-50 transition"
            >
               {loading ? '...' : 'Chercher'}
            </button>
         </form>

         {/* Zone de feedback (Erreur) */}
         {error && (
            <div className="p-4 bg-yellow-50 text-yellow-800 rounded mb-4 border border-yellow-200">
               {error}
            </div>
         )}

         {/* Grille de résultats de recherche (Celle qui affiche Catan, Azul...) */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((game) => (
               <div key={game.bgg_id} className="flex items-center p-4 bg-white border rounded shadow-sm hover:shadow-md transition">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 font-bold text-xs mr-4 shrink-0">
                     {game.year || '?'}
                  </div>

                  <div className="flex-1">
                     <h3 className="font-bold text-lg">{game.name}</h3>
                     <p className="text-xs text-gray-500">ID BGG: {game.bgg_id}</p>
                  </div>

                  <button
                     className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 transition"
                     onClick={() => addToCollection(game)}
                  >
                     Ajouter
                  </button>
               </div>
            ))}
         </div>

         {/* 👇 C'EST ICI QU'ON AJOUTE LA SÉPARATION ET LA GRILLE 👇 */}

         <hr className="my-12 border-gray-200" />

         {/* Notre nouveau composant qui affiche "Mes Jeux" */}
         <ChallengeGrid />

         {/* 👆 FIN DE L'AJOUT 👆 */}

      </div>
   );
}
