import { useState } from 'react';
import ChallengeGrid from '../components/ChallengeGrid';
import AddGameModal from '../components/AddGameModal';
import { useChallenge } from '../hooks/useChallenge'; // <--- Import du hook

export default function Dashboard() {
   const [isModalOpen, setIsModalOpen] = useState(false);

   const {
      items,
      loading,
      addGame,
      updateProgress,
      removeGame,
      existingBggIds
   } = useChallenge(1);

   const handleAddGame = async (game) => {
      const result = await addGame(game);
      if (result.success) {
         setIsModalOpen(false);
      } else {
         alert(result.message);
      }
   };

   const handleRemoveGame = (gameId) => {
      if (window.confirm("Veux-tu vraiment retirer ce jeu ?")) {
         removeGame(gameId);
      }
   };

   return (
      <div className="max-w-6xl mx-auto pb-24">
         <header className="mb-8 flex justify-between items-end">
            <div>
               <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Mon Challenge 10x10</h1>
               <p className="text-gray-500 mt-2">Objectif : 100 parties en 2026</p>
            </div>
         </header>

         <ChallengeGrid
            items={items}
            loading={loading}
            onAddClick={() => setIsModalOpen(true)}
            onUpdateProgress={updateProgress}
            onRemoveGame={handleRemoveGame}
         />

         {/* Bouton Flottant */}
         <button
            onClick={() => setIsModalOpen(true)}
            className="fixed bottom-8 right-8 bg-blue-600 text-white px-6 py-4 rounded-full shadow-lg flex items-center gap-3 hover:bg-blue-700 hover:scale-105 transition transform z-40 font-bold"
         >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
               <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Ajouter un jeu</span>
         </button>

         <AddGameModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAdd={handleAddGame}
            existingIds={existingBggIds}
         />
      </div>
   );
}
