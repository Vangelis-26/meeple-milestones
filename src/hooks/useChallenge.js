import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { getGameDetails } from '../services/bgg';

const MEEPLE_COLORS = ['red', 'yellow', 'teal', 'blue', 'purple', 'orange', 'green'];

export function useChallenge() {
   const [challengeId, setChallengeId] = useState(null);
   const [items, setItems] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   // --- INITIALISATION ---
   const initChallenge = useCallback(async () => {
      try {
         setLoading(true);

         // 1. On récupère l'user
         const { data: { user } } = await supabase.auth.getUser();
         if (!user) {
            console.warn("Utilisateur non connecté");
            setLoading(false);
            return;
         }

         // 2. On récupère SON challenge
         const { data: challengeData, error: challengeError } = await supabase
            .from('challenges')
            .select('id')
            .eq('user_id', user.id)
            .single();

         if (challengeError) throw challengeError;

         // 3. ON SAUVEGARDE L'ID DANS LE STATE
         setChallengeId(challengeData.id);

         // 4. On charge les jeux
         await fetchGames(challengeData.id);

      } catch (err) {
         console.error("Erreur init:", err);
         setError(err.message);
         setLoading(false);
      }
   }, []);

   // --- CHARGEMENT DES JEUX ---
   const fetchGames = async (id) => {
      try {
         const { data, error } = await supabase
            .from('challenge_items')
            .select(`
          game_id, progress, target, meeple_color,
          game:games (id, bgg_id, name, thumbnail_url)
        `)
            .eq('challenge_id', id)
            .order('created_at', { ascending: true });

         if (error) throw error;
         setItems(data || []);
      } catch (err) {
         console.error(err);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      initChallenge();
   }, [initChallenge]);

   // --- AJOUTER UN JEU ---
   const addGame = async (gameBgg) => {
      // Vérification de sécurité
      if (!challengeId) {
         return { success: false, message: "Erreur interne: Challenge non trouvé" };
      }

      console.log(`Tentative d'ajout dans le challenge ID : ${challengeId}`);

      try {
         // 1. Détails BGG
         const details = await getGameDetails(gameBgg.bgg_id);

         // 2. Upsert Game (Table Games - Public)
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

         // 3. Insert Link (Table Challenge_Items - Privé)
         const randomColor = MEEPLE_COLORS[Math.floor(Math.random() * MEEPLE_COLORS.length)];

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

         // Recharger la liste
         fetchGames(challengeId);
         return { success: true };

      } catch (err) {
         console.error("Erreur addGame:", err);
         return { success: false, message: err.message };
      }
   };

   const updateProgress = async (gameId, newProgress) => {
      if (!challengeId) return;
      setItems(current => current.map(item => item.game_id === gameId ? { ...item, progress: newProgress } : item));
      try {
         await supabase.from('challenge_items').update({ progress: newProgress })
            .eq('challenge_id', challengeId).eq('game_id', gameId);
      } catch (err) { fetchGames(challengeId); }
   };

   const removeGame = async (gameId) => {
      if (!challengeId) return;
      setItems(current => current.filter(item => item.game_id !== gameId));
      try {
         await supabase.from('challenge_items').delete()
            .eq('challenge_id', challengeId).eq('game_id', gameId);
      } catch (err) { fetchGames(challengeId); }
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
