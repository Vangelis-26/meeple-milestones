import { Link } from 'react-router-dom';

export default function Footer() {
   return (
      <footer className="w-full mt-24 pb-12 border-t border-stone-200 bg-[#FDFBF7]/50 relative z-10">
         <div className="max-w-[90rem] mx-auto px-6 md:px-12">

            {/* --- SECTION PRINCIPALE : 4 COLONNES --- */}
            <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

               {/* 1. IDENTITÉ & MISSION */}
               <div className="space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 drop-shadow-md">
                        <img src="/logo.png" alt="Sceau Meeple & Milestones" className="w-full h-full object-contain" />
                     </div>
                     <div className="flex flex-col">
                        <span className="text-sm font-serif font-black text-stone-900 uppercase tracking-[0.2em]">
                           Meeple & Milestones
                        </span>
                        <span className="text-[10px] font-bold text-amber-700 uppercase tracking-[0.3em]">
                           L'Âge d'Or
                        </span>
                     </div>
                  </div>
                  <p className="text-xs leading-relaxed text-stone-500 font-serif italic max-w-[280px]">
                     "Gravez votre épopée ludique dans le marbre numérique. Un sanctuaire dédié à la persévérance et à l'art du jeu de société."
                  </p>
               </div>

               {/* 2. NAVIGATION RAPIDE */}
               <div className="space-y-6">
                  <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-900 border-b border-amber-500/30 pb-2 w-fit">
                     Navigation
                  </h5>
                  <ul className="space-y-3 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                     <li><Link to="/dashboard" className="hover:text-amber-700 transition-colors">Dashboard</Link></li>
                     <li><Link to="/stats" className="hover:text-amber-700 transition-colors">Le Sanctuaire</Link></li>
                     <li><Link to="/archives" className="hover:text-amber-700 transition-colors">Mes Archives</Link></li>
                  </ul>
               </div>

               {/* 3. FORGE TECHNIQUE & CRÉDITS */}
               <div className="space-y-6">
                  <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-900 border-b border-amber-500/30 pb-2 w-fit">
                     La Forge
                  </h5>
                  <ul className="space-y-4 text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                     <li className="flex items-start gap-2">
                        <span className="text-amber-600 mt-0.5">✦</span>
                        <span>Données : <a href="https://boardgamegeek.com" className="underline hover:text-amber-700">BoardGameGeek API</a></span>
                     </li>
                     <li className="flex items-start gap-2">
                        <span className="text-amber-600 mt-0.5">✦</span>
                        <span>Design : <span className="text-stone-400">Gemini AI Assisted</span></span>
                     </li>
                     <li className="flex items-start gap-2">
                        <span className="text-amber-600 mt-0.5">✦</span>
                        <span>Infrastructure : <span className="text-stone-400">React & Supabase</span></span>
                     </li>
                  </ul>
               </div>

               {/* 4. DISPOSITIONS LÉGALES */}
               <div className="space-y-6">
                  <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-900 border-b border-amber-500/30 pb-2 w-fit">
                     Légal
                  </h5>
                  <div className="text-[9px] leading-relaxed text-stone-400 font-medium space-y-3">
                     <p>
                        "Meeple" est une marque déposée de Hans im Glück. Ce projet est une œuvre indépendante sans affiliation officielle.
                     </p>
                     <p>
                        Les jaquettes, illustrations et noms des jeux originaux sont la propriété exclusive de leurs éditeurs et auteurs respectifs.
                     </p>
                     <p>
                        Conformément au RGPD, vos données sont privées. Vous disposez d'un droit total d'accès et de suppression via votre profil.
                     </p>
                  </div>
               </div>
            </div>

            {/* --- BARRE DE COPYRIGHT FINALE --- */}
            <div className="pt-8 border-t border-stone-200 flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="text-[10px] font-black text-stone-600 uppercase tracking-[0.4em]">
                  © 2026 — Meeple & Milestones • <span className="text-stone-400">Édition de Prestige</span>
               </div>

               <div className="flex items-center gap-6">
                  <a
                     href="https://github.com/Vangelis-26"
                     target="_blank"
                     rel="noopener noreferrer"
                     className="group flex items-center gap-3 px-5 py-2.5 bg-stone-900 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-amber-900/10 hover:-translate-y-0.5"
                  >
                     <span className="text-[10px] font-black text-stone-400 group-hover:text-amber-50 group-hover:tracking-[0.3em] transition-all uppercase tracking-widest">
                        The Architect
                     </span>
                     <div className="h-3 w-px bg-stone-700"></div>
                     <svg className="w-4 h-4 text-stone-500 group-hover:text-amber-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                     </svg>
                  </a>
               </div>
            </div>

         </div>
      </footer>
   );
}
