import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../src/hooks/useAuth";

export default function RequireAuth({ children }) {
   const { user, loading } = useAuth();
   const location = useLocation();

   // 1. Si on est encore en train de demander à Supabase "C'est qui ?", on attend.
   // Sinon on risque de rejeter l'utilisateur trop vite avant d'avoir la réponse.
   if (loading) {
      return <div className="p-4 text-center">Chargement...</div>;
   }

   // 2. Si après chargement, pas d'utilisateur -> Dehors !
   // replace: true évite que l'utilisateur puisse faire "Précédent" pour revenir ici
   // state: on garde en mémoire d'où il venait pour le renvoyer là après le login (UX pro)
   if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
   }

   // 3. Tout est bon, on affiche la page demandée
   return children;
}
