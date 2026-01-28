import { useState, useEffect } from 'react';
import { searchGames, getGameDetails } from '../services/bgg';

export default function AddGameModal({ isOpen, onClose, onAddGame }) {
   const [query, setQuery] = useState('');
   const [results, setResults] = useState([]);
   const [searching, setSearching] = useState(false);
   const [loadingDetails, setLoadingDetails] = useState(false);
   const [debouncedQuery, setDebouncedQuery] = useState(query);

   useEffect(() => {
      const timer = setTimeout(() => setDebouncedQuery(query), 500);
      return () => clearTimeout(timer);
   }, [query]);

   useEffect(() => {
      const triggerSearch = async () => {
         if (debouncedQuery.length < 3) {
            setResults([]);
            return;
         }
         setSearching(true);
         try {
            const data = await searchGames(debouncedQuery);
            setResults(data);
         } catch (e) {
            console.error(e);
         } finally {
            setSearching(false);
         }
      };
      triggerSearch();
   }, [debouncedQuery]);

   // Fonction pour récupérer les détails avant d'ajouter le jeu en base
   const handleAddWithDetails = async (gameFromSearch) => {
      setLoadingDetails(true);
      try {
         const fullDetails = await getGameDetails(gameFromSearch.bgg_id);
         if (fullDetails) {
            await onAddGame(fullDetails);
            onClose();
            setQuery('');
         }
      } catch (error) {
         console.error("Erreur ajout :", error);
      } finally {
         setLoadingDetails(false);
      }
   };

   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
         <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onClose}></div>
         <div className="relative w-full max-w-lg bg-[#FDFBF7] rounded-2xl shadow-2xl overflow-hidden border border-stone-200 animate-in zoom-in-95 duration-300">
            <div className="bg-stone-900 p-8 text-center">
               <h2 className="text-2xl font-serif font-bold text-amber-50">Invoquer un Jeu</h2>
               <button onClick={onClose} className="absolute top-4 right-4 text-stone-500 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>

            <div className="p-6">
               <div className="relative mb-6">
                  <input
                     type="text"
                     className="w-full p-4 pl-12 bg-white border border-stone-200 text-stone-800 rounded-xl outline-none focus:border-amber-500 font-serif font-bold"
                     placeholder="Nom du jeu..."
                     value={query}
                     onChange={(e) => setQuery(e.target.value)}
                     autoFocus
                  />
                  {(searching || loadingDetails) && (
                     <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className="animate-spin h-5 w-5 border-2 border-stone-200 border-t-amber-500 rounded-full"></div>
                     </div>
                  )}
               </div>

               <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                  {results.map((game) => (
                     <div
                        key={game.bgg_id}
                        onClick={() => !loadingDetails && handleAddWithDetails(game)}
                        className={`group flex items-center gap-4 p-3 bg-white border border-transparent hover:border-amber-200 hover:bg-amber-50 rounded-xl cursor-pointer transition-all ${loadingDetails ? 'opacity-50' : ''}`}
                     >
                        <div className="w-12 h-12 shrink-0 bg-stone-100 rounded-lg flex items-center justify-center font-serif font-bold text-stone-300">
                           {game.year ? game.year.slice(-2) : '??'}
                        </div>
                        <div className="flex-1">
                           <h4 className="font-serif font-bold text-stone-800 truncate">{game.name}</h4>
                           <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Édition {game.year || "Inconnue"}</p>
                        </div>
                        <div className="w-8 h-8 rounded-full border border-stone-100 flex items-center justify-center text-stone-300 group-hover:bg-amber-500 group-hover:text-white transition-all">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" /></svg>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
}
