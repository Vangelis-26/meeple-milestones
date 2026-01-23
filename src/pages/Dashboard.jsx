import { useState } from 'react';
import { useChallenge } from '../hooks/useChallenge';
import AddGameModal from '../components/AddGameModal';

export default function Dashboard() {
   const [isModalOpen, setIsModalOpen] = useState(false);

   // On utilise ton hook STABLE tel quel
   const {
      items,
      loading,
      addGame,
      updateProgress,
      removeGame,
      existingBggIds
   } = useChallenge();

   // Calculs des stats
   const totalGames = items.length;
   const totalPlays = items.reduce((acc, item) => acc + (item.progress || 0), 0);
   const targetGlobal = 100;
   const progressPercentage = Math.min((totalPlays / targetGlobal) * 100, 100);

   const handleAddGame = async (game) => {
      const result = await addGame(game);
      if (result.success) setIsModalOpen(false);
      else alert(result.message);
   };

   const handleRemoveGame = (gameId, gameName) => {
      if (window.confirm(`Retirer "${gameName}" du challenge ?`)) {
         removeGame(gameId);
      }
   };

   if (loading) {
      return (
         <div className="min-h-screen bg-paper-texture flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-stone-200 border-t-amber-600"></div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-paper-texture font-sans text-stone-800 flex flex-col pb-24 relative">
         <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
            {/* Header & Stats */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
               <div className="text-center md:text-left">
                  <h1 className="text-4xl font-serif font-extrabold text-amber-900 tracking-tight">Mon Challenge</h1>
                  <p className="text-stone-500 font-medium mt-1">Tableau de bord 2026</p>
               </div>
               {/* Widget Stats */}
               <div className="bg-white border border-stone-200 rounded-xl shadow-sm px-4 py-2 flex items-center gap-4">
                  <div><span className="font-bold text-xl">{totalGames}/10</span> <span className="text-xs text-stone-500 uppercase">Jeux</span></div>
                  <span className="text-stone-300">&times;</span>
                  <div><span className="font-bold text-xl text-amber-700">{totalPlays}/100</span> <span className="text-xs text-amber-600 uppercase">Parties</span></div>
               </div>
            </div>

            {/* Barre de progression */}
            <div className="mb-12 bg-white/50 p-6 rounded-2xl border border-stone-200/60 shadow-sm">
               <div className="h-4 w-full bg-stone-200 rounded-full overflow-hidden shadow-inner border border-stone-300 relative">
                  <div className="h-full bg-gradient-to-r from-stone-400 via-amber-500 to-amber-700 transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
               </div>
               <p className="text-center text-sm text-stone-500 mt-2 font-serif italic">{Math.max(0, 100 - totalPlays)} parties restantes !</p>
            </div>

            {/* GRILLE DES JEUX */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
               {items.map((item) => {
                  // ADAPTATION CRUCIALE : Ton hook renvoie l'objet game imbriqué
                  const gameInfo = item.game;

                  return (
                     <GameCard
                        key={item.game_id}
                        item={item} // On passe l'item entier (qui contient progress et game)
                        gameInfo={gameInfo}
                        onUpdateProgress={updateProgress}
                        onRemove={() => handleRemoveGame(item.game_id, gameInfo.name)}
                     />
                  );
               })}

               {/* Slots vides */}
               {Array.from({ length: Math.max(0, 10 - items.length) }).map((_, index) => (
                  <button key={`empty-${index}`} onClick={() => setIsModalOpen(true)}
                     className="group bg-stone-50 border-2 border-dashed border-stone-300 rounded-xl aspect-[3/4] flex flex-col items-center justify-center p-6 hover:border-amber-400 hover:bg-white transition-all">
                     <div className="w-16 h-16 rounded-2xl bg-white border-2 border-stone-100 text-stone-300 flex items-center justify-center mb-4 group-hover:border-amber-200 group-hover:text-amber-500">
                        <span className="text-3xl">+</span>
                     </div>
                     <span className="text-sm font-bold text-stone-500 group-hover:text-amber-700 uppercase">Ajouter un jeu</span>
                  </button>
               ))}
            </div>
         </main>

         {/* FAB */}
         <button onClick={() => setIsModalOpen(true)} className="fixed bottom-8 right-8 z-40 bg-amber-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-all border-2 border-amber-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
         </button>

         <AddGameModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddGame} existingIds={existingBggIds} />
      </div>
   );
}

// --- Carte Jeu (Design "Catan") ---
function GameCard({ item, gameInfo, onUpdateProgress, onRemove }) {
   const playsCount = item.progress;
   const meepleColor = item.meeple_color || 'red'; // Récupéré depuis ton ancien hook

   // Map des couleurs Tailwind pour les meeples
   const colorMap = {
      red: 'fill-red-600',
      yellow: 'fill-yellow-500',
      teal: 'fill-teal-500',
      blue: 'fill-blue-600',
      purple: 'fill-purple-600',
      orange: 'fill-orange-500',
      green: 'fill-green-600'
   };
   const fillColor = colorMap[meepleColor] || 'fill-amber-600';

   return (
      <div className="bg-white border border-stone-200 rounded-xl shadow-md overflow-hidden flex flex-col relative group hover:shadow-xl transition-all">
         <button onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="absolute top-2 right-2 z-20 p-2 bg-white rounded-full text-stone-400 hover:text-red-600 hover:bg-red-50 shadow-md opacity-0 group-hover:opacity-100 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
         </button>

         <div className="h-28 bg-stone-100 relative border-b border-stone-100">
            {gameInfo.thumbnail_url ? (
               <img src={gameInfo.thumbnail_url} alt={gameInfo.name} className="w-full h-full object-cover" />
            ) : (
               <div className="w-full h-full flex items-center justify-center text-stone-300 bg-stone-200"><span className="text-3xl">🎲</span></div>
            )}
            <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black/20 to-transparent"></div>
         </div>

         <div className="p-4 flex-1 flex flex-col">
            <div className="mb-3">
               <h3 className="text-stone-900 font-bold font-serif text-lg leading-tight line-clamp-1" title={gameInfo.name}>{gameInfo.name}</h3>
            </div>

            <div className="flex justify-between items-baseline mb-2 pb-2 border-b border-stone-100">
               <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Progression</span>
               <span className={`text-lg font-black font-serif ${playsCount === 10 ? 'text-green-600' : 'text-stone-700'}`}>
                  {playsCount}<span className="text-stone-400 text-sm font-normal">/10</span>
               </span>
            </div>

            <div className="bg-stone-100/50 rounded-lg p-2 inner-shadow grid grid-cols-5 gap-2">
               {Array.from({ length: 10 }).map((_, i) => {
                  const isFilled = i < playsCount;
                  return (
                     <button key={i} className={`aspect-square rounded-full flex items-center justify-center relative transition-all duration-300 focus:outline-none ${!isFilled ? 'bg-stone-200 shadow-inner' : ''}`}
                        onClick={() => i === playsCount && onUpdateProgress(item.game_id, playsCount + 1)}>
                        <svg viewBox="0 0 512 512" className={`w-4 h-4 transition-all duration-300 ${isFilled ? `${fillColor} drop-shadow-sm scale-110 -translate-y-0.5` : 'fill-stone-500 opacity-30 scale-90'}`}>
                           <path d="M416 192c0-53-43-96-96-96h-64V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v32h-64c-53 0-96 43-96 96c0 36.6 20.6 68.3 50.9 85.1C91.4 300.9 96 325.8 96 352c0 17.7 14.3 32 32 32h192c17.7 0 32-14.3 32-32c0-26.2 4.6-51.1 13.1-74.9c30.3-16.8 50.9-48.5 50.9-85.1z" />
                        </svg>
                     </button>
                  );
               })}
            </div>
         </div>
      </div>
   );
}
