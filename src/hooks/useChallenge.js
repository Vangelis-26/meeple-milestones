import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { getGameDetails } from '../services/bgg';

// Liste des 10 couleurs de ton Édition Bois
const MEEPLE_COLORS = [
   'red', 'blue', 'green', 'yellow', 'black',
   'gray', 'purple', 'orange', 'brown', 'teal'
];

export function useChallenge() {
   const [challengeId, setChallengeId] = useState(null);
   const [items, setItems] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   // --- INITIALISATION ---
   const initChallenge = useCallback(async () => {
      try {
         setLoading(true);
         const { data: { user } } = await supabase.auth.getUser();
         if (!user) { setLoading(false); return; }
         const { data: challengeData, error: challengeError } = await supabase
            .from('challenges').select('id').eq('user_id', user.id).single();
         if (challengeError) throw challengeError;
         setChallengeId(challengeData.id);
         await fetchGames(challengeData.id);
      } catch (err) { setError(err.message); setLoading(false); }
   }, []);

   // --- READ ---
   const fetchGames = async (id) => {
      try {
         const { data, error } = await supabase
            .from('challenge_items')
            .select(`
               game_id, progress, target, meeple_color,
               game:games (
                  id, bgg_id, name, thumbnail_url,
                  image_url, description, rating, playing_time, complexity, year_published, min_age
               )
            `)
            .eq('challenge_id', id)
            .order('created_at', { ascending: true });
         if (error) throw error;
         setItems(data || []);
      } catch (err) { console.error(err); } finally { setLoading(false); }
   };

   useEffect(() => { initChallenge(); }, [initChallenge]);

   // --- CREATE JEU ---
   const addGame = async (gameBgg) => {
      if (!challengeId) return { success: false, message: "Erreur interne" };
      try {
         const usedColors = items.map(i => i.meeple_color);
         const availableColors = MEEPLE_COLORS.filter(c => !usedColors.includes(c));
         const pool = availableColors.length > 0 ? availableColors : MEEPLE_COLORS;
         const randomColor = pool[Math.floor(Math.random() * pool.length)];

         const details = await getGameDetails(gameBgg.bgg_id);

         const { data: gameData, error: gameError } = await supabase
            .from('games')
            .upsert({
               bgg_id: gameBgg.bgg_id,
               name: gameBgg.name,
               thumbnail_url: details.thumbnail_url,
               image_url: details.image_url,
               description: details.description,
               year_published: details.year_published,
               min_age: details.min_age,
               playing_time: details.playing_time,
               rating: details.rating,
               complexity: details.complexity
            }, { onConflict: 'bgg_id' })
            .select().single();

         if (gameError) throw gameError;

         const { error: linkError } = await supabase.from('challenge_items')
            .insert({ challenge_id: challengeId, game_id: gameData.id, meeple_color: randomColor });

         if (linkError) { if (linkError.code === '23505') throw new Error("Déjà ajouté !"); throw linkError; }

         fetchGames(challengeId);
         return { success: true };
      } catch (err) { return { success: false, message: err.message }; }
   };

   // --- SYNCHRO & PROGRESSION ---

   // 1. Lire l'historique
   const getHistory = async (gameId) => {
      const { data, error } = await supabase
         .from('plays').select('*').eq('game_id', gameId).order('played_on', { ascending: false });
      if (error) { console.error(error); return []; }
      return data;
   };

   // 2. Mettre à jour l'affichage local + BDD
   const updateProgress = async (gameId, newProgress) => {
      if (!gameId) { fetchGames(challengeId); return; } // Refresh global
      setItems(current => current.map(item => item.game_id === gameId ? { ...item, progress: newProgress } : item));
      try {
         await supabase.from('challenge_items').update({ progress: newProgress })
            .eq('challenge_id', challengeId).eq('game_id', gameId);
      } catch { fetchGames(challengeId); }
   };

   // 3. LA FONCTION CRUCIALE : Recompte réel
   const refreshGameProgress = async (gameId) => {
      try {
         // Compte réel en base
         const { count, error: countError } = await supabase
            .from('plays')
            .select('*', { count: 'exact', head: true })
            .eq('game_id', gameId);

         if (countError) throw countError;

         // On plafonne à 10 pour l'affichage (mais le count peut être > 10)
         const newProgress = Math.min(count, 10);
         await updateProgress(gameId, newProgress);
         return newProgress;
      } catch (err) {
         console.error("Erreur refreshGameProgress:", err);
      }
   };

   // 4. Supprimer une partie
   const deletePlay = async (playId, gameId) => {
      try {
         const { error } = await supabase.from('plays').delete().eq('id', playId);
         if (error) throw error;

         // Après suppression, on recompte tout de suite !
         await refreshGameProgress(gameId);

         return { success: true };
      } catch (err) {
         console.error("Erreur deletePlay", err);
         return { success: false };
      }
   };

   // --- SUPPRESSION JEU ---
   const removeGame = async (gameId) => {
      if (!challengeId) return;
      setItems(current => current.filter(item => item.game_id !== gameId));
      try {
         await supabase.from('challenge_items').delete().eq('challenge_id', challengeId).eq('game_id', gameId);
      } catch { fetchGames(challengeId); }
   };

   return {
      items, loading, error,
      addGame, updateProgress, refreshGameProgress, // <--- Bien vérifié ici
      removeGame, getHistory, deletePlay,
      existingBggIds: items.map(i => i.game.bgg_id)
   };
}
