// =================================================================================
// COMPOSANT : DASHBOARD HEADER
// Rôle : Affiche le titre "Chronique" et les compteurs globaux (Jeux / Maîtrises)
// =================================================================================

export default function DashboardHeader({ totalGames, totalPlays, isChallengeFull }) {
   return (
      <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-between gap-10 mb-12 animate-in fade-in duration-700">

         {/* --- 1. TITRE DU CHAPITRE (GAUCHE) --- */}
         <div className="flex flex-col items-center lg:items-start justify-between group py-1 lg:pl-20 transition-all duration-500">

            {/* Kicker : Année Courante */}
            <div className="flex flex-col gap-3">
               <div className="flex items-center gap-3">
                  <div className="h-[1px] w-8 bg-amber-600/40"></div>
                  <p className="text-[10px] font-black uppercase tracking-[0.6em] text-stone-500 group-hover:text-amber-700 transition-colors duration-700">
                     CHRONIQUE • {new Date().getFullYear()}
                  </p>
               </div>
            </div>

            {/* Titre Principal */}
            <div className="flex flex-col gap-6 mt-4 lg:mt-0">
               <h1 className="text-4xl md:text-6xl font-serif text-stone-900 tracking-tighter uppercase leading-none">
                  <span className="font-light opacity-60">Mon</span> <span className="font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-600 via-amber-800 to-stone-900">Challenge</span>
               </h1>
               {/* Ligne décorative */}
               <div className="hidden lg:block h-[1.5px] w-32 bg-gradient-to-r from-amber-600/40 via-amber-600/10 to-transparent"></div>
            </div>
         </div>

         {/* --- 2. LE SCEAU DE PRESTIGE (DROITE) --- */}
         <div className="relative group self-center lg:self-auto lg:pr-4">
            {/* Halo au survol */}
            <div className="absolute -inset-1 bg-amber-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>

            <div className="relative bg-[#FDFBF7] border border-amber-900/10 rounded-2xl p-1 shadow-sm">
               <div className="bg-white/40 backdrop-blur-md border border-white rounded-[0.9rem] px-8 py-5 flex items-center gap-10">

                  {/* Compteur Jeux */}
                  <div className="flex flex-col items-center">
                     <div className="flex items-baseline gap-1">
                        <span className={`text-3xl font-serif font-black tracking-tighter ${isChallengeFull ? 'text-emerald-600' : 'text-stone-900'}`}>
                           {totalGames}
                        </span>
                        <span className="text-[10px] font-bold text-stone-400">/10</span>
                     </div>
                     <span className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-500 mt-1 italic">Jeux</span>
                  </div>

                  {/* Séparateur Diamant */}
                  <div className="flex flex-col items-center gap-1 opacity-30">
                     <div className="w-[1px] h-3 bg-stone-900"></div>
                     <div className="w-1.5 h-1.5 rotate-45 bg-amber-600 shadow-[0_0_8px_rgba(217,119,6,0.5)]"></div>
                     <div className="w-[1px] h-3 bg-stone-900"></div>
                  </div>

                  {/* Compteur Maîtrises (Plays) */}
                  <div className="flex flex-col items-center">
                     <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-serif font-black tracking-tighter text-amber-700">
                           {totalPlays}
                        </span>
                        <span className="text-[10px] font-bold text-stone-400">/100</span>
                     </div>
                     <span className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-700 mt-1 italic opacity-80">Maîtrises</span>
                  </div>

               </div>
            </div>
         </div>
      </div>
   );
}
