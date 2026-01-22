import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

export default function ChallengeGrid() {
   const [items, setItems] = useState([]);
   const [loading, setLoading] = useState(true);

   // Pour l'instant on cible le challenge n°1 en dur
   const CHALLENGE_ID = 1;

   // Fonction pour charger les données
   const fetchChallenge = async () => {
      try {
         // La syntaxe Magique de Supabase pour les Joitures (JOIN)
         // On demande : "Donne-moi les items, ET pour chaque item, va chercher les infos du jeu associé"
         const { data, error } = await supabase
            .from('challenge_items')
            .select(`
          progress,
          target,
          game:games (
            id,
            name,
            thumbnail_url
          )
        `)
            .eq('challenge_id', CHALLENGE_ID);

         if (error) throw error;
         setItems(data || []);

      } catch (error) {
         console.error("Erreur chargement challenge:", error);
      } finally {
         setLoading(false);
      }
   };

   // On lance le chargement au démarrage du composant
   useEffect(() => {
      fetchChallenge();

      // Astuce : On s'abonne aux changements en temps réel ? 
      // Pour l'instant non, on fera un rafraichissement manuel simple.
   }, []);

   if (loading) return <div className="text-gray-500 text-sm">Chargement de ta grille...</div>;

   if (items.length === 0) {
      return (
         <div className="p-6 bg-blue-50 border border-blue-100 rounded-lg text-center text-blue-800">
            <p>Tu n'as pas encore ajouté de jeux à ton défi.</p>
            <p className="text-sm mt-1">Utilise la recherche ci-dessus pour commencer !</p>
         </div>
      );
   }

   return (
      <div className="mt-8">
         <h2 className="text-2xl font-bold mb-4 text-gray-800">Mon Challenge 10x10</h2>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
               <div key={item.game.id} className="bg-white p-4 rounded-lg shadow border flex items-center gap-4">

                  {/* Avatar du jeu (ou placeholder) */}
                  <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400 font-bold shrink-0">
                     {item.game.thumbnail_url ? <img src={item.game.thumbnail_url} className="w-full h-full object-cover rounded" /> : "IMG"}
                  </div>

                  <div className="flex-1">
                     <h3 className="font-bold text-gray-900 truncate">{item.game.name}</h3>

                     {/* Barre de progression */}
                     <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                           <span>Progression</span>
                           <span>{item.progress} / {item.target}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                           <div
                              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                              style={{ width: `${(item.progress / item.target) * 100}%` }}
                           ></div>
                        </div>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
}
