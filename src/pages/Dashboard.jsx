import { useState } from 'react';
import { useChallenge } from '../hooks/useChallenge';
// Composants UI Découpés
import DashboardHeader from '../components/DashboardHeader';
import ChallengeProgress from '../components/ChallengeProgress';
import GameCard from '../components/GameCard';
import Toast from '../components/Toast';
import Footer from '../components/Footer'; // <--- NOUVEAU

// Modales
import AddGameModal from '../components/AddGameModal';
import GameDetailsModal from '../components/GameDetailsModal';
import DeleteGameModal from '../components/DeleteGameModal';
import AddPlayModal from '../components/AddPlayModal';
import GameHistoryModal from '../components/GameHistoryModal';

export default function Dashboard() {
   // --- ÉTATS ---
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [selectedGame, setSelectedGame] = useState(null);
   const [gameToDelete, setGameToDelete] = useState(null);
   const [playModalConfig, setPlayModalConfig] = useState(null);
   const [historyModalConfig, setHistoryModalConfig] = useState(null);
   const [playToEdit, setPlayToEdit] = useState(null);
   const [toast, setToast] = useState(null);

   // --- DONNÉES ---
   const {
      items, loading, addGame, removeGame, existingBggIds,
      deletePlay, getHistory, refreshGameProgress, updateProgress
   } = useChallenge();

   const totalGames = items.length;
   const totalPlays = items.reduce((acc, item) => acc + (item.progress || 0), 0);
   const isChallengeFull = totalGames >= 10;

   // --- ACTIONS ---
   const showToast = (message, type = 'success') => setToast({ message, type });

   const handleAddGame = async (game) => {
      const result = await addGame(game);
      if (result.success) {
         setIsModalOpen(false);
         showToast(`"${game.name}" a rejoint votre collection !`);
      } else {
         showToast(result.message, 'error');
      }
   };

   const handleRequestRemove = (gameId, gameName) => setGameToDelete({ id: gameId, name: gameName });

   const confirmRemove = async () => {
      if (gameToDelete) {
         await removeGame(gameToDelete.id);
         showToast(`"${gameToDelete.name}" a été retiré.`, 'success');
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
      setPlayToEdit(play);
      setPlayModalConfig({ gameItem: { game: currentGame }, targetLevel: null });
      setHistoryModalConfig(null);
   };

   const handlePlayAdded = async () => {
      if (playModalConfig?.gameItem) {
         await refreshGameProgress(playModalConfig.gameItem.game_id);
      } else {
         await updateProgress(null, null);
      }
      setPlayModalConfig(null);
      setPlayToEdit(null);
   };

   if (loading) {
      return (
         <div className="min-h-screen bg-paper-texture flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-stone-200 border-t-amber-600"></div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-paper-texture font-sans text-stone-800 flex flex-col relative">

         {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

         <main className="flex-1 max-w-[90rem] mx-auto px-4 py-8 w-full">

            <DashboardHeader
               totalGames={totalGames}
               totalPlays={totalPlays}
               isChallengeFull={isChallengeFull}
            />

            <ChallengeProgress totalPlays={totalPlays} />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 relative z-0">
               {items.map((item) => (
                  <GameCard
                     key={item.game_id}
                     item={item}
                     gameInfo={item.game}
                     onRemove={() => handleRequestRemove(item.game_id, item.game.name)}
                     onClickDetails={setSelectedGame}
                     onRequestAddPlay={handleRequestAddPlay}
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

         {/* Ajout du Footer ici */}
         <Footer />

         {/* --- MODALES --- */}
         <AddGameModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddGame} existingIds={existingBggIds} />
         {selectedGame && (<GameDetailsModal game={selectedGame} onClose={() => setSelectedGame(null)} />)}
         <DeleteGameModal isOpen={!!gameToDelete} game={gameToDelete} onClose={() => setGameToDelete(null)} onConfirm={confirmRemove} />

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
