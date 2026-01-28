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

   const fetchUserGames = useCallback(async () => {
      if (!user) return; // Sécurité : on ne fetch rien si pas d'utilisateur
      try {
         const { data: challengeData } = await supabase.from('challenges').select('id').eq('user_id', user.id).single();
         if (!challengeData) return;

         const { data: itemsData } = await supabase
            .from('challenge_items')
            .select(`game_id, progress, games ( id, name, thumbnail_url )`)
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
      return () => window.removeEventListener('challengeUpdated', handleUpdate);
   }, [fetchUserGames]);

   const isGamePage = location.pathname.includes('/game/');
   const currentGame = games.find(g => g.id == currentGameId);

   return (
      <nav ref={menuRef} className="fixed top-0 left-0 w-full z-[100] bg-[#FDFBF7]/95 backdrop-blur-xl border-b border-stone-200 shadow-sm transition-all duration-300">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">

            {/* LOGO (Toujours visible) */}
            <div className="flex items-center gap-4 lg:gap-8 relative z-[120]">
               <Link to="/" className="flex items-center gap-3 group">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-md overflow-hidden bg-stone-100 flex items-center justify-center shrink-0">
                     <img src="/logo.webp" alt="Sceau" className="w-full h-full object-cover" />
                  </div>
                  <span className="font-serif font-extrabold uppercase tracking-[0.2em] text-stone-900 leading-tight hidden md:block text-[11px] sm:text-xs">
                     Meeple <span className="text-amber-600">&</span> Milestones
                  </span>
               </Link>

               {/* LINKS DESKTOP (Conditionnels : Visibles seulement si connecté) */}
               {user && (
                  <div className="hidden lg:flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">
                     <Link to="/dashboard" className={`hover:text-stone-900 transition-colors py-2 ${location.pathname === '/dashboard' ? 'text-stone-900 border-b-2 border-amber-500' : ''}`}>Dashboard</Link>
                     <span className="text-amber-600/30">/</span>
                     <Link to="/stats" className={`hover:text-stone-900 transition-colors py-2 ${location.pathname === '/stats' ? 'text-stone-900 border-b-2 border-amber-500' : ''}`}>Sanctuaire</Link>
                     <span className="text-amber-600/30">/</span>
                     <button onClick={() => setIsOpen(!isOpen)} className={`group flex items-center gap-2 py-2 transition-colors ${isOpen ? 'text-stone-900' : 'hover:text-stone-900'}`}>
                        Mes Archives
                        <svg className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180 text-amber-600' : 'text-stone-300'}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
                     </button>
                  </div>
               )}
            </div>

            {/* ACTIONS UTILISATEUR */}
            <div className="flex items-center gap-4 relative z-[120]">
               {user ? (
                  <button onClick={() => signOut()} className="group p-2 rounded-full hover:bg-red-50 transition-colors" title="Déconnexion">
                     <svg className="w-5 h-5 text-stone-400 group-hover:text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  </button>
               ) : (
                  <Link
                     to="/login"
                     className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 hover:text-amber-600 transition-all border border-stone-200 px-4 py-2 rounded-lg hover:border-amber-200 shadow-sm"
                  >
                     Connexion
                  </Link>
               )}

               {/* Mobile Toggle visible seulement pour naviguer si connecté */}
               {user && (
                  <div className="lg:hidden">
                     <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2 text-stone-800">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d={isMobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
                     </button>
                  </div>
               )}
            </div>
         </div>

         {/* --- DROPDOWN DESKTOP (Protégé) --- */}
         {user && isOpen && (
            <div className="hidden lg:block absolute top-full left-0 w-full bg-white border-b border-stone-200/50 shadow-2xl animate-in slide-in-from-top-2 duration-300 rounded-b-[2.5rem] overflow-hidden">
               <div className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-4 gap-6">
                  {games.map((game) => (
                     <Link key={game.id} to={`/game/${game.id}`} className="group flex items-center gap-4 p-3 bg-white rounded-2xl border border-stone-100 shadow-sm hover:border-amber-200 hover:-translate-y-1 transition-all duration-300">
                        <div className="w-14 h-14 shrink-0 rounded-xl overflow-hidden border-2 border-white shadow-sm bg-stone-100">
                           {game.thumb ? <img src={game.thumb} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-stone-300">?</div>}
                        </div>
                        <div className="flex-grow min-w-0">
                           <span className="text-sm font-serif font-bold text-stone-800 truncate block group-hover:text-amber-700">{game.name}</span>
                           <span className="text-[10px] font-black text-stone-400">{game.playCount}/10</span>
                        </div>
                     </Link>
                  ))}
               </div>
            </div>
         )}
      </nav>
   );
}
