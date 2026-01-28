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

   // Fonction de chargement des jeux isolée et mémorisée
   const fetchUserGames = useCallback(async () => {
      if (!user) return;
      try {
         const { data: challengeData } = await supabase.from('challenges').select('id').eq('user_id', user.id).single();
         if (!challengeData) return;

         const { data: itemsData } = await supabase.from('challenge_items').select(`game_id, progress, games ( id, name )`).eq('challenge_id', challengeData.id);

         // On récupère la progression directement depuis challenge_items pour plus de rapidité et de cohérence
         const formattedGames = itemsData.filter(item => item.games).map(item => ({
            id: item.games.id,
            name: item.games.name,
            playCount: item.progress || 0 // Utilisation directe de la progression
         }));

         setGames(formattedGames.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) { console.error(error); }
   }, [user]);

   // Chargement initial + Écoute de l'événement global de mise à jour
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
      <nav ref={menuRef} className="fixed top-0 left-0 w-full z-[100] bg-white/95 backdrop-blur-xl border-b border-stone-200/60 shadow-sm">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-4 lg:gap-8 xl:gap-12 relative z-[120]">
               <Link to="/" className="flex items-center gap-3 group">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-md overflow-hidden bg-stone-100 flex items-center justify-center shrink-0">
                     <img src="/logo.webp" alt="Sceau" className="w-full h-full object-cover" />
                  </div>
                  <span className="font-serif font-extrabold uppercase tracking-[0.2em] text-stone-900 leading-tight hidden md:block text-xs sm:text-sm">
                     Meeple <span className="text-amber-600">&</span> Milestones
                  </span>
               </Link>

               <div className="hidden lg:flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">
                  <Link to="/dashboard" className={`hover:text-stone-900 transition-colors py-2 ${location.pathname === '/dashboard' ? 'text-stone-900 border-b-2 border-amber-500' : ''}`}>Dashboard</Link>
                  <span className="text-amber-600/30">/</span>
                  <Link to="/stats" className={`hover:text-stone-900 transition-colors py-2 ${location.pathname === '/stats' ? 'text-stone-900 border-b-2 border-amber-500' : ''}`}>Sanctuaire</Link>
                  <span className="text-amber-600/30">/</span>
                  <button onClick={() => setIsOpen(!isOpen)} className={`group flex items-center gap-2 py-2 transition-colors ${isOpen ? 'text-stone-900' : 'hover:text-stone-900'}`}>
                     Mes Archives
                     <svg className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180 text-amber-600' : 'text-stone-300'}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {isGamePage && currentGame && (
                     <>
                        <span className="text-amber-600/30">/</span>
                        <span className="text-stone-900 tracking-widest truncate max-w-[150px]">{currentGame.name}</span>
                     </>
                  )}
               </div>
            </div>

            <div className="lg:hidden relative z-[120]">
               <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2 text-stone-800">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d={isMobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
               </button>
            </div>

            {user && (
               <div className="hidden lg:flex items-center gap-6">
                  <button onClick={() => signOut()} className="group p-2 rounded-full hover:bg-red-50 transition-colors">
                     <svg className="w-5 h-5 text-stone-400 group-hover:text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  </button>
               </div>
            )}
         </div>

         {/* DROPDOWN DESKTOP */}
         <div className={`hidden lg:block absolute top-full left-0 w-full bg-[#FDFBF7] border-b border-stone-200/60 shadow-xl transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
            <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-5 gap-4">
               {games.map((game) => (
                  <Link key={game.id} to={`/game/${game.id}`} className="p-4 bg-white rounded-xl border border-stone-200 hover:border-amber-400 transition-all">
                     <span className="text-sm font-serif font-extrabold text-stone-800 block mb-2 truncate">{game.name}</span>
                     <div className="h-1 w-full bg-stone-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: `${(game.playCount / 10) * 100}%` }}></div>
                     </div>
                  </Link>
               ))}
            </div>
         </div>

         {/* MENU MOBILE */}
         {isMobileOpen && (
            <div className="lg:hidden fixed inset-0 z-[110] bg-[#FDFBF7] pt-[80px] px-6 space-y-4">
               <Link to="/dashboard" className="block p-5 rounded-xl bg-stone-900 text-amber-50 text-center font-serif font-bold">Dashboard</Link>
               <Link to="/stats" className="block p-5 rounded-xl border-2 border-stone-900 text-stone-900 text-center font-serif font-bold">Sanctuaire des Stats</Link>
               <div className="h-px bg-stone-200 my-4"></div>
               <div className="max-h-[50vh] overflow-y-auto space-y-2">
                  {games.map(game => (
                     <Link key={game.id} to={`/game/${game.id}`} className="flex justify-between p-4 bg-white rounded-xl border border-stone-200">
                        <span className="font-serif font-bold truncate">{game.name}</span>
                        <span className="text-xs text-amber-600 font-bold shrink-0">{game.playCount}/10</span>
                     </Link>
                  ))}
               </div>
            </div>
         )}
      </nav>
   );
}
