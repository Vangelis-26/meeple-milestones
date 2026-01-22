import React from 'react';

// 🎨 Dictionnaire des couleurs (Style "Bois peint")
const MEEPLE_COLORS = {
   red: '#ef4444',    // Rouge vif
   blue: '#3b82f6',   // Bleu roi
   green: '#22c55e',  // Vert pré
   yellow: '#eab308', // Jaune moutarde
   purple: '#a855f7', // Violet
   orange: '#f97316', // Orange
   teal: '#14b8a6',   // Cyan
   gray: '#94a3b8'    // Gris par défaut
};

// 📐 La NOUVELLE forme du Meeple (Ton modèle SVG)
const MEEPLE_PATH = "M256 54.99c-27 0-46.418 14.287-57.633 32.23-10.03 16.047-14.203 34.66-15.017 50.962-30.608 15.135-64.515 30.394-91.815 45.994-14.32 8.183-26.805 16.414-36.203 25.26C45.934 218.28 39 228.24 39 239.99c0 5 2.44 9.075 5.19 12.065 2.754 2.99 6.054 5.312 9.812 7.48 7.515 4.336 16.99 7.95 27.412 11.076 15.483 4.646 32.823 8.1 47.9 9.577-14.996 25.84-34.953 49.574-52.447 72.315C56.65 378.785 39 403.99 39 431.99c0 4-.044 7.123.31 10.26.355 3.137 1.256 7.053 4.41 10.156 3.155 3.104 7.017 3.938 10.163 4.28 3.146.345 6.315.304 10.38.304h111.542c8.097 0 14.026.492 20.125-3.43 6.1-3.92 8.324-9.275 12.67-17.275l.088-.16.08-.166s9.723-19.77 21.324-39.388c5.8-9.808 12.097-19.576 17.574-26.498 2.74-3.46 5.304-6.204 7.15-7.754.564-.472.82-.56 1.184-.76.363.2.62.288 1.184.76 1.846 1.55 4.41 4.294 7.15 7.754 5.477 6.922 11.774 16.69 17.574 26.498 11.6 19.618 21.324 39.387 21.324 39.387l.08.165.088.16c4.346 8 6.55 13.323 12.61 17.254 6.058 3.93 11.974 3.45 19.957 3.45H448c4 0 7.12.043 10.244-.304 3.123-.347 6.998-1.21 10.12-4.332 3.12-3.122 3.984-6.997 4.33-10.12.348-3.122.306-6.244.306-10.244 0-28-17.65-53.205-37.867-79.488-17.493-22.74-37.45-46.474-52.447-72.315 15.077-1.478 32.417-4.93 47.9-9.576 10.422-3.125 19.897-6.74 27.412-11.075 3.758-2.168 7.058-4.49 9.81-7.48 2.753-2.99 5.192-7.065 5.192-12.065 0-11.75-6.934-21.71-16.332-30.554-9.398-8.846-21.883-17.077-36.203-25.26-27.3-15.6-61.207-30.86-91.815-45.994-.814-16.3-4.988-34.915-15.017-50.96C302.418 69.276 283 54.99 256 54.99z";

