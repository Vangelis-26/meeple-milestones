export default function ChallengeProgress({ totalPlays, target = 100 }) {
   const progressPercentageWidth = Math.min((totalPlays / target) * 100, 100);
   const progressPercentageTxt = Math.round(progressPercentageWidth);
   const remainingPlays = Math.max(0, target - totalPlays);

   return (
      <div className="sticky top-16 z-30 mb-12 bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-stone-200/60 shadow-md transition-all">
         <div className="h-5 w-full bg-stone-200/80 rounded-full overflow-hidden relative shadow-inner border border-stone-300/50">
            <div
               className="h-full bg-gradient-to-r from-red-700 via-amber-500 to-green-700 transition-all duration-1000 relative"
               style={{ width: `${progressPercentageWidth}%` }}
            >
               <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20"></div>
            </div>
            {/* Grille de séparation */}
            <div className="absolute inset-0 flex justify-evenly pointer-events-none">
               {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-[1px] h-full bg-white/60"></div>
               ))}
            </div>
         </div>
         <div className="flex justify-between text-sm font-bold uppercase tracking-wider mt-2 px-1">
            <span className="text-stone-500">{progressPercentageTxt}%</span>
            <span className="text-green-700 font-medium italic normal-case">
               {remainingPlays > 0 ? `${remainingPlays} parties restantes !` : "Objectif atteint ! 🎉"}
            </span>
         </div>
      </div>
   );
}
