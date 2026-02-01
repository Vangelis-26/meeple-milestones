// =================================================================================
// HOOK : USE AUTH
// Rôle : Gestionnaire global de l'authentification (Context).
// Fournit l'utilisateur courant et les méthodes (signIn, signUp, signOut) à toute l'app.
// =================================================================================

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

// 1. Création du contexte (Mémoire partagée)
const AuthContext = createContext({});

// 2. Provider (Composant enveloppe)
export const AuthProvider = ({ children }) => {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      // A. Vérification initiale de la session au chargement
      const checkSession = async () => {
         const { data: { session } } = await supabase.auth.getSession();
         setUser(session?.user ?? null);
         setLoading(false);
      };

      checkSession();

      // B. Écouteur de changements (Connexion / Déconnexion en temps réel)
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
         setUser(session?.user ?? null);
         setLoading(false);
      });

      // Nettoyage de l'écouteur
      return () => subscription.unsubscribe();
   }, []);

   // --- MÉTHODES D'AUTHENTIFICATION ---

   const signUp = async (email, password) => {
      return await supabase.auth.signUp({ email, password });
   };

   const signIn = async (email, password) => {
      return await supabase.auth.signInWithPassword({ email, password });
   };

   const signOut = async () => {
      return await supabase.auth.signOut();
   };

   // Valeurs exposées aux composants
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

// 3. Hook personnalisé pour utiliser le contexte facilement
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
   return useContext(AuthContext);
};
