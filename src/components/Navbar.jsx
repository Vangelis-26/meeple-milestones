import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
   const { user, signOut } = useAuth();
   const location = useLocation();

   const isActive = (path) => location.pathname === path;

   return (
      <nav className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/90">
         <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">

               {/* GAUCHE : Logo & Marque */}
               <div className="flex items-center gap-3">
                  <Link to="/" className="flex items-center gap-3 group">
                     {/* Logo avec effet de rotation subtil au survol */}
                     <div className="relative w-10 h-10 rounded-full overflow-hidden border border-stone-200 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                        <img
                           src="/logo.webp"
                           alt="Logo"
                           className="w-full h-full object-cover group-hover:rotate-12 transition-transform duration-500 ease-out"
                        />
                     </div>
                     <span className="font-serif font-bold text-xl text-stone-800 tracking-tight group-hover:text-amber-700 transition-colors">
                        Meeple & Milestones
                     </span>
                  </Link>
               </div>

               {/* DROITE : Navigation & User */}
               <div className="flex items-center gap-4">
                  {user ? (
                     <>
                        <Link
                           to="/dashboard"
                           className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive('/dashboard')
                              ? 'bg-amber-50 text-amber-700 shadow-sm ring-1 ring-amber-200'
                              : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'
                              }`}
                        >
                           Tableau de bord
                        </Link>

                        <div className="h-6 w-px bg-stone-200 mx-1"></div>

                        <button
                           onClick={signOut}
                           className="text-stone-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-all"
                           title="Se déconnecter"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                           </svg>
                        </button>
                     </>
                  ) : (
                     <div className="flex items-center gap-3">
                        <Link to="/login" className="text-stone-500 hover:text-amber-700 font-medium text-sm px-3 py-2 transition-colors">
                           Se connecter
                        </Link>
                        <Link
                           to="/login"
                           state={{ mode: 'signup' }}
                           className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all"
                        >
                           Créer un compte
                        </Link>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </nav>
   );
}
