// =================================================================================
// COMPOSANT : PROTECTED ROUTE
// Rôle : Gardien de sécurité. Redirige vers /login si l'utilisateur n'est pas connecté.
// =================================================================================

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children }) {
   const { user, loading } = useAuth();
   const location = useLocation();

   // 1. Pendant le chargement de Supabase, on affiche un loader pour ne pas ejecter l'user trop vite
   if (loading) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-stone-200 border-t-amber-600"></div>
         </div>
      );
   }

   // 2. Si pas d'utilisateur, on redirige vers Login en mémorisant d'où il vient (state)
   if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
   }

   // 3. Accès autorisé
   return children;
}
