import { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
   const location = useLocation();
   const { id: currentGameId } = useParams();
   const { user, signOut } = useAuth();
   const [games, setGames] = useState([]);

   // --- ÉTATS ---
   const [isOpen, setIsOpen] = useState(false);
   const [isMobileOpen, setIsMobileOpen] = useState(false);
   const menuRef = useRef(null);

   // --- FERMETURE AU CLIC EXTÉRIEUR ---
   useEffect(() => {
      function handleClickOutside(event) {
         if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsOpen(false);
         }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
   }, [menuRef]);

   useEffect(() => {
      setIsMobileOpen(false);
      setIsOpen(false);
   }, [location]);

   // Bloque le scroll sur mobile
   useEffect(() => {
      document.body.style.overflow = isMobileOpen ? 'hidden' : 'unset';
      return () => { document.body.style.overflow = 'unset'; };
   }, [isMobileOpen]);

   // =========================================================================
   // ⚡ CHARGEMENT INTELLIGENT & REALTIME
   // =========================================================================
   useEffect(() => {
      if (!user) return;

      const fetchUserGames = async () => {
         try {
            // 1. Récupérer l'ID du challenge de l'utilisateur
            const { data: challengeData, error: challengeError } = await supabase
               .from('challenges')
               .select('id')
               .eq('user_id', user.id)
               .single();

            if (challengeError || !challengeData) return;

            // 2. Récupérer les jeux du challenge
            const { data: itemsData, error: itemsError } = await supabase
               .from('challenge_items')
               .select(`
                  game_id,
                  games ( id, name )
               `)
               .eq('challenge_id', challengeData.id);

            if (itemsError) throw itemsError;

            // 3. Récupérer les parties pour le score
            const { data: playsData, error: playsError } = await supabase
               .from('plays')
               .select('game_id')
               .eq('user_id', user.id);

            if (playsError) throw playsError;

            // 4. Formatage
            const formattedGames = itemsData
               .filter(item => item.games)
               .map(item => ({
                  id: item.games.id,
                  name: item.games.name,
                  playCount: playsData.filter(p => p.game_id === item.games.id).length
               }));

            setGames(formattedGames.sort((a, b) => a.name.localeCompare(b.name)));

         } catch (error) {
            console.error("Erreur sync navbar:", error);
         }
      };

      fetchUserGames();

      // 📡 ABONNEMENT REALTIME CIBLÉ
      // On écoute 'challenge_items' pour savoir quand un jeu est retiré/ajouté
      const channel = supabase
         .channel('navbar-user-changes')
         .on(
            'postgres_changes',
            { event: '*', schema: 'public' },
            (payload) => {
               // Si on touche à la collection (challenge_items) ou aux parties (plays)
               if (['challenge_items', 'plays', 'games'].includes(payload.table)) {
                  console.log('🔄 Navbar Update:', payload.eventType, 'sur', payload.table);
                  fetchUserGames();
               }
            }
         )
         .subscribe();

      return () => {
         supabase.removeChannel(channel);
      };
   }, [user]);

   const isGamePage = location.pathname.includes('/game/');
   const currentGame = games.find(g => g.id == currentGameId);

   return (
      <nav
         ref={menuRef}
         className="fixed top-0 left-0 w-full z-[100] bg-white/95 backdrop-blur-xl border-b border-stone-200/60 shadow-sm transition-all duration-300"
      >
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">

            {/* --- GAUCHE --- */}
            <div className="flex items-center gap-4 lg:gap-8 xl:gap-12 relative z-[120]">
               <Link to="/" className="flex items-center gap-3 group">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-md overflow-hidden group-hover:scale-105 transition-transform bg-stone-100 flex items-center justify-center shrink-0">
                     <div className="w-full h-full p-0.5">
                        <img src="/logo.webp" alt="Sceau" className="w-full h-full object-cover" />
                     </div>
                  </div>
                  <span className="font-serif font-extrabold uppercase tracking-[0.2em] text-stone-900 leading-tight">
                     <span className="block md:hidden text-lg tracking-widest">M<span className="text-amber-600">&</span>M</span>
                     <span className="hidden md:block text-xs sm:text-sm">Meeple <span className="text-amber-600">&</span> Milestones</span>
                  </span>
               </Link>

               <div className="hidden lg:flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">
                  <Link to="/dashboard" className="hover:text-stone-900 transition-colors py-2">Dashboard</Link>
                  <span className="text-amber-600/30">/</span>
                  <button
                     onClick={() => setIsOpen(!isOpen)}
                     className={`group flex items-center gap-2 py-2 transition-colors ${isOpen ? 'text-stone-900' : 'hover:text-stone-900'}`}
                  >
                     Mes Archives
                     <svg className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180 text-amber-600' : 'text-stone-300 group-hover:text-stone-500'}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {isGamePage && currentGame && (
                     <>
                        <span className="text-amber-600/30">/</span>
                        <span className="text-stone-900 tracking-widest truncate max-w-[150px] animate-in fade-in slide-in-from-left-2">{currentGame.name}</span>
                     </>
                  )}
               </div>
            </div>

            {/* --- DROITE --- */}
            <div className="lg:hidden relative z-[120]">
               <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2 text-stone-800 hover:text-amber-600 transition-colors">
                  {isMobileOpen ? (
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  ) : (
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
                  )}
               </button>
            </div>

            <div className="hidden lg:flex items-center gap-6">
               {!user ? (
                  <div className="flex items-center gap-4">
                     <Link to="/login" className="text-[10px] font-bold uppercase tracking-widest text-stone-500 hover:text-amber-700">Se connecter</Link>
                     <Link to="/login" state={{ mode: 'signup' }} className="px-5 py-2 rounded-full bg-stone-900 text-amber-50 text-[10px] font-serif font-bold hover:bg-amber-700 hover:shadow-lg hover:-translate-y-0.5 transition-all">Créer un compte</Link>
                  </div>
               ) : (
                  <div className="flex items-center gap-6">
                     <div className="flex flex-col items-end opacity-60">
                        <span className="text-[9px] font-black text-stone-900 uppercase tracking-widest">Challenge 10x10</span>
                        <span className="text-[10px] font-serif italic text-amber-700 font-bold">2026</span>
                     </div>
                     <div className="h-6 w-px bg-stone-200"></div>
                     <button onClick={() => signOut()} className="group p-2 rounded-full hover:bg-red-50 transition-colors" title="Se déconnecter">
                        <svg className="w-5 h-5 text-stone-400 group-hover:text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                     </button>
                  </div>
               )}
            </div>
         </div>

         {/* --- DROPDOWN --- */}
         <div className={`hidden lg:block absolute top-full left-0 w-full bg-[#FDFBF7] border-b border-stone-200/60 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 ease-in-out origin-top transform ${isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
               <div className="border-b border-stone-200/50 pb-4 mb-6 flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400/80">Collection Active</span>
                  <span className="text-[9px] font-serif italic text-amber-700/60">Archives du challenge</span>
               </div>
               <div className="grid grid-cols-5 gap-4">
                  {games.map((game) => {
                     const isSelected = currentGameId == game.id;
                     const isComplete = game.playCount >= 10;
                     return (
                        <Link key={game.id} to={`/game/${game.id}`} onClick={() => setIsOpen(false)} className={`group relative p-4 rounded-xl border transition-all duration-300 flex flex-col gap-4 overflow-hidden ${isSelected ? 'bg-white border-amber-500 shadow-md ring-1 ring-amber-500/20' : 'bg-white border-stone-200 hover:border-amber-400 hover:shadow-lg hover:-translate-y-1'}`}>
                           <div className="flex justify-between items-start z-10">
                              <span className={`text-sm font-serif font-extrabold tracking-tight leading-tight transition-colors ${isSelected ? 'text-amber-800' : 'text-stone-800 group-hover:text-stone-900'}`}>{game.name}</span>
                              <span className={`text-[10px] font-black ${isComplete ? 'text-amber-600' : 'text-stone-300 group-hover:text-amber-600'}`}>{game.playCount}/10</span>
                           </div>
                           <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden border border-stone-100 z-10">
                              <div className={`h-full transition-all duration-1000 ease-out shadow-sm ${isComplete ? 'bg-amber-500' : 'bg-amber-600'}`} style={{ width: `${Math.min((game.playCount / 10) * 100, 100)}%` }}></div>
                           </div>
                           <div className="absolute inset-0 bg-gradient-to-br from-amber-50/0 to-amber-50/0 group-hover:to-amber-50/10 transition-all duration-500"></div>
                        </Link>
                     );
                  })}
               </div>
            </div>
         </div>

         {/* --- MOBILE --- */}
         {isMobileOpen && (
            <div className="lg:hidden fixed inset-0 z-[110] bg-[#FDFBF7] h-screen w-full flex flex-col animate-in fade-in duration-300">
               <div className="flex-1 overflow-y-auto pt-[88px] px-6 pb-20 space-y-8">
                  {!user && (
                     <div className="grid grid-cols-2 gap-4">
                        <Link to="/login" onClick={() => setIsMobileOpen(false)} className="py-3 text-center rounded-lg border border-stone-200 text-stone-600 font-bold text-xs uppercase tracking-wider">Se connecter</Link>
                        <Link to="/login" state={{ mode: 'signup' }} onClick={() => setIsMobileOpen(false)} className="py-3 text-center rounded-lg bg-stone-900 text-amber-50 font-bold text-xs uppercase tracking-wider shadow-md">Créer compte</Link>
                     </div>
                  )}
                  <Link to="/dashboard" onClick={() => setIsMobileOpen(false)} className="block p-5 rounded-xl bg-gradient-to-br from-stone-800 to-stone-900 text-amber-50 text-center font-serif font-bold text-lg shadow-lg active:scale-95 transition-transform">Ouvrir le Dashboard</Link>
                  <div>
                     <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 mb-6 border-b border-stone-200 pb-2">Collection Active</h3>
                     <div className="space-y-3">
                        {games.map(game => (
                           <Link key={game.id} to={`/game/${game.id}`} onClick={() => setIsMobileOpen(false)} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${currentGameId == game.id ? 'bg-white border-amber-500 shadow-md' : 'bg-white border-stone-200 shadow-sm'}`}>
                              <span className={`font-serif font-bold text-sm ${currentGameId == game.id ? 'text-amber-900' : 'text-stone-800'}`}>{game.name}</span>
                              <div className="flex items-center gap-3">
                                 <div className="w-16 h-1.5 bg-stone-100 rounded-full overflow-hidden border border-stone-100">
                                    <div className={`h-full ${game.playCount >= 10 ? 'bg-green-500' : 'bg-amber-500'}`} style={{ width: `${Math.min((game.playCount / 10) * 100, 100)}%` }}></div>
                                 </div>
                                 <span className="text-[10px] font-black text-stone-400 w-6 text-right">{game.playCount}</span>
                              </div>
                           </Link>
                        ))}
                     </div>
                  </div>
                  {user && (
                     <button onClick={() => { signOut(); setIsMobileOpen(false); }} className="w-full py-4 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-100 transition-colors mt-4 flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg> Se déconnecter
                     </button>
                  )}
                  <div className="pt-4 text-center opacity-40 pb-8"><p className="text-[10px] uppercase font-black tracking-widest text-stone-400">Challenge 10x10 • 2026</p></div>
               </div>
            </div>
         )}
      </nav>
   );
}
