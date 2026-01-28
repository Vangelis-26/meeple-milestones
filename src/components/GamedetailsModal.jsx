import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GameDetailsModal({ game, isOpen, onClose }) {
   const navigate = useNavigate();

   const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
   const [prevGameId, setPrevGameId] = useState(null);

   if (game?.id !== prevGameId) {
      setPrevGameId(game?.id);
      setIsDescriptionExpanded(false);
   }

   if (!isOpen || !game) return null;

   const getComplexityColor = (complexity) => {
      const val = parseFloat(complexity);
      if (!val || isNaN(val)) return 'text-stone-400 bg-stone-50 border-stone-200';
      if (val < 2) return 'text-green-600 bg-green-50 border-green-200';
      if (val < 3) return 'text-amber-600 bg-amber-50 border-amber-200';
      return 'text-red-600 bg-red-50 border-red-200';
   };

   // On s'assure d'avoir des valeurs propres pour l'affichage
   const displayRating = game.rating ? parseFloat(game.rating).toFixed(1) : '-';
   const displayComplexity = game.complexity ? parseFloat(game.complexity).toFixed(2) : '-';
   const isLongDescription = game.description && game.description.length > 350;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
         <style>{`
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
         `}</style>

         <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

         <div className="relative bg-[#FDFBF7] w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col shadow-2xl rounded-3xl max-h-[90vh]">

            {/* HEADER IMMERSIF */}
            <div className="relative h-48 shrink-0 bg-stone-900 overflow-hidden z-10">
               <img
                  src={game.image_url || game.thumbnail_url}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover object-top opacity-60 blur-[2px] scale-105"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-stone-900/20 to-transparent"></div>

               <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <h3 className="font-serif font-black text-4xl text-stone-900 tracking-tight leading-none drop-shadow-sm">
                     {game.name}
                  </h3>
               </div>

               <button onClick={onClose} className="absolute top-5 right-5 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-all border border-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>

            {/* CORPS STATISTIQUES */}
            <div className="p-8 overflow-y-auto no-scrollbar relative z-10">

               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">

                  {/* BLOC 1 : DURÉE */}
                  <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-sm flex flex-col items-center justify-center text-center group hover:border-amber-300 transition-colors">
                     <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">⏳</span>
                     <span className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">Temps</span>
                     <span className="font-serif font-bold text-stone-800 text-lg">
                        {game.playing_time ? `${game.playing_time}'` : '-'}
                     </span>
                  </div>

                  {/* BLOC 2 : NOTE BGG (Remplace les joueurs) */}
                  <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-sm flex flex-col items-center justify-center text-center group hover:border-amber-300 transition-colors">
                     <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">⭐</span>
                     <span className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">Note BGG</span>
                     <span className="font-serif font-bold text-stone-800 text-lg">
                        {displayRating}<span className="text-[10px] text-stone-400 ml-0.5">/10</span>
                     </span>
                  </div>

                  {/* BLOC 3 : ANNÉE (Ou Age) */}
                  <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-sm flex flex-col items-center justify-center text-center group hover:border-amber-300 transition-colors">
                     <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">📜</span>
                     <span className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">Parution</span>
                     <span className="font-serif font-bold text-stone-800 text-lg">
                        {game.year_published || '-'}
                     </span>
                  </div>

                  {/* BLOC 4 : COMPLEXITÉ */}
                  <div className={`p-3 rounded-2xl border shadow-sm flex flex-col items-center justify-center text-center transition-colors ${getComplexityColor(game.complexity)}`}>
                     <span className="text-2xl mb-1 group-hover:rotate-12 transition-transform">🧠</span>
                     <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">Poids</span>
                     <span className="font-serif font-bold text-lg">
                        {displayComplexity}
                        <span className="text-xs opacity-70">/5</span>
                     </span>
                  </div>
               </div>

               {/* DESCRIPTION */}
               <div className="mb-8">
                  <h4 className="font-serif font-bold text-xl text-stone-800 mb-3 flex items-center gap-2">
                     <span>📖</span> Chroniques
                  </h4>
                  <div className="relative">
                     <div className={`text-stone-600 text-sm leading-relaxed italic ${isLongDescription && !isDescriptionExpanded ? 'line-clamp-4' : ''}`}>
                        <div dangerouslySetInnerHTML={{ __html: game.description || "Le grimoire est vierge de toute description pour ce titre." }} />
                     </div>
                     {isLongDescription && (
                        <button
                           onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                           className="mt-3 text-xs font-bold text-amber-600 hover:text-amber-700 uppercase tracking-widest flex items-center gap-1 group"
                        >
                           {isDescriptionExpanded ? 'Fermer le manuscrit' : 'Lire la suite'}
                        </button>
                     )}
                  </div>
               </div>

               {/* ACTION FOOTER */}
               <div className="bg-stone-100 rounded-2xl p-5 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-center sm:text-left">
                     <div className="w-12 h-12 rounded-full bg-white border border-stone-200 flex items-center justify-center text-amber-600 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                     </div>
                     <div>
                        <h5 className="font-serif font-bold text-stone-900 text-lg">Archives du Destin</h5>
                        <p className="text-xs text-stone-500">Consulter l'historique complet des parties.</p>
                     </div>
                  </div>

                  <button
                     onClick={() => { onClose(); navigate(`/game/${game.id}`); }}
                     className="px-5 py-3 bg-stone-800 text-amber-50 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black transition-all shadow-lg"
                  >
                     Ouvrir le Grimoire
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}
