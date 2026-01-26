import { useEffect, useState } from 'react';

export default function GameDetailsModal({ game, isOpen, onClose, userProgress }) {
   const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

   useEffect(() => {
      setIsDescriptionExpanded(false);
   }, [game]);

   if (!isOpen || !game) return null;

   // Logique couleurs
   const getComplexityColor = (rating) => {
      if (rating < 2) return 'text-green-600 bg-green-50 border-green-200';
      if (rating < 3) return 'text-amber-600 bg-amber-50 border-amber-200';
      return 'text-red-600 bg-red-50 border-red-200';
   };

   // Formatage note
   const rating = game.rating ? parseFloat(game.rating).toFixed(1) : '-';

   // Vérifie si la description est longue pour afficher ou non le bouton "Lire la suite"
   const isLongDescription = game.description && game.description.length > 350;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
         <style>{`
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
         `}</style>

         <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

         <div className="relative bg-[#FDFBF7] w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col shadow-2xl rounded-3xl max-h-[90vh]">

            {/* HEADER IMMERSIF (Sans bordure coupante) */}
            <div className="relative h-48 shrink-0 bg-stone-900 overflow-hidden z-10">
               <img
                  src={game.image_url || game.thumbnail_url}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover object-top opacity-60 blur-[2px] scale-105"
               />
               {/* Dégradé fluide vers la couleur papier du bas */}
               <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-stone-900/20 to-transparent"></div>

               <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="flex items-start justify-between">
                     <div>
                        <div className="flex items-center gap-2 mb-2">
                           <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded shadow-sm border border-amber-400">
                              BGG {rating}
                           </span>
                           <span className="text-white/90 text-xs font-serif italic tracking-wide drop-shadow-md">
                              {game.year_published}
                           </span>
                        </div>
                        <h3 className="font-serif font-black text-4xl text-stone-900 tracking-tight leading-none mb-1 drop-shadow-sm mix-blend-hard-light">
                           {game.name}
                        </h3>
                     </div>
                  </div>
               </div>

               <button onClick={onClose} className="absolute top-5 right-5 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-all border border-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>

            {/* CORPS DE LA FICHE */}
            <div className="p-8 overflow-y-auto no-scrollbar relative z-10">

               {/* 1. GRID INFOS */}
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-sm flex flex-col items-center justify-center text-center group hover:border-amber-300 transition-colors">
                     <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">⏳</span>
                     <span className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">Durée</span>
                     <span className="font-serif font-bold text-stone-800 text-lg">{game.playing_time} <span className="text-xs">min</span></span>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-sm flex flex-col items-center justify-center text-center group hover:border-amber-300 transition-colors">
                     <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">👥</span>
                     <span className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">Joueurs</span>
                     <span className="font-serif font-bold text-stone-800 text-lg">{game.min_players}-{game.max_players}</span>
                  </div>
                  <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-sm flex flex-col items-center justify-center text-center group hover:border-amber-300 transition-colors">
                     <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">🎂</span>
                     <span className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">Age</span>
                     <span className="font-serif font-bold text-stone-800 text-lg">{game.min_age}+</span>
                  </div>
                  <div className={`p-3 rounded-2xl border shadow-sm flex flex-col items-center justify-center text-center transition-colors ${getComplexityColor(game.complexity)}`}>
                     <span className="text-2xl mb-1">🧠</span>
                     <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">Poids</span>
                     <span className="font-serif font-bold text-lg">{parseFloat(game.complexity).toFixed(2)}<span className="text-xs opacity-70">/5</span></span>
                  </div>
               </div>

               {/* 2. DESCRIPTION */}
               <div className="mb-8">
                  <h4 className="font-serif font-bold text-xl text-stone-800 mb-3 flex items-center gap-2">
                     <span>📜</span> À propos
                  </h4>
                  <div className="relative">
                     <div className={`text-stone-600 text-sm leading-relaxed ${isLongDescription && !isDescriptionExpanded ? 'line-clamp-4' : ''}`}>
                        <div dangerouslySetInnerHTML={{ __html: game.description }} />
                     </div>

                     {/* Bouton seulement si nécessaire */}
                     {isLongDescription && (
                        <button
                           onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                           className="mt-3 text-xs font-bold text-amber-600 hover:text-amber-700 uppercase tracking-widest flex items-center gap-1 group"
                        >
                           {isDescriptionExpanded ? 'Réduire le parchemin' : 'Dérouler le parchemin'}
                           <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 transition-transform duration-300 ${isDescriptionExpanded ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                     )}
                  </div>
               </div>

               {/* 3. FOOTER : GRIMOIRE */}
               <div className="bg-stone-100 rounded-2xl p-5 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-center sm:text-left">
                     {/* Icône Livre Magique (SVG) */}
                     <div className="w-12 h-12 rounded-full bg-white border border-stone-200 flex items-center justify-center text-amber-600 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                           <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                     </div>
                     <div>
                        <h5 className="font-serif font-bold text-stone-900 text-lg">Grimoire du Jeu</h5>
                        <p className="text-xs text-stone-500 font-medium">Statistiques avancées, courbes et timeline.</p>
                     </div>
                  </div>

                  <button
                     disabled
                     className="px-5 py-3 bg-stone-800 text-amber-50 rounded-xl text-xs font-bold uppercase tracking-widest opacity-60 cursor-not-allowed flex items-center gap-2 shadow-sm"
                     title="Fonctionnalité à venir"
                  >
                     Ouvrir le Grimoire
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
               </div>

               <div className="mt-6 text-center">
                  <a
                     href={`https://boardgamegeek.com/boardgame/${game.bgg_id}`}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-[10px] text-stone-400 hover:text-amber-600 transition-colors uppercase tracking-widest inline-flex items-center gap-1.5"
                  >
                     Fiche BoardGameGeek
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </a>
               </div>

            </div>
         </div>
      </div>
   );
}
