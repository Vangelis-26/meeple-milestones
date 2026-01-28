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
         <div className="relative w-full max-w-xl bg-[#FDFBF7] rounded-[2.5rem] shadow-2xl overflow-hidden border border-stone-200 animate-in zoom-in-95 duration-300">

            <div className="bg-stone-900 p-10 text-center relative overflow-hidden">
               <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"></div>
               <h2 className="text-3xl font-serif font-black text-amber-50 relative z-10 italic">Invoquer un Jeu</h2>
               <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2 relative z-10">Recherche dans les archives de l'Olympe</p>
               <button onClick={onClose} className="absolute top-6 right-6 text-stone-500 hover:text-white transition-colors z-20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>

            <div className="p-8">
               <div className="relative mb-8">
                  <input
                     type="text"
                     className="w-full p-5 pl-14 bg-white border-2 border-stone-100 text-stone-800 rounded-2xl outline-none focus:border-amber-500 font-serif font-bold text-lg shadow-sm transition-all"
                     placeholder="Quel titre cherchez-vous ?"
                     value={query}
                     onChange={(e) => setQuery(e.target.value)}
                     autoFocus
                  />
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  {(searching || loadingDetails) && (
                     <div className="absolute right-5 top-1/2 -translate-y-1/2">
                        <div className="animate-spin h-6 w-6 border-3 border-stone-100 border-t-amber-500 rounded-full"></div>
                     </div>
                  )}
               </div>

               <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                  {results.map((game) => (
                     <div
                        key={game.bgg_id}
                        onClick={() => !loadingDetails && handleAddWithDetails(game)}
                        className={`group flex items-center gap-5 p-4 bg-white border border-stone-100 hover:border-amber-200 hover:bg-amber-50/50 rounded-[1.5rem] cursor-pointer transition-all duration-300 ${loadingDetails ? 'opacity-50 pointer-events-none' : ''}`}
                     >
                        {/* ILLUSTRATION RÉELLE DU JEU */}
                        <div className="w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-stone-100 border-2 border-white shadow-sm group-hover:shadow-md transition-all duration-500">
                           {game.thumbnail ? (
                              <img
                                 src={game.thumbnail}
                                 alt={game.name}
                                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                           ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-stone-50 text-stone-300">
                                 <span className="text-[8px] font-black uppercase mb-1">Annee</span>
                                 <span className="font-serif font-black text-xl">{game.year ? game.year.slice(-2) : '??'}</span>
                              </div>
                           )}
                        </div>

                        {/* INFOS DU JEU */}
                        <div className="flex-1 min-w-0">
                           <h4 className="font-serif font-bold text-lg text-stone-900 truncate group-hover:text-amber-700 transition-colors leading-tight">
                              {game.name}
                           </h4>
                           <div className="flex items-center gap-3 mt-1.5">
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                                 Édition {game.year || "----"}
                              </span>
                              {game.rating > 0 && (
                                 <>
                                    <span className="w-1 h-1 bg-stone-200 rounded-full"></span>
                                    <span className="text-[10px] font-black text-amber-600 tracking-widest">★ {game.rating}</span>
                                 </>
                              )}
                           </div>
                        </div>

                        {/* BOUTON D'ACTION ICONIQUE */}
                        <div className="w-10 h-10 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-400 group-hover:bg-stone-900 group-hover:text-white group-hover:border-stone-900 transition-all duration-500 shadow-sm">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M12 4v16m8-8H4" /></svg>
                        </div>
                     </div>
                  ))}
               </div>
               <div className="mt-6 pt-4 border-t border-stone-50 text-center">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-500">
                     Données fournies par BoardGameGeek
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
}
