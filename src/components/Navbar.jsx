// =================================================================================
// COMPOSANT : NAVBAR
// Rôle : Navigation principale, responsive, avec menu "Archives" dynamique.
// =================================================================================

import { useEffect, useLayoutEffect, useState, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
   // --- HOOKS & ÉTATS ---
   const location = useLocation();
   const { user, signOut } = useAuth();

   const [games, setGames] = useState([]); // Liste des jeux pour le dropdown
   const [isOpen, setIsOpen] = useState(false); // Menu Desktop
   const [isMobileOpen, setIsMobileOpen] = useState(false); // Menu Mobile

   const menuRef = useRef(null); // Pour détecter le clic en dehors

   // --- EFFETS ---

   // 1. Fermeture au clic en dehors
   useEffect(() => {
      const handleClickOutside = (event) => {
         if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsOpen(false);
            setIsMobileOpen(false);
         }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
   }, []);

   // 2. Fermeture au changement de page
   useLayoutEffect(() => {
      setIsOpen(false);
      setIsMobileOpen(false);
   }, [location.pathname]);

   // 3. Récupération des jeux (Pour le menu Archives)
   const fetchUserGames = useCallback(async () => {
      if (!user) return;
      try {
         // On récupère le challenge actif
         const { data: challengeData } = await supabase
            .from('challenges').select('id').eq('user_id', user.id).maybeSingle();

         if (!challengeData) return;

         // On récupère les jeux liés
         const { data: itemsData } = await supabase
            .from('challenge_items')
            .select(`game_id, progress, games ( id, name, thumbnail_url )`)
            .eq('challenge_id', challengeData.id);

         if (!itemsData) return;

         // Formatage
         const formattedGames = itemsData
            .filter(item => item.games)
            .map(item => ({
               id: item.games.id,
               name: item.games.name,
               thumb: item.games.thumbnail_url,
               playCount: item.progress || 0
            }));

         setGames(formattedGames.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {
         console.error("Erreur chargement navbar:", error);
      }
   }, [user]);

   // 4. Abonnement aux mises à jour globales (Déclenché par useChallenge)
   useEffect(() => {
      let isMounted = true;

      // Chargement initial
      fetchUserGames().catch(err => { if (isMounted) console.error(err); });

      // Écouteur d'événement custom
      const handleUpdate = () => { fetchUserGames().catch(console.error); };
      window.addEventListener('challengeUpdated', handleUpdate);

      return () => {
         isMounted = false;
         window.removeEventListener('challengeUpdated', handleUpdate);
      };
   }, [fetchUserGames]);

   // --- RENDU ---
   return (
      <nav ref={menuRef} className="fixed top-0 left-0 w-full z-[100] bg-[#FDFBF7]/95 backdrop-blur-xl border-b border-stone-200/60 shadow-sm transition-all duration-300 font-sans">

         <div className="max-w-[90rem] mx-auto px-4 md:px-12 py-3 sm:py-4 grid grid-cols-[48px_1fr_48px] lg:flex lg:items-center lg:justify-between items-center">

            {/* Spacer Mobile Gauche (Équilibre visuel) */}
            <div className="lg:hidden" aria-hidden="true"></div>

            {/* 1. LOGO & IDENTITÉ */}
            <div className="flex justify-center lg:justify-start relative z-[120]">
               <Link to="/" className="flex flex-col items-center lg:items-start lg:flex-row lg:gap-5 group">
                  <div className="relative w-11 h-11 lg:w-16 lg:h-16 transition-transform duration-500 group-hover:scale-105">
                     <img src="/logo.png" alt="Sceau" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex flex-col items-center lg:items-start mt-1.5 lg:mt-0">
                     <h1 className="font-serif font-black text-[17px] lg:text-2xl tracking-tighter text-stone-900 leading-none uppercase"> Meeple & Milestones </h1>
                     <div className="flex items-center gap-2 lg:gap-3 mt-1 lg:mt-1.5">
                        <div className="hidden lg:block h-[1px] w-10 bg-gradient-to-r from-amber-600 to-transparent"></div>
                        <span className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.25em] lg:tracking-[0.4em] text-amber-700 whitespace-nowrap">
                           Marquez votre histoire.
                        </span>
                     </div>
                  </div>
               </Link>
            </div>

            {/* 2. ACTIONS & NAVIGATION (Desktop) */}
            <div className="flex items-center justify-end relative z-[120]">

               {/* A. Mode Invité */}
               {!user && (
                  <div className="hidden lg:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em]">
                     <Link to="/login" className="text-stone-400 hover:text-stone-900 transition-colors">Accéder à mon Héritage</Link>
                     <div className="h-3 w-px bg-stone-200"></div>
                     <Link to="/login?mode=signup" className="text-stone-400 hover:text-amber-700 transition-colors">Rejoindre la Quête</Link>
                  </div>
               )}

               {/* B. Mode Connecté */}
               {user && (
                  <div className="hidden lg:flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 mr-2">
                     <Link to="/dashboard" className={`hover:text-stone-900 transition-colors py-2 ${location.pathname === '/dashboard' ? 'text-stone-900 border-b-2 border-amber-500' : ''}`}>Dashboard</Link>
                     <span className="text-amber-600/30">/</span>
                     <Link to="/stats" className={`hover:text-stone-900 transition-colors py-2 ${location.pathname === '/stats' ? 'text-stone-900 border-b-2 border-amber-500' : ''}`}>Sanctuaire</Link>
                     <span className="text-amber-600/30">/</span>
                     <Link to="/profile" className={`hover:text-stone-900 transition-colors py-2 ${location.pathname === '/profile' ? 'text-stone-900 border-b-2 border-amber-500' : ''}`}>Mon Héritage</Link>
                     <span className="text-amber-600/30">/</span>

                     {/* Trigger Dropdown Archives */}
                     <button onClick={() => setIsOpen(!isOpen)} className={`group flex items-center gap-2 py-2 transition-colors ${isOpen ? 'text-stone-900' : 'hover:text-stone-900'}`}>
                        Mes Archives <svg className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180 text-amber-600' : 'text-stone-300'}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
                     </button>

                     {/* Logout */}
                     <button onClick={() => signOut()} className="ml-6 p-2 text-stone-300 hover:text-red-500 transition-colors" title="Se déconnecter">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                     </button>
                  </div>
               )}

               {/* C. Bouton Mobile (Hamburger) */}
               <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="lg:hidden w-12 h-12 flex items-center justify-center text-stone-800 transition-transform active:scale-90">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                     {isMobileOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
                  </svg>
               </button>
            </div>
         </div>

         {/* 3. MENU MOBILE (Drawer) */}
         {isMobileOpen && (
            <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-stone-200 shadow-2xl animate-in slide-in-from-top-2 duration-300 overflow-hidden">
               <div className="flex flex-col p-6">
                  {user ? (
                     <div className="space-y-1">
                        <Link to="/dashboard" className="text-[11px] font-black uppercase tracking-widest text-stone-600 py-4 border-b border-stone-50 flex justify-between items-center"> Dashboard <span>→</span> </Link>
                        <Link to="/stats" className="text-[11px] font-black uppercase tracking-widest text-stone-600 py-4 border-b border-stone-50 flex justify-between items-center"> Sanctuaire <span>→</span> </Link>
                        <Link to="/profile" className="text-[11px] font-black uppercase tracking-widest text-stone-600 py-4 border-b border-stone-50 flex justify-between items-center"> Mon Héritage <span>→</span> </Link>

                        {/* Sous-menu Mobile Archives */}
                        <div className="py-4 border-b border-stone-50">
                           <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-amber-600">
                              Mes Archives <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
                           </button>
                           {isOpen && (
                              <div className="mt-4 grid grid-cols-1 gap-3 max-h-[40vh] overflow-y-auto pr-2">
                                 {games.map(game => (
                                    <Link key={game.id} to={`/game/${game.id}`} className="flex items-center gap-3 p-2 bg-stone-50 rounded-xl">
                                       <img src={game.thumb} className="w-10 h-10 rounded-lg object-cover" alt="" />
                                       <div className="flex-1 min-w-0">
                                          <p className="text-[10px] font-bold text-stone-800 truncate">{game.name}</p>
                                          <div className="h-1 w-full bg-stone-200 rounded-full mt-1 overflow-hidden">
                                             <div className={`h-full ${game.playCount >= 10 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${(game.playCount / 10) * 100}%` }} />
                                          </div>
                                       </div>
                                    </Link>
                                 ))}
                              </div>
                           )}
                        </div>
                        <button onClick={() => signOut()} className="mt-8 pt-4 border-t border-stone-100 text-[10px] font-black uppercase tracking-[0.2em] text-red-500 flex items-center gap-2">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg> Se déconnecter
                        </button>
                     </div>
                  ) : (
                     <div className="flex flex-col gap-6 py-6 items-center">
                        <Link to="/login" className="text-[11px] font-black uppercase tracking-[0.3em] text-stone-600 py-2">
                           Accéder à mon Héritage
                        </Link>
                        <div className="h-px w-8 bg-stone-100"></div>
                        <Link to="/login?mode=signup" className="w-full bg-stone-900 text-amber-50 text-center py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-xl">
                           Rejoindre la Quête
                        </Link>
                     </div>
                  )}
               </div>
            </div>
         )}

         {/* 4. MEGA-MENU ARCHIVES (Desktop) */}
         {user && isOpen && !isMobileOpen && (
            <div className="hidden lg:block absolute top-full left-0 w-full bg-white border-b border-stone-200/50 shadow-2xl animate-in slide-in-from-top-2 duration-300 rounded-b-[2.5rem] overflow-hidden">
               <div className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-4 gap-6">
                  {games.map((game) => (
                     <Link key={game.id} to={`/game/${game.id}`} className="group flex items-center gap-4 p-3 bg-white rounded-2xl border border-stone-100 shadow-sm hover:border-amber-200 hover:-translate-y-1 transition-all duration-300">
                        <div className="w-14 h-14 shrink-0 rounded-xl overflow-hidden border-2 border-white shadow-sm bg-stone-100">
                           {game.thumb ? <img src={game.thumb} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-stone-300">?</div>}
                        </div>
                        <div className="flex-grow min-w-0">
                           <div className="flex justify-between items-baseline mb-1">
                              <span className="text-sm font-serif font-bold text-stone-800 truncate group-hover:text-amber-700 transition-colors">{game.name}</span>
                              <span className={`text-[10px] font-bold ${game.playCount >= 10 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                 {game.playCount}<span className="text-stone-300">/10</span>
                              </span>
                           </div>
                           <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                              <div className={`h-full transition-all duration-1000 ease-out ${game.playCount >= 10 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${Math.min((game.playCount / 10) * 100, 100)}%` }} />
                           </div>
                        </div>
                     </Link>
                  ))}
                  {games.length === 0 && (
                     <div className="col-span-4 text-center py-4 text-stone-400 font-serif italic text-sm">
                        Votre collection est vide. Ajoutez un jeu via le Dashboard pour le voir apparaître ici.
                     </div>
                  )}
               </div>
            </div>
         )}
      </nav>
   );
}
