import { useState } from 'react';
import { useChallenge } from '../hooks/useChallenge';

// --- IMPORTS COMPOSANTS ---
import DashboardHeader from '../components/DashboardHeader';
import ChallengeProgress from '../components/ChallengeProgress';
import GameCard from '../components/GameCard';
import Toast from '../components/Toast';

// --- IMPORTS MODALES (Fonctionnalités) ---
import AddGameModal from '../components/AddGameModal';
import GameDetailsModal from '../components/GamedetailsModal';
import DeleteGameModal from '../components/DeleteGameModal';
import AddPlayModal from '../components/AddPlayModal';
import GameHistoryModal from '../components/GameHistoryModal';

export default function Dashboard() {

   // =========================================================================
   // 1. GESTION DES ÉTATS (STATE MANAGEMENT)
   // =========================================================================

   // État global pour l'ouverture de la modale d'ajout
   const [isAddModalOpen, setIsAddModalOpen] = useState(false);

   // États pour la sélection d'un jeu spécifique (Détails ou Suppression)
   const [selectedGame, setSelectedGame] = useState(null);
   const [gameToDelete, setGameToDelete] = useState(null);

   // États pour la gestion des parties (Ajout, Historique, Modification)
   const [playModalConfig, setPlayModalConfig] = useState(null);       // Config pour ouvrir AddPlayModal
   const [historyModalConfig, setHistoryModalConfig] = useState(null); // Config pour ouvrir GameHistoryModal
   const [playToEdit, setPlayToEdit] = useState(null);                 // Partie en cours d'édition

   // Système de notification (Toast)
   const [toast, setToast] = useState(null);

   // =========================================================================
   // 2. CHARGEMENT DES DONNÉES (HOOK PERSONNALISÉ)
   // =========================================================================
   const {
      items, loading, addGame, removeGame, existingBggIds,
      deletePlay, getHistory, refreshGameProgress, updateProgress
   } = useChallenge();

   // =========================================================================
   // 3. CALCULS & LOGIQUE MÉTIER
   // =========================================================================

   // Statistiques globales du Dashboard
   const totalGames = items.length;
   const totalPlays = items.reduce((acc, item) => acc + (item.progress || 0), 0);
   const isChallengeFull = totalGames >= 10; // Limite du 10x10 atteinte ?

   // Fonction utilitaire pour afficher les notifications
   const showToast = (message, type = 'success') => setToast({ message, type });

   // --- GESTIONNAIRES D'ÉVÉNEMENTS (HANDLERS) ---

   // Ajouter un nouveau jeu
   const handleAddGame = async (game) => {
      const result = await addGame(game);
      if (result.success) {
         setIsAddModalOpen(false);
         showToast(`"${game.name}" a rejoint le challenge !`);
      } else {
         showToast(result.message, 'error');
      }
   };

   // Demander la suppression (Ouvre la modale de confirmation)
   const handleRequestRemove = (gameId, gameName) => {
      setGameToDelete({ id: gameId, name: gameName });
   };

   // Confirmer la suppression définitive
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

   // Ouvrir la modale d'ajout de partie (ou l'historique)
   const handleRequestAddPlay = (gameItem, targetLevel, showHistory = false) => {
      if (showHistory) {
         setHistoryModalConfig({ game: gameItem.game });
      } else {
         setPlayToEdit(null); // Reset mode édition
         setPlayModalConfig({ gameItem, targetLevel });
      }
   };

   // Basculer de l'historique vers l'édition d'une partie
   const handleRequestEditFromHistory = (play) => {
      const currentGame = historyModalConfig.game;
      setHistoryModalConfig(null); // Ferme l'historique
      setPlayToEdit(play);         // Charge la partie à éditer
      setPlayModalConfig({
         gameItem: { game: currentGame, game_id: currentGame.id },
         targetLevel: null
      });
   };

   // Callback après l'ajout/modif d'une partie
   const handlePlayAdded = async () => {
      if (playModalConfig?.gameItem) {
         await refreshGameProgress(playModalConfig.gameItem.game_id);
      } else {
         await updateProgress();
      }
      setPlayModalConfig(null);
      setPlayToEdit(null);
   };

   // =========================================================================
   // 4. RENDU (UI)
   // =========================================================================

   // État de chargement initial
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
         {/* Notification Toast */}
         {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

         <main className="w-full flex-grow space-y-8">

            {/* EN-TÊTE ET PROGRESSION GLOBALE */}
            <div className="space-y-6">
               <DashboardHeader
                  totalGames={totalGames}
                  totalPlays={totalPlays}
                  isChallengeFull={isChallengeFull}
               />
               <ChallengeProgress totalPlays={totalPlays} />
            </div>

            {/* --- LOGIQUE D'AFFICHAGE CONDITIONNEL (EMPTY STATE vs GRILLE) --- */}

            {items.length === 0 ? (
               // CAS 1 : NOUVEL UTILISATEUR (AUCUN JEU)
               // Affiche le composant d'accueil "Premium"
               <EmptyState onAdd={() => setIsAddModalOpen(true)} />
            ) : (
               // CAS 2 : UTILISATEUR ACTIF (GRILLE DE JEUX)
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 relative z-0 mb-12">

                  {/* Liste des cartes de jeux */}
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

                  {/* Emplacements vides (Placeholders) jusqu'à 10 */}
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
            )}
         </main>

         {/* ==================================================================
             5. MODALES (AFFICHAGE CONDITIONNEL)
             ================================================================== */}

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

// ============================================================================
// COMPOSANT LOCAL : EMPTY STATE (ACCUEIL NOUVEAU JOUEUR)
// ============================================================================
// Ce composant n'est affiché que si la collection est vide.
// Il remplace la grille de placeholders par une invitation immersive.

function EmptyState({ onAdd }) {
   return (
      <div className="w-full py-16 md:py-24 px-4 flex flex-col items-center justify-center text-center bg-white rounded-[2.5rem] border border-stone-200 shadow-sm relative overflow-hidden group">

         {/* --- DÉCOR AMBIANCE --- */}
         <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')] pointer-events-none"></div>
         {/* Halo lumineux ambre interactif */}
         <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-100 rounded-full blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity duration-1000"></div>

         <div className="relative z-10 max-w-lg mx-auto space-y-8">

            {/* --- ICÔNE LUDOTHÈQUE ANIMÉE --- */}
            <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
               <div className="absolute inset-0 bg-amber-50 rounded-full animate-pulse"></div>
               <div className="relative bg-white w-20 h-20 rounded-full border border-stone-100 shadow-lg flex items-center justify-center text-amber-600 transform group-hover:scale-110 transition-transform duration-500">
                  {/* SVG : Pile de Livres / Boîtes */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
               </div>
            </div>

            {/* --- TEXTE D'INVITATION --- */}
            <div className="space-y-4">
               <h2 className="font-serif font-black text-3xl md:text-4xl text-stone-900 tracking-tight">
                  Votre Sanctuaire Ludique est Ouvert
               </h2>
               <p className="text-stone-500 font-serif italic text-lg leading-relaxed px-4">
                  "Pour l'instant, le silence règne sur les étagères. Ajoutez la première boîte maîtresse de votre collection pour éveiller la magie du challenge."
               </p>
            </div>

            {/* --- BOUTON D'ACTION (CTA) --- */}
            <button
               onClick={onAdd}
               className="group relative inline-flex items-center gap-3 px-8 py-4 bg-stone-900 text-amber-50 font-black uppercase tracking-[0.2em] text-xs rounded-xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-stone-900/20 hover:-translate-y-1 transition-all duration-300"
            >
               <span className="relative z-10">Déposer la Première Boîte</span>
               <svg className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
               </svg>
               {/* Effet de brillance au survol */}
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
            </button>
         </div>
      </div>
   );
}
