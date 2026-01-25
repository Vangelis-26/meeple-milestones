import { useEffect } from 'react';

export default function GameDetailsModal({ game, onClose }) {
   useEffect(() => {
      if (game) { document.body.style.overflow = 'hidden'; }
      return () => { document.body.style.overflow = 'unset'; };
   }, [game]);

   if (!game) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
         <div
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
            onClick={onClose}
         ></div>

         <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row animate-in fade-in zoom-in duration-200">

            <button
               onClick={onClose}
               className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white text-stone-500 hover:text-red-500 rounded-full p-2 transition-colors"
            >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
               </svg>
            </button>

            {/* IMAGE */}
            <div className="w-full md:w-2/5 bg-stone-100 relative min-h-[300px]">
               <img
                  src={game.image_url || game.thumbnail_url}
                  alt={game.name}
                  className="w-full h-full object-cover object-center absolute inset-0"
               />
               <div className="absolute top-4 left-4 bg-amber-500 text-white font-black text-xl px-3 py-1 rounded-lg shadow-lg border-2 border-white transform -rotate-3">
                  {game.rating || "?"} <span className="text-xs font-normal opacity-80">/10</span>
               </div>
            </div>

            {/* INFOS */}
            <div className="flex-1 p-8 flex flex-col">

               <div className="mb-6">
                  <h2 className="text-3xl md:text-4xl font-serif font-extrabold text-stone-800 leading-tight mb-2">
                     {game.name}
                  </h2>
                  <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider text-stone-500">
                     <span className="bg-stone-100 px-2 py-1 rounded">Année {game.year_published}</span>
                     <span className="bg-stone-100 px-2 py-1 rounded">{game.min_players}-{game.max_players || 4} Joueurs</span>
                     <span className="bg-stone-100 px-2 py-1 rounded">{game.min_age}+ Ans</span>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 flex items-center gap-3">
                     <div className="text-2xl">⏳</div>
                     <div>
                        <div className="text-xs text-amber-800 uppercase font-bold opacity-60">Durée</div>
                        <div className="font-bold text-amber-900">{game.playing_time || "?"} min</div>
                     </div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex items-center gap-3">
                     <div className="text-2xl">🧠</div>
                     <div>
                        <div className="text-xs text-blue-800 uppercase font-bold opacity-60">Complexité</div>
                        <div className="font-bold text-blue-900">{game.complexity || "?"} / 5</div>
                     </div>
                  </div>
               </div>

               <div className="prose prose-stone prose-sm max-w-none text-stone-600 leading-relaxed overflow-y-auto pr-2 max-h-60 custom-scrollbar">
                  <p>{game.description || "Aucune description disponible."}</p>
               </div>

               <div className="mt-auto pt-6 border-t border-stone-100">
                  <a
                     href={`https://boardgamegeek.com/boardgame/${game.bgg_id}`}
                     target="_blank"
                     rel="noreferrer"
                     className="inline-flex items-center gap-2 text-stone-400 hover:text-amber-600 transition-colors text-sm font-medium"
                  >
                     Voir la fiche sur BoardGameGeek
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </a>
               </div>
            </div>
         </div>
      </div>
   );
}
