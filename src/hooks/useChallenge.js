import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { getGameDetails } from '../services/bgg';

// Les couleurs disponibles
const MEEPLE_COLORS = ['red', 'yellow', 'teal', 'blue', 'purple', 'orange', 'green'];

export function useChallenge(challengeId = 1) {
   const [items, setItems] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   // 1. CHARGER
   const fetchChallenge = useCallback(async () => {
      try {
         setLoading(true);
         const { data, error } = await supabase
            .from('challenge_items')
            .select(`
          game_id, progress, target, meeple_color,
          game:games (id, bgg_id, name, thumbnail_url)
        `)
            .eq('challenge_id', challengeId)
            .order('created_at', { ascending: true });

         if (error) throw error;
         setItems(data || []);
      } catch (err) {
         setError(err.message);
         console.error("Erreur chargement:", err);
      } finally {
         setLoading(false);
      }
   }, [challengeId]);

   // Chargement initial
   useEffect(() => {
      fetchChallenge();
   }, [fetchChallenge]);

   // 2. AJOUTER
   const addGame = async (gameBgg) => {
      try {
         const details = await getGameDetails(gameBgg.bgg_id);

         // Upsert Game
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

         const randomColor = MEEPLE_COLORS[Math.floor(Math.random() * MEEPLE_COLORS.length)];

         // Insert Link
         const { error: linkError } = await supabase
            .from('challenge_items')
            .insert({
               challenge_id: challengeId,
               game_id: gameData.id,
               meeple_color: randomColor
            });

         if (linkError) {
            if (linkError.code === '23505') throw new Error("Ce jeu est déjà dans ta liste !");
            throw linkError;
         }

         fetchChallenge(); // Recharge la liste proprement
         return { success: true };

      } catch (err) {
         return { success: false, message: err.message };
      }
   };

   // 3. METTRE À JOUR
   const updateProgress = async (gameId, newProgress) => {
      // Optimistic UI update
      setItems(current => current.map(item =>
         item.game_id === gameId ? { ...item, progress: newProgress } : item
      ));

      try {
         const { error } = await supabase
            .from('challenge_items')
            .update({ progress: newProgress })
            .eq('challenge_id', challengeId)
            .eq('game_id', gameId);

         if (error) throw error;
      } catch (err) {
         console.error("Erreur update:", err);
         fetchChallenge(); // Rollback en cas d'erreur
      }
   };

   // 4. SUPPRIMER
   const removeGame = async (gameId) => {
      // Optimistic UI delete
      setItems(current => current.filter(item => item.game_id !== gameId));

      try {
         const { error } = await supabase
            .from('challenge_items')
            .delete()
            .eq('challenge_id', challengeId)
            .eq('game_id', gameId);

         if (error) throw error;
      } catch (err) {
         console.error("Erreur delete:", err);
         fetchChallenge();
      }
   };

   return {
      items,
      loading,
      error,
      addGame,
      updateProgress,
      removeGame,
      existingBggIds: items.map(i => i.game.bgg_id)
   };
}
