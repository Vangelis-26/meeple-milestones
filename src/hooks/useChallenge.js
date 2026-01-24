import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { getGameDetails } from '../services/bgg';

// Liste des 10 couleurs de ton Édition Bois (pour le tirage au sort)
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
         if (!user) {
            console.warn("Utilisateur non connecté");
            setLoading(false);
            return;
         }

         const { data: challengeData, error: challengeError } = await supabase
            .from('challenges')
            .select('id')
            .eq('user_id', user.id)
            .single();

         if (challengeError) throw challengeError;

         setChallengeId(challengeData.id);
         await fetchGames(challengeData.id);

      } catch (err) {
         console.error("Erreur init:", err);
         setError(err.message);
         setLoading(false);
      }
   }, []);

   // --- CHARGEMENT DES JEUX (READ) ---
   const fetchGames = async (id) => {
      try {
         // CORRECTION ICI : On récupère TOUTES les colonnes (rating, time, description...)
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

   useEffect(() => {
      initChallenge();
   }, [initChallenge]);

   // --- AJOUTER UN JEU (CREATE) ---
   const addGame = async (gameBgg) => {
      if (!challengeId) {
         return { success: false, message: "Erreur interne: Challenge non trouvé" };
      }

      console.log(`Tentative d'ajout enrichi pour : ${gameBgg.name}`);

      try {
         // 1. Appel du Mock pour avoir les stats
         const details = await getGameDetails(gameBgg.bgg_id);

         // 2. CORRECTION ICI : Upsert avec TOUTES les données
         const { data: gameData, error: gameError } = await supabase
            .from('games')
            .upsert({
               bgg_id: gameBgg.bgg_id,
               name: gameBgg.name,
               thumbnail_url: details.thumbnail_url,
               // Nouveaux champs cruciaux
               image_url: details.image_url,
               description: details.description,
               year_published: details.year_published,
               min_age: details.min_age,
               playing_time: details.playing_time,
               rating: details.rating,
               complexity: details.complexity
            }, { onConflict: 'bgg_id' })
            .select()
            .single();

         if (gameError) throw gameError;

         // 3. Liaison avec une couleur aléatoire parmi les 10
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

         fetchGames(challengeId);
         return { success: true };

      } catch (err) {
         console.error("Erreur addGame:", err);
         return { success: false, message: err.message };
      }
   };

   // --- METTRE À JOUR LA PROGRESSION ---
   const updateProgress = async (gameId, newProgress) => {
      if (!challengeId) return;
      setItems(current => current.map(item => item.game_id === gameId ? { ...item, progress: newProgress } : item));
      try {
         await supabase.from('challenge_items').update({ progress: newProgress })
            .eq('challenge_id', challengeId).eq('game_id', gameId);
      } catch (err) { fetchGames(challengeId); }
   };

   // --- RETIRER UN JEU ---
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
