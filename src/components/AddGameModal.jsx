import { useState } from 'react';
import { searchGames } from '../services/bgg';

export default function AddGameModal({ isOpen, onClose, onAdd, existingIds = [] }) {
// On déplace toute la logique de recherche ici !
const [query, setQuery] = useState('');
const [results, setResults] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

// Si la modale est fermée, on n'affiche rien du tout (null)
if (!isOpen) return null;

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
      setError("Erreur lors de la recherche.");
   } finally {
      setLoading(false);
   }
};

return (
   // 1. L'arrière-plan sombre (Overlay)
   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">

      {/* 2. La boîte blanche (La Modale) */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">

         {/* En-tête de la modale */}
         <div className="p-4 border-b flex justify-between items-center bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800">Ajouter un jeu</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button>
         </div>

         {/* Corps : Barre de recherche */}
         <div className="p-4 border-b">
            <form onSubmit={handleSearch} className="flex gap-2">
               <input
                  type="text"
                  placeholder="Rechercher (ex: Catan)..."
                  className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
               />
               <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition"
               >
                  {loading ? '...' : 'Chercher'}
               </button>
            </form>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
         </div>

         {/* Liste des résultats (Scrollable) */}
         <div className="overflow-y-auto flex-1 p-4 bg-gray-50">
            <div className="space-y-3">
               {results.map((game) => {
                  // On vérifie si ce jeu est déjà présent
                  const isAdded = existingIds.includes(game.bgg_id);

                  return (
                     <div key={game.bgg_id} className="flex items-center p-3 bg-white rounded-lg shadow-sm border hover:border-blue-300 transition group">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 font-bold text-xs mr-3">
                           {game.year || '?'}
                        </div>
                        <div className="flex-1">
                           <h3 className="font-bold text-gray-800">{game.name}</h3>
                           {isAdded && <span className="text-xs text-green-600 font-medium">Déjà dans ta liste</span>}
                        </div>

                        <button
                           onClick={() => onAdd(game)}
                           disabled={isAdded} // Désactive le clic
                           className={`px-3 py-1 rounded text-sm font-medium transition-all ${isAdded
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' // Style gris
                              : 'bg-green-100 text-green-700 hover:bg-green-200 opacity-0 group-hover:opacity-100' // Style vert normal
                              }`}
                        >
                           {isAdded ? 'Ajouté' : 'Ajouter'}
                        </button>
                     </div>
                  );
               })}
               {results.length === 0 && !loading && !error && (
                  <p className="text-center text-gray-400 mt-4">Les résultats apparaîtront ici.</p>
               )}
            </div>
         </div>
      </div>
   </div>
);
}
