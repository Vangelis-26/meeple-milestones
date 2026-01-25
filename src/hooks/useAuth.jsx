import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export function useAuth() {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      // 1. Vérifier la session actuelle au chargement
      supabase.auth.getSession().then(({ data: { session } }) => {
         setUser(session?.user ?? null);
         setLoading(false);
      });

      // 2. Écouter les changements (Connexion / Déconnexion)
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
         setUser(session?.user ?? null);
         setLoading(false);
      });

      return () => subscription.unsubscribe();
   }, []);

   // Fonction de déconnexion
   const signOut = async () => {
      await supabase.auth.signOut();
   };

   return { user, loading, signOut };
}
