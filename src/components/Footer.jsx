import { Link } from 'react-router-dom';

export default function Footer() {
   const currentYear = new Date().getFullYear();

   return (
      <footer className="w-full mt-auto pt-24 pb-12 border-t border-stone-200/60 bg-[#FDFBF7] relative z-10 font-sans">
         {/* Texture de fond */}
         <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none"></div>

         <div className="max-w-[90rem] mx-auto px-6 md:px-12 relative z-20">

            {/* --- GRILLE PRINCIPALE --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">

               {/* COL 1 : MARQUE */}
               <div className="lg:col-span-4 space-y-8">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 bg-white rounded-2xl border border-stone-100 shadow-sm p-2 flex items-center justify-center">
                        <img src="/logo.png" alt="Sceau Meeple & Milestones" className="w-full h-full object-contain opacity-90" />
                     </div>
                     <div className="flex flex-col">
                        <span className="text-base font-serif font-black text-stone-900 uppercase tracking-widest leading-none mb-1">
                           Meeple & <br />Milestones
                        </span>
                        <span className="text-[9px] font-bold text-amber-700 uppercase tracking-[0.2em]">
                           Tracker de Collection
                        </span>
                     </div>
                  </div>

                  <p className="text-xs leading-relaxed text-stone-500 font-medium max-w-sm">
                     Conçu pour les collectionneurs exigeants.
                     Suivez vos défis, analysez vos statistiques et forgez votre légende ludique.
                  </p>

                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50/50 px-3 py-1.5 rounded-full w-fit border border-emerald-100">
                     <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                     </span>
                     <span>Système Opérationnel</span>
                  </div>
               </div>

               {/* COL 2 : NAVIGATION */}
               <div className="lg:col-span-2 lg:col-start-6 space-y-6">
                  <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                     Navigation
                  </h5>
                  <ul className="space-y-4 text-[11px] font-bold text-stone-600 uppercase tracking-wide">
                     <li><Link to="/dashboard" className="hover:text-amber-700 hover:pl-1 transition-all">Dashboard</Link></li>
                     <li><Link to="/stats" className="hover:text-amber-700 hover:pl-1 transition-all">Sanctuaire</Link></li>
                     <li><Link to="/profile" className="hover:text-amber-700 hover:pl-1 transition-all">Mon Héritage</Link></li>
                  </ul>
               </div>

               {/* COL 3 : CRÉDITS */}
               <div className="lg:col-span-3 space-y-6">
                  <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                     Crédits & Tech
                  </h5>
                  <ul className="space-y-4 text-[11px] font-medium text-stone-500">
                     <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-amber-500"></span>
                        <span>Data source : <a href="https://boardgamegeek.com" target="_blank" rel="noreferrer" className="underline decoration-stone-200 hover:decoration-amber-500 hover:text-amber-700 transition-colors">BoardGameGeek API</a></span>
                     </li>
                     <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-amber-500"></span>
                        <span>Stack : React / Supabase / Tailwind</span>
                     </li>
                     <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-amber-500"></span>
                        <span>Version : <span className="text-stone-800 font-mono text-[10px]">1.0 (Portfolio)</span></span>
                     </li>
                  </ul>
               </div>

               {/* COL 4 : JURIDIQUE */}
               <div className="lg:col-span-3 lg:col-start-11 space-y-6">
                  <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                     Juridique
                  </h5>
                  <ul className="space-y-3 text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                     <li><Link to="/legal#editor" className="hover:text-stone-900 transition-colors">Mentions Légales</Link></li>
                     <li><Link to="/legal#privacy" className="hover:text-stone-900 transition-colors">Données & RGPD</Link></li>
                     <li><Link to="/legal#cookies" className="hover:text-stone-900 transition-colors">Cookies</Link></li>
                  </ul>
               </div>

            </div>

            {/* --- BOTTOM BAR --- */}
            <div className="pt-8 border-t border-stone-200 flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-[10px] font-medium text-stone-400 uppercase tracking-widest text-center md:text-left">
                  {/* ICI : Remplacement par le pseudo */}
                  <span>© {currentYear} Vangelis-26.</span>
                  <span className="hidden md:inline w-px h-3 bg-stone-300"></span>
                  <span>Tous droits réservés.</span>
               </div>

               <div className="flex items-center gap-4">
                  <a
                     href="https://github.com/Vangelis-26"
                     target="_blank"
                     rel="noopener noreferrer"
                     className="group flex items-center gap-3 px-5 py-2.5 bg-stone-900 rounded-lg transition-all duration-300 hover:bg-black hover:shadow-lg hover:-translate-y-0.5"
                  >
                     <span className="text-[9px] font-black text-stone-300 group-hover:text-white transition-colors uppercase tracking-[0.25em]">
                        GitHub
                     </span>
                     <svg className="w-3.5 h-3.5 text-stone-500 group-hover:text-amber-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                     </svg>
                  </a>
               </div>
            </div>

         </div>
      </footer>
   );
}
