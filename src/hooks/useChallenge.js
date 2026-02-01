// =================================================================================
// HOOK : USE CHALLENGE
// Rôle : Cerveau de l'application. Gère le CRUD des jeux, parties et la progression.
// =================================================================================

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { getGameDetails } from '../services/bgg';

// Palette pour l'attribution aléatoire des couleurs de Meeple
const MEEPLE_COLORS = [
   'red', 'blue', 'green', 'yellow', 'black',
   'gray', 'purple', 'orange', 'brown', 'teal'
];

// Helper : Déclenche un événement global pour rafraîchir les composants isolés (ex: Navbar)
const triggerGlobalUpdate = () => {
   window.dispatchEvent(new Event('challengeUpdated'));
};

export function useChallenge() {
   // --- ÉTATS ---
   const [challengeId, setChallengeId] = useState(null);
   const [items, setItems] = useState([]); // Liste des jeux du challenge
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   // --- UTILITAIRES ---

   // Extrait le chemin relatif d'une image pour la suppression Storage
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

   // --- CHARGEMENT DES DONNÉES ---

   // 1. Initialisation du Challenge (Récupère ou crée l'ID du challenge 10x10)
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
      } catch (err) {
         setError(err.message);
         setLoading(false);
      }
   }, []);

   // 2. Récupération des jeux associés au challenge
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
      } catch (err) {
         console.error(err);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => { initChallenge(); }, [initChallenge]);

   // --- ACTIONS (MÉTIER) ---

   // AJOUTER UN JEU AU CHALLENGE
   const addGame = async (gameBgg) => {
      if (!challengeId) return { success: false, message: "Erreur interne" };
      try {
         // Logique de couleur unique (essaie de ne pas répéter les couleurs)
         const usedColors = items.map(i => i.meeple_color);
         const availableColors = MEEPLE_COLORS.filter(c => !usedColors.includes(c));
         const pool = availableColors.length > 0 ? availableColors : MEEPLE_COLORS;
         const randomColor = pool[Math.floor(Math.random() * pool.length)];

         // Appel BGG pour détails complets
         const details = await getGameDetails(gameBgg.bgg_id);

         // A. Upsert du jeu dans la table globale 'games'
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

         // B. Liaison au challenge utilisateur
         const { error: linkError } = await supabase.from('challenge_items')
            .insert({ challenge_id: challengeId, game_id: gameData.id, meeple_color: randomColor });

         if (linkError) {
            if (linkError.code === '23505') throw new Error("Déjà ajouté !");
            throw linkError;
         }

         // C. Mise à jour locale (Optimistic UI)
         const newItem = {
            game_id: gameData.id,
            progress: 0,
            target: 10,
            meeple_color: randomColor,
            game: gameData
         };
         setItems(prev => [...prev, newItem]);
         triggerGlobalUpdate();

         return { success: true };
      } catch (err) {
         return { success: false, message: err.message || "Erreur inconnue" };
      }
   };

   // HISTORIQUE D'UN JEU SPÉCIFIQUE
   const getHistory = async (gameId) => {
      const { data, error } = await supabase
         .from('plays').select('*').eq('game_id', gameId).order('played_on', { ascending: false });
      if (error) { console.error(error); return []; }
      return data;
   };

   // TOUTES LES STATS (POUR GRAPHIQUES)
   const getAllPlays = useCallback(async () => {
      try {
         const { data: { user } } = await supabase.auth.getUser();
         if (!user || !challengeId) return [];

         // On récupère d'abord les IDs des jeux du challenge
         const { data: challengeGames } = await supabase
            .from('challenge_items').select('game_id').eq('challenge_id', challengeId);

         if (!challengeGames || challengeGames.length === 0) return [];
         const gameIds = challengeGames.map(item => item.game_id);

         // On récupère les parties liées
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

   // MISE À JOUR PROGRESSION (+1 Partie)
   const updateProgress = async (gameId, newProgress) => {
      if (!gameId) { fetchGames(challengeId); return; }

      // Update local immédiat
      setItems(current => current.map(item => item.game_id === gameId ? { ...item, progress: newProgress } : item));

      try {
         await supabase.from('challenge_items').update({ progress: newProgress })
            .eq('challenge_id', challengeId).eq('game_id', gameId);
         triggerGlobalUpdate();
      } catch { fetchGames(challengeId); } // Rollback si erreur
   };

   // RECALCUL TOTAL (Après suppression/ajout partie)
   const refreshGameProgress = async (gameId) => {
      try {
         const { count, error: countError } = await supabase
            .from('plays')
            .select('*', { count: 'exact', head: true })
            .eq('game_id', gameId);

         if (countError) throw countError;
         const newProgress = Math.min(count, 10); // Cap à 10 pour le challenge
         await updateProgress(gameId, newProgress);
         return newProgress;
      } catch (err) {
         console.error("Erreur refreshGameProgress:", err);
      }
   };

   // SUPPRIMER UNE PARTIE
   const deletePlay = async (playId, gameId) => {
      try {
         // 1. Nettoyage Storage (Images)
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

         // 2. Suppression DB
         const { error } = await supabase.from('plays').delete().eq('id', playId);
         if (error) throw error;

         // 3. Recalcul progression
         await refreshGameProgress(gameId);
         return { success: true };
      } catch (err) {
         console.error("Erreur deletePlay :", err);
         return { success: false };
      }
   };

   // RETIRER UN JEU DU CHALLENGE
   const removeGame = async (gameId) => {
      if (!challengeId) return;
      try {
         const { data: { user } } = await supabase.auth.getUser();
         if (!user) return;

         // A. Suppression des images liées
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

         // B. Suppression des données (Parties + Lien Challenge)
         // Note: On ne supprime PAS le jeu de la table 'games' globale car d'autres users peuvent l'avoir
         await supabase.from('plays').delete().eq('game_id', gameId).eq('user_id', user.id);
         await supabase.from('challenge_items').delete().eq('challenge_id', challengeId).eq('game_id', gameId);

         // C. Mise à jour UI
         setItems(current => current.filter(item => item.game_id !== gameId));
         triggerGlobalUpdate();

         return { success: true };
      } catch (err) {
         console.error("Erreur suppression jeu:", err);
         fetchGames(challengeId);
         return { success: false, message: "Impossible de supprimer." };
      }
   };

   // API EXPOSÉE
   return {
      items, loading, error,
      addGame, updateProgress, refreshGameProgress,
      removeGame, getHistory, deletePlay, getAllPlays,
      existingBggIds: items.map(i => i.game.bgg_id)
   };
}
