import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children }) {
   const { user, loading } = useAuth();

   if (loading) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-paper-texture">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-stone-200 border-t-amber-600"></div>
         </div>
      );
   }

   if (!user) {
      // Si pas connecté, on renvoie vers le login
      return <Navigate to="/login" />;
   }

   // Si connecté, on affiche la page demandée (Dashboard)
   return children;
}
