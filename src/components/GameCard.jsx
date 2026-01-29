// 🎨 PALETTE "10 JOUEURS - ÉDITION BOIS"
const MEEPLE_COLORS = {
   red: '#b91c1c', blue: '#1e40af', green: '#15803d', yellow: '#ca8a04',
   black: '#1f2937', gray: '#4b5563', purple: '#7e22ce', orange: '#c2410c',
   brown: '#78350f', teal: '#0f766e'
};

const MEEPLE_PATH = "M256 54.99c-27 0-46.418 14.287-57.633 32.23-10.03 16.047-14.203 34.66-15.017 50.962-30.608 15.135-64.515 30.394-91.815 45.994-14.32 8.183-26.805 16.414-36.203 25.26C45.934 218.28 39 228.24 39 239.99c0 5 2.44 9.075 5.19 12.065 2.754 2.99 6.054 5.312 9.812 7.48 7.515 4.336 16.99 7.95 27.412 11.076 15.483 4.646 32.823 8.1 47.9 9.577-14.996 25.84-34.953 49.574-52.447 72.315C56.65 378.785 39 403.99 39 431.99c0 4-.044 7.123.31 10.26.355 3.137 1.256 7.053 4.41 10.156 3.155 3.104 7.017 3.938 10.163 4.28 3.146.345 6.315.304 10.38.304h111.542c8.097 0 14.026.492 20.125-3.43 6.1-3.92 8.324-9.275 12.67-17.275l.088-.16.08-.166s9.723-19.77 21.324-39.388c5.8-9.808 12.097-19.576 17.574-26.498 2.74-3.46 5.304-6.204 7.15-7.754.564-.472.82-.56 1.184-.76.363.2.62.288 1.184.76 1.846 1.55 4.41 4.294 7.15 7.754 5.477 6.922 11.774 16.69 17.574 26.498 11.6 19.618 21.324 39.387 21.324 39.387l.08.165.088.16c4.346 8 6.55 13.323 12.61 17.254 6.058 3.93 11.974 3.45 19.957 3.45H448c4 0 7.12.043 10.244-.304 3.123-.347 6.998-1.21 10.12-4.332 3.12-3.122 3.984-6.997 4.33-10.12.348-3.122.306-6.244.306-10.244 0-28-17.65-53.205-37.867-79.488-17.493-22.74-37.45-46.474-52.447-72.315 15.077-1.478 32.417-4.93 47.9-9.576 10.422-3.125 19.897-6.74 27.412-11.075 3.758-2.168 7.058-4.49 9.81-7.48 2.753-2.99 5.192-7.065 5.192-12.065 0-11.75-6.934-21.71-16.332-30.554-9.398-8.846-21.883-17.077-36.203-25.26-27.3-15.6-61.207-30.86-91.815-45.994-.814-16.3-4.988-34.915-15.017-50.96C302.418 69.276 283 54.99 256 54.99z";

