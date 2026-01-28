import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { getGameDetails } from '../services/bgg';

const MEEPLE_COLORS = [
   'red', 'blue', 'green', 'yellow', 'black',
   'gray', 'purple', 'orange', 'brown', 'teal'
];

// 🚀 NOUVEAU : Fonction pour prévenir toute l'app qu'il y a du changement
const triggerGlobalUpdate = () => {
   window.dispatchEvent(new Event('challengeUpdated'));
};

export function useChallenge() {
   const [challengeId, setChallengeId] = useState(null);
   const [items, setItems] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   const extractStoragePath = (fullUrl) => {
      try {
         const bucketMarker = '/game-memories/';
         const parts = fullUrl.split(bucketMarker);
         return parts.length > 1 ? parts[1] : null;
      } catch (error) {
         console.error("Erreur parsing URL image:", fullUrl, error);
         return null;
      }
   };

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

   const addGame = async (gameBgg) => {
      if (!challengeId) return { success: false, message: "Erreur interne" };
      try {
         const usedColors = items.map(i => i.meeple_color);
         const availableColors = MEEPLE_COLORS.filter(c => !usedColors.includes(c));
         const pool = availableColors.length > 0 ? availableColors : MEEPLE_COLORS;
         const randomColor = pool[Math.floor(Math.random() * pool.length)];

         const details = await getGameDetails(gameBgg.bgg_id);

         // 1. Upsert du jeu
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

         // 2. Ajout au challenge
         const { error: linkError } = await supabase.from('challenge_items')
            .insert({ challenge_id: challengeId, game_id: gameData.id, meeple_color: randomColor });

         if (linkError) { if (linkError.code === '23505') throw new Error("Déjà ajouté !"); throw linkError; }

         // 3. Mise à jour locale immédiate (Optimistic UI)
         const newItem = {
            game_id: gameData.id,
            progress: 0,
            target: 10,
            meeple_color: randomColor,
            game: gameData
         };
         setItems(prev => [...prev, newItem]);

         // 4. SIGNAL GLOBAL (Pour la Navbar)
         triggerGlobalUpdate();

         return { success: true };
      } catch (err) {
         return { success: false, message: err.message || "Erreur inconnue" };
      }
   };

   const getHistory = async (gameId) => {
      const { data, error } = await supabase
         .from('plays').select('*').eq('game_id', gameId).order('played_on', { ascending: false });
      if (error) { console.error(error); return []; }
      return data;
   };

   const getAllPlays = useCallback(async () => {
      try {
         const { data: { user } } = await supabase.auth.getUser();
         if (!user || !challengeId) return [];

         const { data: challengeGames } = await supabase
            .from('challenge_items').select('game_id').eq('challenge_id', challengeId);

         if (!challengeGames || challengeGames.length === 0) return [];
         const gameIds = challengeGames.map(item => item.game_id);

         const { data: allPlays, error: playsError } = await supabase
            .from('plays')
            .select(`id, played_on, is_victory, duration_minutes, notes, image_urls, game:games ( name )`)
            .in('game_id', gameIds)
            .eq('user_id', user.id)
            .order('played_on', { ascending: true });

         if (playsError) throw playsError;
         return allPlays;
      } catch (err) {
         console.error("Erreur stats globales:", err);
         return [];
      }
   }, [challengeId]);

   const updateProgress = async (gameId, newProgress) => {
      if (!gameId) { fetchGames(challengeId); return; }

      // Update local
      setItems(current => current.map(item => item.game_id === gameId ? { ...item, progress: newProgress } : item));

      try {
         await supabase.from('challenge_items').update({ progress: newProgress })
            .eq('challenge_id', challengeId).eq('game_id', gameId);

         // SIGNAL GLOBAL (Pour mettre à jour la barre de progression dans la Navbar)
         triggerGlobalUpdate();

      } catch { fetchGames(challengeId); }
   };

   const refreshGameProgress = async (gameId) => {
      try {
         const { count, error: countError } = await supabase
            .from('plays')
            .select('*', { count: 'exact', head: true })
            .eq('game_id', gameId);

         if (countError) throw countError;
         const newProgress = Math.min(count, 10);
         await updateProgress(gameId, newProgress);
         return newProgress;
      } catch (err) {
         console.error("Erreur refreshGameProgress:", err);
      }
   };

   const deletePlay = async (playId, gameId) => {
      try {
         const { data: playData, error: fetchError } = await supabase
            .from('plays').select('image_urls').eq('id', playId).single();

         if (fetchError) throw fetchError;

         if (playData.image_urls && playData.image_urls.length > 0) {
            const pathsToDelete = playData.image_urls
               .map(url => extractStoragePath(url))
               .filter(path => path !== null);

            if (pathsToDelete.length > 0) {
               await supabase.storage.from('game-memories').remove(pathsToDelete);
            }
         }

         const { error } = await supabase.from('plays').delete().eq('id', playId);
         if (error) throw error;

         await refreshGameProgress(gameId);
         return { success: true };
      } catch (err) {
         console.error("Erreur deletePlay :", err);
         return { success: false };
      }
   };

   const removeGame = async (gameId) => {
      if (!challengeId) return;
      try {
         const { data: { user } } = await supabase.auth.getUser();
         if (!user) return;

         // Suppression fichiers
         const { data: allPlays } = await supabase
            .from('plays').select('image_urls').eq('game_id', gameId).eq('user_id', user.id);

         let allPathsToDelete = [];
         if (allPlays) {
            allPlays.forEach(play => {
               if (play.image_urls) {
                  const paths = play.image_urls.map(url => extractStoragePath(url)).filter(p => p !== null);
                  allPathsToDelete = [...allPathsToDelete, ...paths];
               }
            });
         }
         if (allPathsToDelete.length > 0) {
            await supabase.storage.from('game-memories').remove(allPathsToDelete);
         }

         // Suppression DB
         await supabase.from('plays').delete().eq('game_id', gameId).eq('user_id', user.id);
         await supabase.from('challenge_items').delete().eq('challenge_id', challengeId).eq('game_id', gameId);

         // Mise à jour locale Dashboard
         setItems(current => current.filter(item => item.game_id !== gameId));

         // SIGNAL GLOBAL (Pour nettoyer la Navbar)
         triggerGlobalUpdate();

         return { success: true };
      } catch (err) {
         console.error("Erreur suppression jeu:", err);
         fetchGames(challengeId);
         return { success: false, message: "Impossible de supprimer." };
      }
   };

   return {
      items, loading, error,
      addGame, updateProgress, refreshGameProgress,
      removeGame, getHistory, deletePlay, getAllPlays,
      existingBggIds: items.map(i => i.game.bgg_id)
   };
}
