// =================================================================================
// COMPOSANT : FOOTER (PIED DE PAGE) - VERSION PREMIUM ÉPURÉE
// =================================================================================

import { Link } from 'react-router-dom';

export default function Footer() {
   const currentYear = new Date().getFullYear();

   return (
      <footer className="bg-[#FDFBF7] border-t border-stone-200 py-12 md:py-16 mt-auto">
         <div className="max-w-7xl mx-auto px-6 md:px-12">

            {/* --- SECTION HAUTE : LOGO & LIENS --- */}
            <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-12 mb-12 lg:mb-16">

               {/* 1. Bloc Identité (Centré sur mobile, Gauche sur Desktop) */}
               <div className="max-w-sm flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">

                  {/* Logo & Titre combinés */}
                  <div className="flex flex-col lg:flex-row items-center gap-4">
                     <div className="w-14 h-14 bg-white rounded-xl shadow-sm border border-stone-100 p-2.5 flex items-center justify-center">
                        <img src="/logo.png" alt="Sceau" className="w-full h-full object-contain opacity-90" />
                     </div>
                     <div>
                        <h3 className="font-serif font-black text-xl text-stone-900 tracking-tight leading-none uppercase">
                           Meeple & <br /><span className="text-amber-600">Milestones</span>
                        </h3>
                     </div>
                  </div>

                  <p className="text-stone-500 text-sm leading-relaxed font-medium mx-auto lg:mx-0">
                     Conçu pour les collectionneurs exigeants. Suivez vos défis, analysez vos statistiques et forgez votre légende ludique.
                  </p>
               </div>

               {/* 2. Navigation (Grille Responsive) */}
               {/* Centrage du texte sur mobile pour s'aligner avec le logo */}
               <div className="w-full lg:w-auto grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-10 text-center lg:text-left">

                  {/* Colonne Navigation */}
                  <div className="space-y-4">
                     <h4 className="text-[10px] font-black text-stone-300 uppercase tracking-[0.2em] mb-4">Navigation</h4>
                     <ul className="space-y-3 flex flex-col items-center lg:items-start">
                        <li><Link to="/dashboard" className="text-xs font-bold text-stone-600 hover:text-amber-600 uppercase tracking-wider transition-colors">Dashboard</Link></li>
                        <li><Link to="/stats" className="text-xs font-bold text-stone-600 hover:text-amber-600 uppercase tracking-wider transition-colors">Sanctuaire</Link></li>
                        <li><Link to="/profile" className="text-xs font-bold text-stone-600 hover:text-amber-600 uppercase tracking-wider transition-colors">Mon Héritage</Link></li>
                     </ul>
                  </div>

                  {/* Colonne Juridique */}
                  <div className="space-y-4">
                     <h4 className="text-[10px] font-black text-stone-300 uppercase tracking-[0.2em] mb-4">Juridique</h4>
                     <ul className="space-y-3 flex flex-col items-center lg:items-start">
                        <li><Link to="/legal" className="text-xs font-bold text-stone-600 hover:text-amber-600 uppercase tracking-wider transition-colors">Mentions Légales</Link></li>
                        <li><Link to="/legal" className="text-xs font-bold text-stone-600 hover:text-amber-600 uppercase tracking-wider transition-colors">Propriété</Link></li>
                        <li><Link to="/legal" className="text-xs font-bold text-stone-600 hover:text-amber-600 uppercase tracking-wider transition-colors">Données & RGPD</Link></li>
                     </ul>
                  </div>

                  {/* Colonne Crédits */}
                  <div className="space-y-4 col-span-2 md:col-span-1 mt-2 md:mt-0">
                     <h4 className="text-[10px] font-black text-stone-300 uppercase tracking-[0.2em] mb-4">Crédits & Tech</h4>
                     <ul className="space-y-3 flex flex-col items-center lg:items-start">
                        <li className="flex items-center gap-2 text-xs font-medium text-stone-500">
                           Source : <a href="https://boardgamegeek.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-700 underline decoration-stone-300 underline-offset-2">BoardGameGeek</a>
                        </li>
                        <li className="flex items-center gap-2 text-xs font-medium text-stone-500">
                           Stack : React / Supabase
                        </li>
                     </ul>
                  </div>
               </div>
            </div>

            {/* --- SECTION BASSE : COPYRIGHT --- */}
            <div className="pt-8 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
               <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  © {currentYear} Vangelis. <span className="hidden md:inline">|</span> <span className="block md:inline mt-1 md:mt-0">Tous droits réservés.</span>
               </p>

               {/* Liens sociaux discrets */}
               <div className="flex items-center gap-6 opacity-60 hover:opacity-100 transition-opacity">
                  <a href="https://github.com/Vangelis-26" target="_blank" rel="noreferrer" className="text-stone-400 hover:text-stone-900 transition-colors">
                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                  </a>
               </div>
            </div>

         </div>
      </footer>
   );
}
