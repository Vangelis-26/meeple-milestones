import { useState, useEffect } from 'react';
import { searchGames } from '../services/bgg';

export default function AddGameModal({ isOpen, onClose, onAddGame }) {
   const [query, setQuery] = useState('');
   const [results, setResults] = useState([]);
   const [searching, setSearching] = useState(false);
   const [debouncedQuery, setDebouncedQuery] = useState(query);

   // Debounce pour ne pas spammer la recherche
   useEffect(() => {
      const timer = setTimeout(() => setDebouncedQuery(query), 500);
      return () => clearTimeout(timer);
   }, [query]);

   // Déclenchement de la recherche
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

   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
         {/* OVERLAY FLOUTÉ */}
         <div
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
            onClick={onClose}
         ></div>

         {/* LA CARTE MODALE */}
         <div className="relative w-full max-w-lg bg-[#FDFBF7] rounded-2xl shadow-2xl overflow-hidden border border-stone-200 transform transition-all animate-in zoom-in-95 duration-300">

            {/* EN-TÊTE "PIERRE & OR" */}
            <div className="bg-stone-900 p-8 text-center relative overflow-hidden">
               {/* Effets de fond */}
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
               <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl"></div>

               <h2 className="text-2xl font-serif font-bold text-amber-50 relative z-10">
                  Invoquer un Jeu
               </h2>
               <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 mt-2 relative z-10">
                  Recherche dans les archives
               </p>

               <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-stone-500 hover:text-white transition-colors p-2"
               >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
               </button>
            </div>

            {/* CORPS DE LA MODALE */}
            <div className="p-6">
               {/* BARRE DE RECHERCHE STYLISÉE */}
               <div className="relative mb-6 group">
                  <input
                     type="text"
                     className="w-full p-4 pl-12 bg-white border border-stone-200 text-stone-800 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none font-serif font-bold text-lg shadow-sm transition-all placeholder:font-sans placeholder:font-normal placeholder:text-base placeholder:text-stone-300"
                     placeholder="Nom du jeu (ex: Ark Nova)..."
                     value={query}
                     onChange={(e) => setQuery(e.target.value)}
                     autoFocus
                  />
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400 group-focus-within:text-amber-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                     <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>

                  {searching && (
                     <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className="animate-spin h-5 w-5 border-2 border-stone-200 border-t-amber-500 rounded-full"></div>
                     </div>
                  )}
               </div>

               {/* LISTE DES RÉSULTATS */}
               <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                  {results.length === 0 && query.length >= 3 && !searching && (
                     <div className="text-center py-10 opacity-50">
                        <span className="text-4xl block mb-2">📜</span>
                        <p className="font-serif italic text-stone-500">Aucun parchemin trouvé.</p>
                     </div>
                  )}

                  {results.map((game) => (
                     <div
                        key={game.bgg_id}
                        onClick={() => onAddGame(game)}
                        className="group flex items-center gap-4 p-3 bg-white border border-transparent hover:border-amber-200/50 hover:bg-amber-50/50 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                     >
                        {/* THUMBNAIL (Placeholder ou Image) */}
                        <div className="w-16 h-16 shrink-0 bg-stone-100 rounded-lg overflow-hidden border border-stone-100 shadow-sm group-hover:shadow relative">
                           {/* On met une icône par défaut, si l'image charge on pourrait l'afficher mais l'API search ne renvoie pas toujours l'image */}
                           <div className="absolute inset-0 flex items-center justify-center text-stone-300 font-serif font-bold text-xl group-hover:text-amber-500/50 transition-colors">
                              {game.year ? game.year.slice(-2) : '??'}
                           </div>
                        </div>

                        <div className="flex-1 min-w-0">
                           <h4 className="font-serif font-bold text-stone-800 text-lg leading-tight group-hover:text-amber-800 transition-colors truncate">
                              {game.name}
                           </h4>
                           <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mt-1">
                              Édition {game.year || "Inconnue"}
                           </p>
                        </div>

                        <div className="w-8 h-8 rounded-full border border-stone-100 flex items-center justify-center text-stone-300 group-hover:bg-amber-500 group-hover:border-amber-500 group-hover:text-white transition-all">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                           </svg>
                        </div>
                     </div>
                  ))}
               </div>

               {/* FOOTER DISCRET */}
               <div className="mt-6 pt-4 border-t border-stone-100 text-center">
                  <p className="text-[9px] text-stone-300 uppercase tracking-widest font-bold">
                     Données certifiées par l'API BoardGameGeek
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
}
