import { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
   const location = useLocation();
   const { id: currentGameId } = useParams();
   const { user, signOut } = useAuth();
   const [games, setGames] = useState([]);
   const [isOpen, setIsOpen] = useState(false);
   const [isMobileOpen, setIsMobileOpen] = useState(false);
   const menuRef = useRef(null);

   useEffect(() => {
      function handleClickOutside(event) {
         if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsOpen(false);
         }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
   }, []);

   useEffect(() => {
      setIsMobileOpen(false);
      setIsOpen(false);
   }, [location]);

   useEffect(() => {
      document.body.style.overflow = isMobileOpen ? 'hidden' : 'unset';
      return () => { document.body.style.overflow = 'unset'; };
   }, [isMobileOpen]);

   const fetchUserGames = useCallback(async () => {
      if (!user) return;
      try {
         const { data: challengeData } = await supabase.from('challenges').select('id').eq('user_id', user.id).single();
         if (!challengeData) return;

         const { data: itemsData } = await supabase
            .from('challenge_items')
            .select(`
               game_id, 
               progress, 
               games ( id, name, thumbnail_url )
            `)
            .eq('challenge_id', challengeData.id);

         const formattedGames = itemsData
            .filter(item => item.games)
            .map(item => ({
               id: item.games.id,
               name: item.games.name,
               thumb: item.games.thumbnail_url,
               playCount: item.progress || 0
            }));

         setGames(formattedGames.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) { console.error(error); }
   }, [user]);

   useEffect(() => {
      fetchUserGames();
      const handleUpdate = () => fetchUserGames();
      window.addEventListener('challengeUpdated', handleUpdate);
      return () => {
         window.removeEventListener('challengeUpdated', handleUpdate);
      };
   }, [fetchUserGames]);

   const isGamePage = location.pathname.includes('/game/');
   const currentGame = games.find(g => g.id == currentGameId);

   return (
      <nav ref={menuRef} className="fixed top-0 left-0 w-full z-[100] bg-[#FDFBF7]/95 backdrop-blur-xl border-b border-stone-200 shadow-sm transition-all duration-300">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">

            {/* LOGO */}
            <div className="flex items-center gap-4 lg:gap-8 xl:gap-12 relative z-[120]">
               <Link to="/" className="flex items-center gap-3 group">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-md overflow-hidden bg-stone-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                     <img src="/logo.webp" alt="Sceau" className="w-full h-full object-cover" />
                  </div>
                  <span className="font-serif font-extrabold uppercase tracking-[0.2em] text-stone-900 leading-tight hidden md:block text-xs sm:text-sm">
                     Meeple <span className="text-amber-600">&</span> Milestones
                  </span>
               </Link>

               {/* LINKS DESKTOP */}
               <div className="hidden lg:flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">
                  <Link to="/dashboard" className={`hover:text-stone-900 transition-colors py-2 ${location.pathname === '/dashboard' ? 'text-stone-900 border-b-2 border-amber-500' : ''}`}>Dashboard</Link>
                  <span className="text-amber-600/30">/</span>
                  <Link to="/stats" className={`hover:text-stone-900 transition-colors py-2 ${location.pathname === '/stats' ? 'text-stone-900 border-b-2 border-amber-500' : ''}`}>Sanctuaire</Link>
                  <span className="text-amber-600/30">/</span>

                  {/* BOUTON DROPDOWN ACTIF */}
                  <button onClick={() => setIsOpen(!isOpen)} className={`group flex items-center gap-2 py-2 transition-colors ${isOpen ? 'text-stone-900' : 'hover:text-stone-900'}`}>
                     Mes Archives
                     <svg className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180 text-amber-600' : 'text-stone-300'}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
                  </button>

                  {/* BREADCRUMB JEU ACTIF */}
                  {isGamePage && currentGame && (
                     <>
                        <span className="text-amber-600/30">/</span>
                        <span className="text-stone-900 tracking-widest truncate max-w-[150px] animate-in fade-in slide-in-from-left-2 duration-500">{currentGame.name}</span>
                     </>
                  )}
               </div>
            </div>

            {/* MOBILE TOGGLE */}
            <div className="lg:hidden relative z-[120]">
               <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2 text-stone-800">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d={isMobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
               </button>
            </div>

            {/* LOGOUT */}
            {user && (
               <div className="hidden lg:flex items-center gap-6 relative z-[120]">
                  <button onClick={() => signOut()} className="group p-2 rounded-full hover:bg-red-50 transition-colors">
                     <svg className="w-5 h-5 text-stone-400 group-hover:text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  </button>
               </div>
            )}
         </div>

         {/* --- DROPDOWN DESKTOP PREMIUM (FINITIONS) --- */}
         <div className={`hidden lg:block absolute top-full left-0 w-full bg-white border-b border-stone-200/50 shadow-[0_25px_60px_-15px_rgba(28,25,23,0.3)] transition-all duration-500 ease-out origin-top rounded-b-[2.5rem] overflow-hidden ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'}`}>

            {/* LIGNE DE SÉPARATION OR */}
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-70"></div>

            <div className="max-w-7xl mx-auto px-8 py-10 pb-12 grid grid-cols-4 gap-6 relative z-10">
               {games.map((game) => (
                  <Link
                     key={game.id}
                     to={`/game/${game.id}`}
                     className="group relative flex items-center gap-4 p-3 pr-5 bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:border-amber-200 hover:-translate-y-1 transition-all duration-300 ease-out"
                     onClick={() => setIsOpen(false)}
                  >
                     {/* IMAGE "CADRE" */}
                     <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden border-2 border-white shadow-md bg-stone-100 group-hover:shadow-lg transition-all relative">
                        {game.thumb ? (
                           <img src={game.thumb} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[10%] group-hover:grayscale-0" />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center text-stone-300">
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                           </div>
                        )}
                     </div>

                     {/* INFO CONTENU */}
                     <div className="flex-grow min-w-0 flex flex-col justify-center">
                        <div className="mb-2">
                           <span className="text-sm font-serif font-bold text-stone-800 truncate block pr-2 group-hover:text-amber-700 transition-colors leading-tight">
                              {game.name}
                           </span>
                        </div>

                        {/* JAUGE OR */}
                        <div className="flex items-center gap-3">
                           <div className="h-1.5 flex-grow bg-stone-100 rounded-full overflow-hidden border border-stone-100/50">
                              <div
                                 className="h-full bg-gradient-to-r from-amber-300 to-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)] transition-all duration-1000 ease-out"
                                 style={{ width: `${Math.max(5, (game.playCount / 10) * 100)}%` }}
                              ></div>
                           </div>
                           <span className="text-[10px] font-black text-stone-400 group-hover:text-stone-600 transition-colors">
                              {game.playCount}/10
                           </span>
                        </div>
                     </div>
                  </Link>
               ))}
            </div>

            {/* EFFET DE PROFONDEUR (Ombre interne remontante en bas) */}
            <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-stone-100/60 to-transparent pointer-events-none"></div>
         </div>

         {/* MENU MOBILE */}
         {isMobileOpen && (
            <div className="lg:hidden fixed inset-0 z-[110] bg-[#FDFBF7] pt-[80px] px-6 space-y-4 animate-in slide-in-from-top-5 duration-300">
               <Link to="/dashboard" onClick={() => setIsMobileOpen(false)} className="block p-5 rounded-xl bg-stone-900 text-amber-50 text-center font-serif font-bold shadow-lg">Dashboard</Link>
               <Link to="/stats" onClick={() => setIsMobileOpen(false)} className="block p-5 rounded-xl border-2 border-stone-900 text-stone-900 text-center font-serif font-bold">Sanctuaire des Stats</Link>
               <div className="h-px bg-stone-200 my-4"></div>
               <div className="max-h-[60vh] overflow-y-auto space-y-2 pb-10">
                  {games.map(game => (
                     <Link key={game.id} to={`/game/${game.id}`} onClick={() => setIsMobileOpen(false)} className="flex items-center gap-4 p-3 bg-white rounded-xl border border-stone-200 shadow-sm active:scale-95 transition-transform">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-100">
                           {game.thumb && <img src={game.thumb} className="w-full h-full object-cover" alt="" />}
                        </div>
                        <div className="flex-grow">
                           <span className="font-serif font-bold text-stone-800 text-sm block mb-1">{game.name}</span>
                           <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(game.playCount / 10) * 100}%` }}></div>
                           </div>
                        </div>
                        <span className="text-xs text-amber-600 font-bold shrink-0">{game.playCount}/10</span>
                     </Link>
                  ))}
               </div>
            </div>
         )}
      </nav>
   );
}
