export default function DashboardHeader({ totalGames, totalPlays, isChallengeFull }) {
   return (
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 md:mb-12 animate-in slide-in-from-top-4 duration-500">
         <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-serif font-extrabold text-amber-900 tracking-tight drop-shadow-sm">
               Mon Challenge
            </h1>
            <p className="text-stone-500 font-medium mt-2 uppercase tracking-widest text-xs md:text-sm">
               Tableau de bord 2026
            </p>
         </div>

         {/* Compteurs Nettoyés (Sans l'image de fond) */}
         <div className="bg-white/60 backdrop-blur-md border border-stone-200 rounded-2xl shadow-sm px-8 py-4 flex items-center gap-8 hover:border-amber-200 transition-colors">

            <div className="flex flex-col items-center">
               <span className={`font-black text-3xl md:text-4xl leading-none ${isChallengeFull ? 'text-green-600' : 'text-stone-800'}`}>
                  {totalGames}<span className="text-stone-300 text-lg font-bold">/10</span>
               </span>
               <span className="text-[10px] text-stone-400 uppercase font-bold tracking-widest mt-1">Jeux</span>
            </div>

            <div className="h-12 w-px bg-stone-300/50"></div>

            <div className="flex flex-col items-center">
               <span className="font-black text-3xl md:text-4xl text-amber-600 leading-none">
                  {totalPlays}<span className="text-stone-300 text-lg font-bold">/100</span>
               </span>
               <span className="text-[10px] text-amber-700/60 uppercase font-bold tracking-widest mt-1">Parties</span>
            </div>
         </div>
      </div>
   );
}
