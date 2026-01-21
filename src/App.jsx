import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext"; // <--- On importe notre hook

export default function App() {
   const { user, signOut } = useAuth(); // <--- On récupère l'état global
   const navigate = useNavigate();

   const handleLogout = async () => {
      await signOut();
      navigate("/"); // Retour accueil après déco
   };

   return (
      <div className="min-h-screen bg-gray-50 text-gray-900">
         <nav className="p-4 bg-white shadow flex gap-4 items-center">
            <Link to="/" className="font-bold text-blue-600 text-xl">M&M</Link>

            {/* Liens toujours visibles */}
            <Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link>

            {/* Zone dynamique Auth */}
            <div className="ml-auto flex gap-4">
               {user ? (
                  // CAS CONNECTÉ
                  <div className="flex items-center gap-4">
                     <span className="text-sm text-gray-500">
                        {user.email}
                     </span>
                     <button
                        onClick={handleLogout}
                        className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
                     >
                        Déconnexion
                     </button>
                  </div>
               ) : (
                  // CAS NON CONNECTÉ
                  <Link
                     to="/login"
                     className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                     Connexion
                  </Link>
               )}
            </div>
         </nav>

         <main className="container mx-auto p-4">
            <Outlet />
         </main>
      </div>
   );
}
