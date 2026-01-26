import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
   const { user, signOut } = useAuth();
   const navigate = useNavigate();
   const [isMenuOpen, setIsMenuOpen] = useState(false);

   const handleSignOut = async () => {
      setIsMenuOpen(false);
      await signOut();
      navigate('/');
   };

   const closeMenu = () => setIsMenuOpen(false);

   return (
      <nav className="w-full bg-transparent relative z-50">

         <div className="max-w-[90rem] mx-auto px-4 md:px-8 py-4 flex justify-between items-center">

            {/* --- LOGO --- */}
            <Link to="/" className="flex items-center gap-2 md:gap-3 group" onClick={closeMenu}>
               <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-stone-800 overflow-hidden bg-white shadow-sm group-hover:scale-105 transition-transform">
                  <img src="/logo.webp" alt="Logo" className="w-full h-full object-cover" />
               </div>
               <span className="font-serif font-bold text-lg md:text-xl text-stone-800 tracking-tight group-hover:text-amber-700 transition-colors">
                  Meeple & Milestones
               </span>
            </Link>

            {/* --- DESKTOP MENU --- */}
            <div className="hidden md:flex items-center gap-4">
               {user ? (
                  <>
                     <Link
                        to="/dashboard"
                        className="text-stone-600 hover:text-stone-900 font-serif font-bold text-sm px-3 py-2 transition-colors"
                     >
                        Tableau de bord
                     </Link>
                     <button
                        onClick={handleSignOut}
                        className="text-stone-500 hover:text-red-600 p-2 transition-colors flex items-center gap-2 font-medium text-sm"
                        title="Se déconnecter"
                     >
                        <span>Déconnexion</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                     </button>
                  </>
               ) : (
                  <>
                     <Link
                        to="/login"
                        state={{ mode: 'login' }}
                        className="text-stone-600 hover:text-stone-900 font-serif font-bold text-sm px-3 py-2 transition-colors"
                     >
                        Se connecter
                     </Link>
                     <Link
                        to="/login"
                        state={{ mode: 'signup' }}
                        className="bg-stone-900 hover:bg-amber-700 text-amber-50 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-sm font-serif font-bold tracking-wide"
                     >
                        Créer un compte
                     </Link>
                  </>
               )}
            </div>

            {/* --- MOBILE HAMBURGER --- */}
            <button
               className="md:hidden text-stone-800 p-2 focus:outline-none"
               onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
               {isMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
               ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
               )}
            </button>
         </div>

         {/* --- MOBILE MENU DROPDOWN --- */}
         {isMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-stone-50 border-b border-stone-200 shadow-xl md:hidden animate-in slide-in-from-top-2 duration-200">
               <div className="flex flex-col p-4 gap-3">
                  {user ? (
                     <>
                        <Link
                           to="/dashboard"
                           onClick={closeMenu}
                           className="w-full bg-white border border-stone-200 p-4 rounded-xl font-serif font-bold text-stone-800 text-center shadow-sm active:scale-95 transition-transform"
                        >
                           Tableau de bord
                        </Link>
                        <button
                           onClick={handleSignOut}
                           className="w-full p-4 rounded-xl font-bold text-stone-500 hover:bg-stone-100 hover:text-red-600 transition-colors flex items-center justify-center gap-2"
                        >
                           <span>Se déconnecter</span>
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        </button>
                     </>
                  ) : (
                     <>
                        <Link
                           to="/login"
                           state={{ mode: 'login' }}
                           onClick={closeMenu}
                           className="w-full p-4 rounded-xl font-serif font-bold text-stone-600 text-center hover:bg-stone-100 transition-colors"
                        >
                           Se connecter
                        </Link>
                        <Link
                           to="/login"
                           state={{ mode: 'signup' }}
                           onClick={closeMenu}
                           className="w-full bg-stone-900 text-amber-50 p-4 rounded-xl font-serif font-bold text-center shadow-md active:bg-stone-800 active:scale-[0.98] transition-all"
                        >
                           Créer un compte
                        </Link>
                     </>
                  )}
               </div>
            </div>
         )}
      </nav>
   );
}
