import { useState, useEffect } from 'react';
import { searchGames } from '../services/bgg';

export default function AddGameModal({ isOpen, onClose, onAdd, existingIds = [] }) {
   const [query, setQuery] = useState('');
   const [results, setResults] = useState([]);
   const [loading, setLoading] = useState(false);
   const [hasSearched, setHasSearched] = useState(false);

   // Reset quand on ouvre/ferme
   useEffect(() => {
      if (isOpen) {
         setQuery('');
         setResults([]);
         setLoading(false);
         setHasSearched(false);
      }
   }, [isOpen]);

   const triggerSearch = async () => {
      if (!query || query.length < 3) return;
      setLoading(true);
      setHasSearched(true);
      try {
         const games = await searchGames(query);
         setResults(games);
      } catch (error) {
         console.error(error);
      } finally {
         setLoading(false);
      }
   };

   const handleKeyDown = (e) => {
      if (e.key === 'Enter') triggerSearch();
   };

   const handleSelectGame = async (gameStub) => {
      // On appelle directement onAdd avec les infos minimales que ton useChallenge.js accepte
      // Pas besoin de fetch les détails ici, ton useChallenge le fait déjà !
      const gameForHook = {
         bgg_id: gameStub.bgg_id, // C'est crucial que ce soit bgg_id
         name: gameStub.name,
         // On laisse useChallenge récupérer l'image via getGameDetails interne
      };

      await onAdd(gameForHook);
   };

   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
         <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

         <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="bg-amber-600 px-6 py-4 flex justify-between items-center shadow-md z-10">
               <h3 className="text-xl font-serif font-bold text-white tracking-wide">Ajouter un jeu</h3>
               <button onClick={onClose} className="text-amber-100 hover:text-white p-1 rounded-full hover:bg-amber-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>

            {/* Corps */}
            <div className="p-6 bg-stone-50 flex-1 overflow-hidden flex flex-col">
               {/* Recherche */}
               <div className="relative mb-2">
                  <input
                     type="text"
                     placeholder="Ex: Catan... (puis Entrée)"
                     className="w-full pl-4 pr-12 py-3 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none shadow-sm text-stone-800 placeholder-stone-400"
                     value={query}
                     onChange={(e) => setQuery(e.target.value)}
                     onKeyDown={handleKeyDown}
                     autoFocus
                  />
                  <button
                     onClick={triggerSearch}
                     disabled={loading || query.length < 3}
                     className="absolute right-2 top-2 p-1.5 bg-stone-100 hover:bg-amber-100 text-stone-400 hover:text-amber-600 rounded-lg disabled:opacity-50 transition-colors"
                  >
                     {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-stone-300 border-t-amber-600"></div>
                     ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                     )}
                  </button>
               </div>

               <div className="flex justify-end mb-4 px-1"><span className="text-[10px] font-medium text-stone-400">Données via BGG API</span></div>

               {/* Liste Résultats */}
               <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
                  {!hasSearched ? (
                     <div className="text-center py-10 text-stone-400 italic text-sm">Tapez le nom d'un jeu et appuyez sur Entrée.</div>
                  ) : results.length === 0 && !loading ? (
                     <div className="text-center py-10 text-stone-500 text-sm">Aucun résultat trouvé.</div>
                  ) : (
                     results.map((game) => {
                        const isAlreadyAdded = existingIds.includes(game.bgg_id);
                        return (
                           <div key={game.bgg_id} className="bg-white p-3 rounded-xl border border-stone-200 shadow-sm flex justify-between items-center group hover:border-amber-300 transition-colors">

                              <div className="flex-1">
                                 <div className="font-bold text-stone-800 text-sm">{game.name}</div>
                                 <div className="text-xs text-stone-400">{game.year || "Année inconnue"}</div>
                              </div>

                              {isAlreadyAdded ? (
                                 <span className="text-xs font-bold text-stone-400 uppercase bg-stone-100 px-2 py-1 rounded">Déjà ajouté</span>
                              ) : (
                                 <button
                                    onClick={() => handleSelectGame(game)}
                                    className="bg-amber-100 text-amber-700 p-2 rounded-lg hover:bg-amber-600 hover:text-white transition-all shadow-sm flex items-center gap-1 text-xs font-bold uppercase tracking-wide"
                                 >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                       <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    Ajouter
                                 </button>
                              )}
                           </div>
                        );
                     })
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}