export default function GameCard({ item, gameInfo, onRemove, onClickDetails, onRequestAddPlay, onOpenHistory }) {
   const playsCount = item.progress || 0;
   const meepleColor = item.meeple_color || 'red';
   const activeColor = MEEPLE_COLORS[meepleColor] || MEEPLE_COLORS.red;

   const handleAddClick = (e) => {
      e.stopPropagation();
      onRequestAddPlay(item, playsCount + 1);
   };

   // --- COULEUR DYNAMIQUE (ROUGE -> VERT) ---
   const getProgressColor = () => {
      if (playsCount >= 10) return 'text-emerald-600';
      if (playsCount >= 7) return 'text-emerald-500';
      if (playsCount >= 4) return 'text-amber-500';
      return 'text-red-500'; // Démarrage en rouge
   };

   return (
      <div className="aspect-[3/4] w-full bg-white rounded-2xl shadow-lg ring-1 ring-black/5 flex flex-col relative group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">

         {/* Bouton Supprimer */}
         <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="absolute top-2 right-2 z-40 p-2 bg-black/60 hover:bg-red-600 rounded-full text-white/90 hover:text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-lg transform scale-90 hover:scale-100"
            title="Retirer ce jeu"
         >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
               <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
         </button>

         {/* 1. ZONE IMAGE (55% Hauteur) */}
         <div
            className="h-[55%] relative cursor-pointer group/image bg-stone-900 overflow-hidden"
            onClick={() => onClickDetails(gameInfo)}
         >
            {gameInfo.thumbnail_url ? (
               <>
                  <img
                     src={gameInfo.image_url || gameInfo.thumbnail_url}
                     alt={gameInfo.name}
                     className="w-full h-full object-cover object-top transition-transform duration-700 group-hover/image:scale-105"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent pt-8 pb-3 px-4">
                     <h3 className="text-white font-serif font-black text-lg leading-tight line-clamp-1 mb-1 drop-shadow-sm">
                        {gameInfo.name}
                     </h3>
                     <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 uppercase tracking-widest group-hover/image:text-amber-300 transition-colors">
                        Voir la fiche
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                     </span>
                  </div>
               </>
            ) : (
               <div className="w-full h-full bg-stone-800 flex items-center justify-center">
                  <span className="text-4xl">🎲</span>
               </div>
            )}
         </div>

         {/* 2. ZONE CONTENU (45% Hauteur - Fond Blanc) */}
         <div className="flex-1 flex flex-col px-4 py-3 bg-white relative">

            {/* BARRE D'ACTION (MODIFIÉE : Juste les chiffres colorés) */}
            <div className="flex justify-between items-end mb-3 pb-2 border-b border-stone-100">

               {/* SCORE : Coloration Dynamique */}
               <div className="flex flex-col">
                  <span className="text-[9px] font-black text-stone-400 uppercase tracking-[0.2em] mb-1">Maîtrise</span>

                  {/* Chiffre qui change de couleur selon la progression */}
                  <div className="flex items-baseline gap-1">
                     <span className={`text-2xl font-serif font-black leading-none transition-colors duration-500 ${getProgressColor()}`}>
                        {playsCount}
                     </span>
                     <span className="text-stone-300 text-xs font-bold">/10</span>
                  </div>
               </div>

               {/* DUO DE BOUTONS "IVOIRE" */}
               <div className="flex items-center gap-2">
                  {/* Bouton Historique (Style Ivoire) */}
                  <button
                     onClick={(e) => { e.stopPropagation(); onOpenHistory(item); }}
                     className="flex items-center justify-center w-9 h-9 bg-white border border-stone-200/80 rounded-xl shadow-sm hover:border-amber-400 hover:text-amber-700 hover:shadow-md transition-all text-stone-400 group/hist"
                     title="Consulter l'historique"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                  </button>

                  {/* Bouton Ajout (+1 Dé Vectoriel) */}
                  <button
                     onClick={handleAddClick}
                     className="flex items-center gap-2 px-3 py-2 bg-white border border-stone-200/80 rounded-xl shadow-sm hover:border-amber-400 hover:text-amber-700 hover:shadow-md active:scale-95 transition-all group/dice cursor-pointer"
                     title="Ajouter une maîtrise"
                  >
                     <div className="w-4 h-4 text-amber-600 group-hover/dice:rotate-12 transition-transform">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                           <rect x="3" y="3" width="18" height="18" rx="3.5" />
                           <circle cx="8.5" cy="8.5" r="1.2" fill="currentColor" />
                           <circle cx="15.5" cy="15.5" r="1.2" fill="currentColor" />
                        </svg>
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-stone-500 group-hover/dice:text-amber-700">+1</span>
                  </button>
               </div>
            </div>

            {/* GRILLE MEEPLES (INCHANGÉE) */}
            <div className="flex-1 bg-stone-100 w-full rounded-xl p-3 shadow-inner grid grid-cols-5 gap-3 border border-stone-200/50 content-center">
               {Array.from({ length: 10 }).map((_, index) => {
                  const boxNumber = index + 1;
                  const isFilled = boxNumber <= playsCount;

                  return (
                     <button
                        key={boxNumber}
                        onClick={(e) => {
                           e.stopPropagation();
                           if (!isFilled) handleAddClick(e);
                           else onOpenHistory(item);
                        }}
                        className={`
                           aspect-square rounded-lg flex items-center justify-center relative transition-all duration-300 focus:outline-none group/meeple
                           ${isFilled
                              ? 'bg-white shadow-md border border-stone-100 scale-105 z-10 ring-1 ring-black/5 cursor-pointer hover:border-amber-200'
                              : 'bg-stone-200/50 shadow-sm hover:bg-amber-100/50 cursor-pointer hover:scale-105 hover:border hover:border-amber-200/50'
                           }
                        `}
                        title={isFilled ? "Gérer (Historique)" : "Ajouter une partie"}
                     >
                        {!isFilled && (
                           <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/meeple:opacity-100 text-amber-600 z-20 transition-opacity">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                           </span>
                        )}

                        <svg
                           viewBox="0 0 512 512"
                           className={`w-full h-full p-0.5 transition-all duration-300 ease-out 
                              ${!isFilled ? 'group-hover/meeple:opacity-20' : ''} 
                           `}
                           style={{
                              fill: isFilled ? activeColor : 'rgba(0, 0, 0, 0.1)',
                              filter: isFilled ? 'drop-shadow(0px 1px 2px rgba(0,0,0,0.3))' : 'none'
                           }}
                        >
                           <path d={MEEPLE_PATH} transform="scale(0.95) translate(13, 13)" />
                        </svg>
                     </button>
                  );
               })}
            </div>

         </div>
      </div>
   );
}
