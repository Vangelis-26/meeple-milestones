export default function DashboardHeader({ totalGames, totalPlays, isChallengeFull }) {
   return (
      <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-10 mb-16 animate-in fade-in duration-700">

         {/* --- 1. TITRE DU CHAPITRE (VERSION FINALE VALIDÉE) --- */}
         <div className="flex flex-col items-center lg:items-start group">
            {/* Kicker : Retour aux chiffres arabes avec style luxe (tracking large) */}
            <div className="flex items-center gap-3 mb-4">
               <div className="h-[1px] w-6 bg-amber-600/30"></div>
               <p className="text-[9px] font-black uppercase tracking-[0.6em] text-stone-400 group-hover:text-amber-700 transition-colors duration-700">
                  CHRONIQUE • 2026
               </p>
            </div>

            {/* Titre Maître : Contraste de graisse entre "MON" et "CHALLENGE" */}
            <h1 className="text-4xl md:text-6xl font-serif text-stone-900 tracking-tighter uppercase leading-none">
               <span className="font-light opacity-80">Mon</span> <span className="font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-600 via-amber-800 to-stone-900">Challenge</span>
            </h1>

            {/* Signature : Liseré asymétrique discret */}
            <div className="hidden lg:block h-[1.5px] w-20 bg-gradient-to-r from-amber-600/30 to-transparent mt-8"></div>
         </div>

         {/* --- 2. LE SCEAU DE PRESTIGE (DESIGN INTÉGRALEMENT PRÉSERVÉ) --- */}
         <div className="relative group">
            <div className="absolute -inset-1 bg-amber-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>

            <div className="relative bg-[#FDFBF7] border border-amber-900/10 rounded-2xl p-1 shadow-sm">
               <div className="bg-white/40 backdrop-blur-md border border-white rounded-[0.9rem] px-8 py-5 flex items-center gap-10">

                  {/* JEUX */}
                  <div className="flex flex-col items-center">
                     <div className="flex items-baseline gap-1">
                        <span className={`text-3xl font-serif font-black tracking-tighter ${isChallengeFull ? 'text-emerald-600' : 'text-stone-900'}`}>
                           {totalGames}
                        </span>
                        <span className="text-[10px] font-bold text-stone-300">/10</span>
                     </div>
                     <span className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-400 mt-1 italic">Jeux</span>
                  </div>

                  {/* SÉPARATEUR DIAMANT */}
                  <div className="flex flex-col items-center gap-1 opacity-20">
                     <div className="w-[1px] h-3 bg-stone-900"></div>
                     <div className="w-1 h-1 rotate-45 bg-amber-600"></div>
                     <div className="w-[1px] h-3 bg-stone-900"></div>
                  </div>

                  {/* MAÎTRISES */}
                  <div className="flex flex-col items-center">
                     <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-serif font-black tracking-tighter text-amber-700">
                           {totalPlays}
                        </span>
                        <span className="text-[10px] font-bold text-stone-300">/100</span>
                     </div>
                     <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-700/60 mt-1 italic">Maîtrises</span>
                  </div>

               </div>
            </div>
         </div>
      </div>
   );
}
