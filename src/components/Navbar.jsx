import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
   const { user, signOut } = useAuth();
   const navigate = useNavigate();

   const handleLogout = async () => {
      await signOut();
      navigate("/");
   };

   return (
      // CHANGEMENT ICI : Couleur de fond plus chaude (#f0ece4) au lieu de white
      <nav className="bg-[#f0ece4]/90 backdrop-blur-md border-b border-[#d6d3d1] sticky top-0 z-50 shadow-sm">
         <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">

               {/* LOGO & TITRE */}
               <Link to="/" className="flex items-center gap-2 group">
                  {/* Icône (remplace par ton <img> plus tard si tu veux) */}
                  <div className="w-8 h-8 bg-amber-700 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition text-amber-50 font-bold text-sm shadow-sm border-b-2 border-amber-900">
                     M
                  </div>
                  <span className="font-serif font-bold text-stone-800 text-xl tracking-tight group-hover:text-amber-800 transition">
                     Meeple & Milestones
                  </span>
               </Link>

               {/* NAVIGATION */}
               <div className="flex items-center gap-4">

                  {user && (
                     <Link to="/dashboard" className="text-sm font-bold text-stone-600 hover:text-amber-800 transition">
                        Dashboard
                     </Link>
                  )}

                  {user && <div className="h-4 w-px bg-stone-400/50 mx-2"></div>}

                  {user ? (
                     <div className="flex items-center gap-4">
                        <span className="text-sm text-stone-600 hidden md:block font-medium font-serif italic">
                           {user.email}
                        </span>
                        <button
                           onClick={handleLogout}
                           className="text-sm text-stone-500 hover:text-red-700 font-bold transition"
                        >
                           Déconnexion
                        </button>
                     </div>
                  ) : (
                     <div className="flex items-center gap-3">
                        <Link
                           to="/login"
                           className="text-sm font-bold text-stone-600 hover:text-stone-900 transition"
                        >
                           Connexion
                        </Link>
                        {/* Bouton Inscription plus "Bois" */}
                        <Link
                           to="/login"
                           state={{ mode: 'signup' }}
                           className="text-sm bg-amber-800 text-amber-50 px-4 py-2 rounded-lg font-bold hover:bg-amber-900 transition border-b-2 border-amber-950 shadow-sm"
                        >
                           S'inscrire
                        </Link>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </nav>
   );
}
