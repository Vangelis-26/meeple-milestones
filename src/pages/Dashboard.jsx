import { useState } from 'react';
import { useChallenge } from '../hooks/useChallenge';
import AddGameModal from '../components/AddGameModal';
import GameCard from '../components/GameCard';
import GameDetailsModal from '../components/GameDetailsModal';
import DeleteGameModal from '../components/DeleteGameModal'; // <--- NOUVEL IMPORT

export default function Dashboard() {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [selectedGame, setSelectedGame] = useState(null);
   const [gameToDelete, setGameToDelete] = useState(null); // <--- NOUVEL ÉTAT

   const { items, loading, addGame, updateProgress, removeGame, existingBggIds } = useChallenge();

   const totalGames = items.length;
   const totalPlays = items.reduce((acc, item) => acc + (item.progress || 0), 0);
   const targetGlobal = 100;

   // LIMITE DU CHALLENGE : 10 JEUX MAX
   const isChallengeFull = totalGames >= 10;

   const progressPercentageTxt = Math.round(Math.min((totalPlays / targetGlobal) * 100, 100));
   const progressPercentageWidth = Math.min((totalPlays / targetGlobal) * 100, 100);
   const remainingPlays = Math.max(0, 100 - totalPlays);

   const handleAddGame = async (game) => {
      const result = await addGame(game);
      if (result.success) setIsModalOpen(false);
      else alert(result.message);
   };

   // Au clic sur la poubelle, on OUVRE la modale (on ne supprime pas direct)
   const handleRequestRemove = (gameId, gameName) => {
      setGameToDelete({ id: gameId, name: gameName });
   };

   // C'est ici qu'on supprime vraiment, après confirmation
   const confirmRemove = async () => {
      if (gameToDelete) {
         await removeGame(gameToDelete.id);
         setGameToDelete(null); // On ferme la modale
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
         <main className="flex-1 max-w-[90rem] mx-auto px-4 py-8 w-full">

            {/* Header & Stats */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
               <div className="text-center md:text-left">
                  <h1 className="text-4xl font-serif font-extrabold text-amber-900 tracking-tight">Mon Challenge</h1>
                  <p className="text-stone-500 font-medium mt-1">Tableau de bord 2026</p>
               </div>

               {/* Widget Stats */}
               <div className="bg-white border border-stone-200 rounded-xl shadow-sm px-6 py-3 flex items-center gap-6">
                  <div className="flex flex-col items-center">
                     <span className={`font-bold text-xl leading-none ${isChallengeFull ? 'text-green-600' : ''}`}>
                        {totalGames}/10
                     </span>
                     <span className="text-[10px] text-stone-500 uppercase font-bold tracking-wider mt-1">Jeux</span>
                  </div>
                  <div className="h-8 w-px bg-stone-300"></div>
                  <div className="flex flex-col items-center">
                     <span className="font-bold text-xl text-amber-700 leading-none">{totalPlays}/100</span>
                     <span className="text-[10px] text-amber-600 uppercase font-bold tracking-wider mt-1">Parties</span>
                  </div>
               </div>
            </div>

            {/* BARRE DE PROGRESSION STICKY */}
            <div className="sticky top-20 z-30 mb-12 bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-stone-200/60 shadow-md transition-all">
               <div className="h-5 w-full bg-stone-200/80 rounded-full overflow-hidden relative shadow-inner border border-stone-300/50">
                  <div className="h-full bg-gradient-to-r from-red-700 via-amber-500 to-green-700 transition-all duration-1000 relative" style={{ width: `${progressPercentageWidth}%` }}>
                     <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20"></div>
                  </div>
                  <div className="absolute inset-0 flex justify-evenly pointer-events-none">
                     {[...Array(9)].map((_, i) => (
                        <div key={i} className="w-[1px] h-full bg-white/60"></div>
                     ))}
                  </div>
               </div>
               <div className="flex justify-between text-sm font-bold uppercase tracking-wider mt-2 px-1">
                  <span className="text-stone-500">{progressPercentageTxt}%</span>
                  <span className="text-green-700 font-medium italic normal-case">
                     {remainingPlays > 0 ? `${remainingPlays} parties restantes !` : "Objectif atteint ! 🎉"}
                  </span>
               </div>
            </div>

            {/* GRILLE RESPONSIVE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 relative z-0">

               {items.map((item) => (
                  <GameCard
                     key={item.game_id}
                     item={item}
                     gameInfo={item.game}
                     onUpdateProgress={updateProgress}
                     // On appelle handleRequestRemove au lieu de removeGame direct
                     onRemove={() => handleRequestRemove(item.game_id, item.game.name)}
                     onClickDetails={setSelectedGame}
                  />
               ))}

               {!isChallengeFull && Array.from({ length: Math.max(0, 10 - items.length) }).map((_, index) => (
                  <button key={`empty-${index}`} onClick={() => setIsModalOpen(true)}
                     className="group bg-stone-50/50 border-2 border-dashed border-stone-300 rounded-xl aspect-[3/4] flex flex-col items-center justify-center p-6 hover:border-amber-400 hover:bg-white transition-all w-full relative overflow-hidden">
                     <div className="absolute inset-0 bg-amber-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                     <div className="relative z-10 flex flex-col items-center">
                        <div className="w-14 h-14 rounded-full bg-white border-2 border-stone-200 text-stone-300 flex items-center justify-center mb-3 group-hover:border-amber-200 group-hover:text-amber-500 group-hover:scale-110 transition-all shadow-sm">
                           <span className="text-3xl pb-1 leading-none">+</span>
                        </div>
                        <span className="text-xs font-bold text-stone-400 group-hover:text-amber-700 uppercase tracking-widest transition-colors">Ajouter un jeu</span>
                     </div>
                  </button>
               ))}
            </div>
         </main>

         {/* MODALES */}
         <AddGameModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddGame} existingIds={existingBggIds} />

         {selectedGame && (
            <GameDetailsModal
               game={selectedGame}
               onClose={() => setSelectedGame(null)}
            />
         )}

         {/* Modale de Suppression */}
         <DeleteGameModal
            isOpen={!!gameToDelete}
            game={gameToDelete}
            onClose={() => setGameToDelete(null)}
            onConfirm={confirmRemove}
         />

      </div>
   );
}