// ♟️ Composant MeepleSlot (Gère le trou ET le pion)
const MeepleSlot = ({ active, color, onClick, title }) => {
   return (
      <button
         onClick={onClick}
         title={title}
         className="group relative w-8 h-8 flex items-center justify-center focus:outline-none transition-transform active:scale-95"
      >
         <svg
            viewBox="0 0 512 512" // Mise à jour pour le nouveau SVG
            className={`
          w-full h-full transition-all duration-300 ease-out p-0.5
          ${active ? 'drop-shadow-[0_4px_3px_rgba(0,0,0,0.5)] hover:scale-110' : 'drop-shadow-none'}
        `}
            style={{
               // Actif = Couleur vive / Inactif = Ombre sombre ("Trou")
               fill: active ? (MEEPLE_COLORS[color] || MEEPLE_COLORS.blue) : 'rgba(60, 40, 20, 0.5)',
            }}
         >
            {/* Filtre d'ombre interne pour l'effet "creusé" (actif seulement quand vide) */}
            {!active && (
               <filter id="inset-shadow">
                  <feOffset dx="0" dy="4" />
                  <feGaussianBlur stdDeviation="8" result="offset-blur" />
                  <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
                  <feFlood floodColor="black" floodOpacity="0.7" result="color" />
                  <feComposite operator="in" in="color" in2="inverse" result="shadow" />
                  <feComposite operator="over" in="shadow" in2="SourceGraphic" />
               </filter>
            )}

            {/* Le tracé du Meeple */}
            <path
               d={MEEPLE_PATH}
               filter={!active ? "url(#inset-shadow)" : ""}
               // Petit ajustement pour que le meeple respire dans la case
               transform="scale(0.95) translate(13, 13)"
            />
         </svg>
      </button>
   );
};

export default function ChallengeGrid({ items, loading, onAddClick, onUpdateProgress }) {

   if (loading) return <div className="text-center py-12 text-gray-500 font-medium">Chargement de ton défi...</div>;

   if (items.length === 0) {
      return (
         <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 text-center">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-blue-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
               </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Ton challenge est vide</h3>
            <p className="text-gray-500 max-w-sm mb-8">Ajoute ton premier jeu pour commencer l'aventure.</p>
            <button onClick={onAddClick} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
               Ajouter un jeu maintenant
            </button>
         </div>
      );
   }

   return (
      <div className="mt-8">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (

               // 🪵 LA CARTE AVEC LE FOND BOIS RÉALISTE 🪵
               <div
                  key={item.game_id}
                  className="relative p-5 rounded-xl shadow-xl flex flex-col gap-5 overflow-hidden bg-[#d4c4a9] border-2 border-[#bfa88a]"
                  style={{
                     // L'image de texture bois que tu aimais
                     backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')`,
                     // Ombre interne
                     boxShadow: 'inset 0 0 20px rgba(0,0,0,0.15), 0 10px 15px -3px rgba(0,0,0,0.1)'
                  }}
               >

                  {/* Partie HAUTE : Image + Titre */}
                  <div className="flex items-center gap-4 relative z-10">
                     <div className="w-16 h-16 bg-yellow-900/10 rounded-lg flex items-center justify-center overflow-hidden shrink-0 border-2 border-[#a68f73]/60 shadow-sm">
                        {item.game.thumbnail_url ? (
                           <img src={item.game.thumbnail_url} alt={item.game.name} className="w-full h-full object-cover mix-blend-multiply" />
                        ) : (
                           <span className="text-xs font-bold text-yellow-900/30">IMG</span>
                        )}
                     </div>

                     <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-[#4a3b2a] text-lg leading-tight truncate drop-shadow-sm">{item.game.name}</h3>
                        <p className="text-xs text-[#7c6a56] mt-1 font-bold tracking-wide">
                           {item.progress === 10 ? '👑 DÉFI TERMINÉ !' : `${item.target - item.progress} parties restantes`}
                        </p>
                     </div>
                  </div>

                  {/* Partie BASSE : La piste de score (Trou ou Meeple) */}
                  {/* Rigole sombre */}
                  <div className="flex justify-between items-center px-2 py-2 bg-black/10 rounded-full border-b border-white/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]">
                     {Array.from({ length: 10 }).map((_, index) => {
                        const boxNumber = index + 1;
                        const isActive = boxNumber <= item.progress;

                        return (
                           <MeepleSlot
                              key={boxNumber}
                              active={isActive}
                              color={item.meeple_color}
                              title={isActive ? "Annuler cette partie" : "Valider cette partie"}
                              onClick={() => {
                                 const newProgress = (boxNumber === item.progress) ? boxNumber - 1 : boxNumber;
                                 onUpdateProgress(item.game_id, newProgress);
                              }}
                           />
                        );
                     })}
                  </div>

               </div>
            ))}
         </div>
      </div>
   );
}
