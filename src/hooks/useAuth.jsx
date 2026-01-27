import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

// 1. Création du contexte (la mémoire partagée)
const AuthContext = createContext({});

// 2. Le Fournisseur (le composant qui enveloppe l'app)
export const AuthProvider = ({ children }) => {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      // Vérifier la session au démarrage
      const checkSession = async () => {
         const { data: { session } } = await supabase.auth.getSession();
         setUser(session?.user ?? null);
         setLoading(false);
      };

      checkSession();

      // Écouter les changements (connexion/déconnexion)
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
         setUser(session?.user ?? null);
         setLoading(false);
      });

      return () => subscription.unsubscribe();
   }, []);

   // --- LES FONCTIONS QUE "LOGIN.JSX" ATTEND ---

   const signUp = async (email, password) => {
      return await supabase.auth.signUp({ email, password });
   };

   const signIn = async (email, password) => {
      return await supabase.auth.signInWithPassword({ email, password });
   };

   const signOut = async () => {
      return await supabase.auth.signOut();
   };

   // On expose tout ça au reste de l'app
   const value = {
      user,
      loading,
      signIn,
      signUp,
      signOut
   };

   return (
      <AuthContext.Provider value={value}>
         {!loading && children}
      </AuthContext.Provider>
   );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
   return useContext(AuthContext);
};
