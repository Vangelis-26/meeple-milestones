// =================================================================================
// COMPOSANT : FOOTER
// Rôle : Pied de page global avec navigation, crédits et informations légales.
// =================================================================================

import { Link } from 'react-router-dom';

export default function Footer() {
   const currentYear = new Date().getFullYear();

   return (
      <footer className="w-full mt-auto pt-24 pb-12 border-t border-stone-200/60 bg-[#FDFBF7] relative z-10 font-sans">
         <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none"></div>

         <div className="max-w-[90rem] mx-auto px-6 md:px-12 relative z-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">

               {/* --- COLONNE 1 : MARQUE --- */}
               <div className="lg:col-span-4 space-y-8">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 bg-white rounded-2xl border border-stone-100 shadow-sm p-2 flex items-center justify-center">
                        <img src="/logo.png" alt="Sceau" className="w-full h-full object-contain opacity-90" />
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

               {/* --- COLONNE 2 : NAVIGATION --- */}
               <div className="lg:col-span-2 lg:col-start-6 space-y-6">
                  <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Navigation</h5>
                  <ul className="space-y-4 text-[11px] font-bold text-stone-600 uppercase tracking-wide">
                     <li><Link to="/dashboard" className="hover:text-amber-700 hover:pl-1 transition-all">Dashboard</Link></li>
                     <li><Link to="/stats" className="hover:text-amber-700 hover:pl-1 transition-all">Sanctuaire</Link></li>
                     <li><Link to="/profile" className="hover:text-amber-700 hover:pl-1 transition-all">Mon Héritage</Link></li>
                  </ul>
               </div>

               {/* --- COLONNE 3 : TECH --- */}
               <div className="lg:col-span-3 space-y-6">
                  <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Crédits & Tech</h5>
                  <ul className="space-y-4 text-[11px] font-medium text-stone-500">
                     <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-amber-500"></span>
                        <span>Source : <a href="https://boardgamegeek.com" target="_blank" rel="noreferrer" className="underline decoration-stone-200 hover:decoration-amber-500 hover:text-amber-700 transition-colors">BoardGameGeek</a></span>
                     </li>
                     <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-amber-500"></span>
                        <span>Stack : React / Supabase / Tailwind</span>
                     </li>
                  </ul>
               </div>

               {/* --- COLONNE 4 : JURIDIQUE --- */}
               <div className="lg:col-span-2 lg:col-start-11 space-y-6">
                  <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Juridique</h5>
                  <ul className="space-y-3 text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                     <li><Link to="/legal#editor" className="hover:text-stone-900 transition-colors">Mentions Légales</Link></li>
                     <li><Link to="/legal#privacy" className="hover:text-stone-900 transition-colors">Données & RGPD</Link></li>
                     <li><Link to="/legal#copyright" className="hover:text-stone-900 transition-colors">Propriété</Link></li>
                  </ul>
               </div>
            </div>

            {/* --- BARRE FINALE --- */}
            <div className="pt-8 border-t border-stone-200 flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-[10px] font-medium text-stone-400 uppercase tracking-widest">
                  <span>© {currentYear} Meeple & Milestones.</span>
                  <span className="hidden md:inline w-px h-3 bg-stone-300"></span>
                  <span>Tous droits réservés.</span>
               </div>
               {/* Note sur l'accès privé */}
               <span className="text-[9px] font-black text-stone-300 uppercase tracking-[0.3em]">
                  Accès Privé • Édition 2026
               </span>
            </div>
         </div>
      </footer>
   );
}
