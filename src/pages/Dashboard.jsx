import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Ajouté pour la navigation
import { useChallenge } from '../hooks/useChallenge';

// Composants
import DashboardHeader from '../components/DashboardHeader';
import ChallengeProgress from '../components/ChallengeProgress';
import GameCard from '../components/GameCard';
import Toast from '../components/Toast';

// Modales Premium
import AddGameModal from '../components/AddGameModal';
import GameDetailsModal from '../components/GamedetailsModal';
import DeleteGameModal from '../components/DeleteGameModal';
import AddPlayModal from '../components/AddPlayModal';
import GameHistoryModal from '../components/GameHistoryModal';

export default function Dashboard() {
   const navigate = useNavigate(); // Hook de navigation

   // --- ÉTATS ---
   const [isAddModalOpen, setIsAddModalOpen] = useState(false);

   // États de sélection pour les modales
   const [selectedGame, setSelectedGame] = useState(null);
   const [gameToDelete, setGameToDelete] = useState(null);

   // Configuration des modales d'action
   const [playModalConfig, setPlayModalConfig] = useState(null);
   const [historyModalConfig, setHistoryModalConfig] = useState(null);
   const [playToEdit, setPlayToEdit] = useState(null);

   // Toast System
   const [toast, setToast] = useState(null);

   // --- DONNÉES ---
   const {
      items, loading, addGame, removeGame, existingBggIds,
      deletePlay, getHistory, refreshGameProgress, updateProgress
   } = useChallenge();

   // --- CALCULS DU HEADER ---
   const totalGames = items.length;
   const totalPlays = items.reduce((acc, item) => acc + (item.progress || 0), 0);
   const isChallengeFull = totalGames >= 10;

   const showToast = (message, type = 'success') => setToast({ message, type });

   const handleAddGame = async (game) => {
      const result = await addGame(game);
      if (result.success) {
         setIsAddModalOpen(false);
         showToast(`"${game.name}" a rejoint le challenge !`);
      } else {
         showToast(result.message, 'error');
      }
   };

   const handleRequestRemove = (gameId, gameName) => {
      setGameToDelete({ id: gameId, name: gameName });
   };

   const confirmRemove = async () => {
      if (gameToDelete) {
         const result = await removeGame(gameToDelete.id);
         if (result && result.success) {
            showToast(`"${gameToDelete.name}" a été retiré.`, 'success');
         } else {
            showToast("Erreur lors de la suppression.", 'error');
         }
         setGameToDelete(null);
      }
   };

   const handleRequestAddPlay = (gameItem, targetLevel, showHistory = false) => {
      if (showHistory) {
         setHistoryModalConfig({ game: gameItem.game });
      } else {
         setPlayToEdit(null);
         setPlayModalConfig({ gameItem, targetLevel });
      }
   };

   const handleRequestEditFromHistory = (play) => {
      const currentGame = historyModalConfig.game;
      setHistoryModalConfig(null);
      setPlayToEdit(play);
      setPlayModalConfig({
         gameItem: { game: currentGame, game_id: currentGame.id },
         targetLevel: null
      });
   };

   const handlePlayAdded = async () => {
      if (playModalConfig?.gameItem) {
         await refreshGameProgress(playModalConfig.gameItem.game_id);
      } else {
         await updateProgress();
      }
      setPlayModalConfig(null);
      setPlayToEdit(null);
   };

   if (loading) {
      return (
         <div className="flex-1 flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
               <div className="animate-spin rounded-full h-12 w-12 border-4 border-stone-200 border-t-amber-600"></div>
               <span className="text-stone-400 font-serif italic animate-pulse">Chargement du grimoire...</span>
            </div>
         </div>
      );
   }

   return (
      <div className="flex-1 flex flex-col w-full max-w-[90rem] mx-auto px-4 md:px-8 py-8">
         {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

         <main className="w-full flex-grow space-y-8">
            <div className="space-y-6">

               {/* EN-TÊTE AVEC NAVIGATION STATS */}
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
                  <div>
                     <h1 className="text-4xl md:text-5xl font-serif font-black text-stone-800 mb-2">
                        Mon Grimoire Ludique
                     </h1>
                     <p className="text-stone-500 font-serif italic">
                        Challenge 10x10 • Édition {new Date().getFullYear()}
                     </p>
                  </div>
               </div>

               <DashboardHeader
                  totalGames={totalGames}
                  totalPlays={totalPlays}
                  isChallengeFull={isChallengeFull}
               />
               <ChallengeProgress totalPlays={totalPlays} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 relative z-0 mb-12">
               {items.map((item) => (
                  <GameCard
                     key={item.game_id}
                     item={item}
                     gameInfo={{
                        ...item.game,
                        image: item.game.image_url || item.game.thumbnail_url
                     }}
                     onClickDetails={setSelectedGame}
                     onRemove={() => handleRequestRemove(item.game_id, item.game.name)}
                     onRequestAddPlay={handleRequestAddPlay}
                     onOpenHistory={() => handleRequestAddPlay(item, null, true)}
                  />
               ))}

               {!isChallengeFull && Array.from({ length: Math.max(0, 10 - items.length) }).map((_, index) => (
                  <button
                     key={`empty-${index}`}
                     onClick={() => setIsAddModalOpen(true)}
                     className="group relative aspect-[3/4] w-full rounded-2xl flex flex-col items-center justify-center p-6 transition-all duration-300
                        bg-stone-100/50 border-2 border-dashed border-stone-300/60
                        hover:bg-white hover:border-amber-400 hover:shadow-lg hover:scale-[1.02]"
                  >
                     <div className="w-16 h-16 rounded-full bg-white border-2 border-stone-200 text-stone-300 flex items-center justify-center mb-4 group-hover:bg-amber-50 group-hover:border-amber-300 group-hover:text-amber-500 transition-all duration-500 shadow-sm group-hover:rotate-90">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                           <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                     </div>
                     <span className="text-[10px] font-black text-stone-400 group-hover:text-stone-600 uppercase tracking-widest transition-colors">
                        Emplacement Libre
                     </span>
                  </button>
               ))}
            </div>
         </main>

         <AddGameModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAddGame={handleAddGame}
            existingIds={existingBggIds}
         />
         <GameDetailsModal
            isOpen={!!selectedGame}
            game={selectedGame}
            onClose={() => setSelectedGame(null)}
         />
         <DeleteGameModal
            isOpen={!!gameToDelete}
            game={gameToDelete}
            onClose={() => setGameToDelete(null)}
            onConfirm={confirmRemove}
         />
         {historyModalConfig && (
            <GameHistoryModal
               isOpen={!!historyModalConfig}
               game={historyModalConfig.game}
               onClose={() => setHistoryModalConfig(null)}
               onEditPlay={handleRequestEditFromHistory}
               deletePlay={deletePlay}
               getHistory={getHistory}
               showToast={showToast}
            />
         )}
         {playModalConfig && (
            <AddPlayModal
               isOpen={!!playModalConfig}
               game={playModalConfig.gameItem.game}
               targetProgress={playModalConfig.targetLevel}
               playToEdit={playToEdit}
               onClose={() => { setPlayModalConfig(null); setPlayToEdit(null); }}
               onPlayAdded={handlePlayAdded}
               showToast={showToast}
            />
         )}
      </div>
   );
}
