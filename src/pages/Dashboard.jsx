import { useState, useEffect } from 'react';
import ChallengeGrid from '../components/ChallengeGrid';
import AddGameModal from '../components/AddGameModal';
import { supabase } from '../services/supabase';
import { getGameDetails } from '../services/bgg';

const MEEPLE_COLORS = [
   'red',
   'yellow',
   'teal',   // vert-bleu
   'blue',
   'purple',
   'orange',
   'green'
];

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
             meeple_color,
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

         // 🎨 On choisit une couleur au hasard pour ce nouveau jeu
         const randomColor = MEEPLE_COLORS[Math.floor(Math.random() * MEEPLE_COLORS.length)];

         // 3. Insert Link
         const { error: linkError } = await supabase
            .from('challenge_items')
            .insert({
               challenge_id: CHALLENGE_ID,
               game_id: gameData.id,
               progress: 0,
               target: 10,
               meeple_color: randomColor // <--- ON SAUVEGARDE LA COULEUR
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

   const updateProgress = async (gameId, newProgress) => {
      // Optimisation UI : On met à jour l'affichage localement TOUT DE SUITE (avant la réponse du serveur)
      // Cela donne une sensation de vitesse instantanée (Optimistic UI)
      setItems(currentItems =>
         currentItems.map(item =>
            item.game_id === gameId ? { ...item, progress: newProgress } : item
         )
      );

      try {
         const { error } = await supabase
            .from('challenge_items')
            .update({ progress: newProgress })
            .eq('challenge_id', CHALLENGE_ID)
            .eq('game_id', gameId);

         if (error) throw error;
         // Pas besoin de recharger fetchChallenge() car on a déjà mis à jour l'état local !

      } catch (error) {
         console.error("Erreur sauvegarde:", error);
         alert("Erreur lors de la sauvegarde du progrès. Rechargement...");
         fetchChallenge(); // En cas d'erreur, on remet les vraies données du serveur pour corriger
      }
   };

   const removeGame = async (gameId) => {
      if (!window.confirm("Veux-tu vraiment retirer ce jeu de ton défi ?")) return;

      // Mise à jour optimiste (On l'enlève de l'écran tout de suite)
      setItems(current => current.filter(item => item.game_id !== gameId));

      try {
         const { error } = await supabase
            .from('challenge_items')
            .delete()
            .eq('challenge_id', CHALLENGE_ID)
            .eq('game_id', gameId);

         if (error) throw error;

      } catch (error) {
         console.error("Erreur suppression:", error);
         alert("Impossible de supprimer le jeu.");
         fetchChallenge();
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
            onUpdateProgress={updateProgress}
            onRemoveGame={removeGame}
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
