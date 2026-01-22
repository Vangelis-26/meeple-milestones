import { useState, useEffect } from 'react';
import ChallengeGrid from '../components/ChallengeGrid';
import AddGameModal from '../components/AddGameModal';
import { supabase } from '../services/supabase';
import { getGameDetails } from '../services/bgg';

export default function Dashboard() {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [items, setItems] = useState([]);
   const [loading, setLoading] = useState(true);

   // ID du challenge (toujours 1 pour l'instant)
   const CHALLENGE_ID = 1;

   // Fonction pour charger les données (déplacée ici)
   const fetchChallenge = async () => {
      try {
         const { data, error } = await supabase
            .from('challenge_items')
            .select(`
          game_id, 
          progress,
          target,
          game:games (id, bgg_id, name, thumbnail_url)
        `)
            .eq('challenge_id', CHALLENGE_ID);

         if (error) throw error;
         setItems(data || []);
      } catch (error) {
         console.error("Erreur chargement:", error);
      } finally {
         setLoading(false);
      }
   };

   // Chargement initial
   useEffect(() => {
      fetchChallenge();
   }, []);

   const addToCollection = async (gameBgg) => {
      try {
         // 1. Appel BGG Details (Images)
         const details = await getGameDetails(gameBgg.bgg_id);

         // 2. Upsert Games
         const { data: gameData, error: gameError } = await supabase
            .from('games')
            .upsert({
               bgg_id: gameBgg.bgg_id,
               name: gameBgg.name,
               thumbnail_url: details.thumbnail_url,
            }, { onConflict: 'bgg_id' })
            .select()
            .single();

         if (gameError) throw gameError;

         // 3. Insert Link
         const { error: linkError } = await supabase
            .from('challenge_items')
            .insert({
               challenge_id: CHALLENGE_ID,
               game_id: gameData.id,
               progress: 0,
               target: 10
            });

         if (linkError) {
            if (linkError.code === '23505') alert("Déjà dans ta liste !");
            else throw linkError;
         } else {
            setIsModalOpen(false);
            fetchChallenge();
         }
      } catch (error) {
         alert("Erreur : " + error.message);
      }
   };

   // On calcule la liste des IDs BGG déjà présents pour la modale
   const existingBggIds = items.map(item => item.game.bgg_id);

   return (
      <div className="max-w-6xl mx-auto pb-24">
         <header className="mb-8 flex justify-between items-end">
            <div>
               <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Mon Challenge 10x10</h1>
               <p className="text-gray-500 mt-2">Objectif : 100 parties en 2026</p>
            </div>
         </header>

         {/* On passe les items directement à la grille */}
         <ChallengeGrid
            items={items}
            loading={loading}
            onAddClick={() => setIsModalOpen(true)}
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

         {/* On passe la liste des exclus (existingBggIds) à la modale */}
         <AddGameModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onAdd={addToCollection}
            existingIds={existingBggIds}
         />

      </div>
   );
}
