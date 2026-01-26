import { useState } from 'react';
import { useChallenge } from '../hooks/useChallenge';

// Composants
import DashboardHeader from '../components/DashboardHeader';
import ChallengeProgress from '../components/ChallengeProgress';
import GameCard from '../components/GameCard';
import Toast from '../components/Toast';

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
   const [gameToDelete, setGameToDelete] = useState(null); // { id, name }

   // Configuration des modales d'action
   const [playModalConfig, setPlayModalConfig] = useState(null);     // { gameItem, targetLevel }
   const [historyModalConfig, setHistoryModalConfig] = useState(null); // { game }
   const [playToEdit, setPlayToEdit] = useState(null);               // Pour modifier une partie existante

   const [toast, setToast] = useState(null);

   // --- DONNÉES (Via ton Hook useChallenge) ---
   const {
      items, loading, addGame, removeGame, existingBggIds,
      deletePlay, getHistory, refreshGameProgress, updateProgress
   } = useChallenge();

   // --- CALCULS DU HEADER ---
   const totalGames = items.length;
   const totalPlays = items.reduce((acc, item) => acc + (item.progress || 0), 0);
   const isChallengeFull = totalGames >= 10;

   // --- GESTION DES NOTIFICATIONS ---
   const showToast = (message, type = 'success') => setToast({ message, type });

   // --- AJOUT D'UN JEU ---
   const handleAddGame = async (game) => {
      const result = await addGame(game);
      if (result.success) {
         setIsModalOpen(false);
         showToast(`"${game.name}" a rejoint votre collection !`);
      } else {
         showToast(result.message, 'error');
      }
   };

   // --- SUPPRESSION D'UN JEU ---
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

   // --- GESTION DES PARTIES (AJOUT / HISTORIQUE) ---

   // Cette fonction est appelée par GameCard
   // showHistory = true : Clic sur meeple plein -> Ouvre l'historique
   // showHistory = false : Clic sur meeple vide -> Ouvre l'ajout rapide
   const handleRequestAddPlay = (gameItem, targetLevel, showHistory = false) => {
      if (showHistory) {
         // On passe l'objet game complet
         setHistoryModalConfig({ game: gameItem.game });
      } else {
         setPlayToEdit(null);
         setPlayModalConfig({ gameItem, targetLevel });
      }
   };

   // --- ÉDITION DEPUIS L'HISTORIQUE ---
   const handleRequestEditFromHistory = (play) => {
      const currentGame = historyModalConfig.game;
      // On ferme l'historique
      setHistoryModalConfig(null);

      // On prépare l'édition
      setPlayToEdit(play);
      // On ouvre la modale d'ajout en mode "édition"
      setPlayModalConfig({
         gameItem: { game: currentGame, game_id: currentGame.id },
         targetLevel: null
      });
   };

   // Callback après qu'une partie soit ajoutée ou modifiée
   const handlePlayAdded = async () => {
      if (playModalConfig?.gameItem) {
         await refreshGameProgress(playModalConfig.gameItem.game_id);
      } else {
         await updateProgress();
      }
      setPlayModalConfig(null);
      setPlayToEdit(null);
   };

   // --- RENDER : LOADING ---
   if (loading) {
      return (
         <div className="flex-1 flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-stone-200 border-t-amber-600"></div>
         </div>
      );
   }

   // --- RENDER : DASHBOARD ---
   return (
      <div className="flex-1 flex flex-col w-full max-w-[90rem] mx-auto px-4 md:px-8 py-8">

         {/* Toast Notification */}
         {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

         <main className="w-full flex-grow">

            {/* 1. Header (Compteurs) */}
            <DashboardHeader
               totalGames={totalGames}
               totalPlays={totalPlays}
               isChallengeFull={isChallengeFull}
            />

            {/* 2. Barre de Progression Globale */}
            <ChallengeProgress totalPlays={totalPlays} />

            {/* 3. Grille des Jeux */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 relative z-0 mb-12">

               {items.map((item) => (
                  <GameCard
                     key={item.game_id}
                     item={item}
                     // SÉCURITÉ IMAGE : On mappe les propriétés pour être sûr d'avoir une image
                     gameInfo={{
                        ...item.game,
                        image: item.game.image_url || item.game.thumbnail_url
                     }}
                     // ACTIONS
                     onRemove={() => handleRequestRemove(item.game_id, item.game.name)}
                     onClickDetails={setSelectedGame}
                     onRequestAddPlay={handleRequestAddPlay}

                     // NOUVEAU : Ouverture de l'historique sur clic meeple plein
                     onOpenHistory={() => handleRequestAddPlay(item, null, true)}
                  />
               ))}

               {/* 4. Emplacements Vides (Boutons d'ajout) */}
               {!isChallengeFull && Array.from({ length: Math.max(0, 10 - items.length) }).map((_, index) => (
                  <button key={`empty-${index}`} onClick={() => setIsModalOpen(true)}
                     className="group relative aspect-[3/4] w-full rounded-2xl flex flex-col items-center justify-center p-6 transition-all duration-300
                        bg-stone-200/30 border-2 border-dashed border-stone-300 shadow-inner
                        hover:bg-white hover:border-amber-400 hover:shadow-lg hover:scale-[1.02]"
                  >
                     <div className="w-14 h-14 rounded-full bg-stone-100 border border-stone-300 text-stone-400 flex items-center justify-center mb-3 group-hover:bg-amber-50 group-hover:border-amber-300 group-hover:text-amber-600 transition-all shadow-sm group-hover:rotate-90 duration-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                           <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                     </div>
                     <span className="text-[10px] font-extrabold text-stone-400 group-hover:text-amber-700 uppercase tracking-widest transition-colors">
                        Emplacement Libre
                     </span>
                  </button>
               ))}
            </div>
         </main>

         {/* --- LES MODALES --- */}

         {/* 1. Ajouter un jeu */}
         <AddGameModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAdd={handleAddGame}
            existingIds={existingBggIds}
         />

         {/* 2. Détails du jeu (Fiche BGG) */}
         {selectedGame && (
            <GameDetailsModal
               game={selectedGame}
               onClose={() => setSelectedGame(null)}
            />
         )}

         {/* 3. Confirmer la suppression (Rouge) */}
         <DeleteGameModal
            isOpen={!!gameToDelete}
            game={gameToDelete}
            onClose={() => setGameToDelete(null)}
            onConfirm={confirmRemove}
         />

         {/* 4. Historique des parties (Liste) */}
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

         {/* 5. Ajouter / Modifier une partie */}
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
