export default function DashboardHeader({ totalGames, totalPlays, isChallengeFull }) {
   return (
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
         <div className="text-center md:text-left">
            <h1 className="text-4xl font-serif font-extrabold text-amber-900 tracking-tight">Mon Challenge</h1>
            <p className="text-stone-500 font-medium mt-1">Tableau de bord 2026</p>
         </div>

         <div className="bg-white border border-stone-200 rounded-xl shadow-sm px-6 py-3 flex items-center gap-6">
            <div className="flex flex-col items-center">
               <span className={`font-bold text-xl leading-none ${isChallengeFull ? 'text-green-600' : ''}`}>
                  {totalGames}/10
               </span>
               <span className="text-[10px] text-stone-500 uppercase font-bold tracking-wider mt-1">Jeux</span>
            </div>
            <div className="h-8 w-px bg-stone-300"></div>
            <div className="flex flex-col items-center">
               <span className="font-bold text-xl text-amber-700 leading-none">{totalPlays}/100</span>
               <span className="text-[10px] text-amber-600 uppercase font-bold tracking-wider mt-1">Parties</span>
            </div>
         </div>
      </div>
   );
}
