// 🎨 PALETTE "10 JOUEURS - ÉDITION BOIS"
const MEEPLE_COLORS = {
   red: '#b91c1c',    // Rouge Brique 
   blue: '#1e40af',   // Bleu Roi 
   green: '#15803d',  // Vert Forêt 
   yellow: '#ca8a04', // Jaune Moutarde 
   black: '#1f2937',  // Noir Charbon
   gray: '#4b5563',   // Gris Pierre 
   purple: '#7e22ce', // Violet Impérial
   orange: '#c2410c', // Orange Terre Cuite
   brown: '#78350f',  // Marron Chêne
   teal: '#0f766e'    // Bleu Pétrole 
};

// Tracé SVG officiel du Meeple
const MEEPLE_PATH = "M256 54.99c-27 0-46.418 14.287-57.633 32.23-10.03 16.047-14.203 34.66-15.017 50.962-30.608 15.135-64.515 30.394-91.815 45.994-14.32 8.183-26.805 16.414-36.203 25.26C45.934 218.28 39 228.24 39 239.99c0 5 2.44 9.075 5.19 12.065 2.754 2.99 6.054 5.312 9.812 7.48 7.515 4.336 16.99 7.95 27.412 11.076 15.483 4.646 32.823 8.1 47.9 9.577-14.996 25.84-34.953 49.574-52.447 72.315C56.65 378.785 39 403.99 39 431.99c0 4-.044 7.123.31 10.26.355 3.137 1.256 7.053 4.41 10.156 3.155 3.104 7.017 3.938 10.163 4.28 3.146.345 6.315.304 10.38.304h111.542c8.097 0 14.026.492 20.125-3.43 6.1-3.92 8.324-9.275 12.67-17.275l.088-.16.08-.166s9.723-19.77 21.324-39.388c5.8-9.808 12.097-19.576 17.574-26.498 2.74-3.46 5.304-6.204 7.15-7.754.564-.472.82-.56 1.184-.76.363.2.62.288 1.184.76 1.846 1.55 4.41 4.294 7.15 7.754 5.477 6.922 11.774 16.69 17.574 26.498 11.6 19.618 21.324 39.387 21.324 39.387l.08.165.088.16c4.346 8 6.55 13.323 12.61 17.254 6.058 3.93 11.974 3.45 19.957 3.45H448c4 0 7.12.043 10.244-.304 3.123-.347 6.998-1.21 10.12-4.332 3.12-3.122 3.984-6.997 4.33-10.12.348-3.122.306-6.244.306-10.244 0-28-17.65-53.205-37.867-79.488-17.493-22.74-37.45-46.474-52.447-72.315 15.077-1.478 32.417-4.93 47.9-9.576 10.422-3.125 19.897-6.74 27.412-11.075 3.758-2.168 7.058-4.49 9.81-7.48 2.753-2.99 5.192-7.065 5.192-12.065 0-11.75-6.934-21.71-16.332-30.554-9.398-8.846-21.883-17.077-36.203-25.26-27.3-15.6-61.207-30.86-91.815-45.994-.814-16.3-4.988-34.915-15.017-50.96C302.418 69.276 283 54.99 256 54.99z";

export default function GameCard({ item, gameInfo, onUpdateProgress, onRemove, onClickDetails }) {
   const playsCount = item.progress || 0;
   const meepleColor = item.meeple_color || 'red';
   const activeColor = MEEPLE_COLORS[meepleColor] || MEEPLE_COLORS.red;

   return (
      <div className="aspect-[3/4] bg-white border border-stone-200 rounded-xl shadow-md overflow-hidden flex flex-col relative group hover:shadow-xl transition-all w-full">

         {/* Bouton Supprimer */}
         <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="absolute top-2 right-2 z-30 p-2 bg-black/40 hover:bg-red-600 rounded-full text-white/80 hover:text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
            title="Retirer ce jeu"
         >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
               <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
         </button>

         {/* 1. ZONE IMAGE HYBRIDE (Style BGG Hotness + Titre bas gauche) */}
         {/* h-[55%] : Légèrement réduit pour laisser la place aux GROS MEEPLES */}
         <div
            className="h-[55%] relative cursor-pointer group/image overflow-hidden"
            onClick={() => onClickDetails(gameInfo)}
         >
            {gameInfo.thumbnail_url ? (
               <>
                  <img
                     src={gameInfo.image_url || gameInfo.thumbnail_url}
                     alt={gameInfo.name}
                     className="w-full h-full object-cover object-top transition-transform duration-700 group-hover/image:scale-110"
                  />

                  {/* Dégradé sombre */}
                  <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-stone-900 via-stone-900/50 to-transparent opacity-90"></div>

                  {/* TITRE & LIEN */}
                  <div className="absolute bottom-0 left-0 p-3 w-full">
                     <h3 className="text-white font-bold font-serif text-lg leading-tight drop-shadow-md line-clamp-2">
                        {gameInfo.name}
                     </h3>

                     <div className="overflow-hidden h-0 group-hover/image:h-6 transition-all duration-300">
                        <span className="text-amber-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1 mt-1">
                           Voir détails &rarr;
                        </span>
                     </div>
                  </div>
               </>
            ) : (
               <div className="w-full h-full bg-stone-200 flex items-center justify-center">
                  <span className="text-4xl">🎲</span>
               </div>
            )}
         </div>

         {/* 2. ZONE PROGRESSION (RESTAURÉE EXACTEMENT COMME AVANT) */}
         <div className="flex-1 flex flex-col px-3 pb-3 pt-2 bg-stone-50">

            {/* Texte Progression */}
            <div className="flex justify-between items-end mb-1 px-1 mt-auto">
               <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Progression</span>
               <span className={`text-base font-black font-serif ${playsCount === 10 ? 'text-green-600' : 'text-stone-600'}`}>
                  {playsCount}<span className="text-stone-400 text-xs font-normal">/10</span>
               </span>
            </div>

            {/* PLATEAU GRIS & GROS MEEPLES (Réglages d'origine restaurés : w-9 h-9, gap-3, p-4) */}
            <div className="bg-stone-200 w-fit mx-auto rounded-xl p-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] grid grid-cols-5 gap-x-3 gap-y-4 border border-stone-300/50">
               {Array.from({ length: 10 }).map((_, index) => {
                  const boxNumber = index + 1;
                  const isFilled = boxNumber <= playsCount;

                  return (
                     <button
                        key={boxNumber}
                        onClick={() => {
                           const newProgress = (boxNumber === playsCount) ? boxNumber - 1 : boxNumber;
                           onUpdateProgress(item.game_id, newProgress);
                        }}
                        className={`
                           w-9 h-9 rounded-lg flex items-center justify-center relative transition-all duration-200 focus:outline-none
                           ${!isFilled
                              ? 'bg-stone-300/50 shadow-inner hover:bg-stone-300'
                              : 'bg-white shadow-md border border-stone-100 scale-110 z-10 ring-1 ring-black/5'
                           }
                        `}
                        title={isFilled ? "Annuler" : "Valider"}
                     >
                        <svg
                           viewBox="0 0 512 512"
                           className={`w-full h-full p-0.5 transition-all duration-300 ease-out`}
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
