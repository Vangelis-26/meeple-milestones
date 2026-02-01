// =================================================================================
// COMPOSANT : CHALLENGE PROGRESS
// Rôle : Barre de progression gamifiée avec système de grades (Images PNG)
// =================================================================================
import React, { useMemo } from 'react';

// --- 1. IMPORTS DES IMAGES DE RANGS ---
// Assurez-vous que les fichiers existent dans src/assets/ranks/
// Modifiez les noms de fichiers si nécessaire.
import rank0 from '../assets/ranks/rank-0.png';   // Vagabond
import rank5 from '../assets/ranks/rank-5.png';   // Aventurier
import rank15 from '../assets/ranks/rank-15.png'; // Chasseur
import rank30 from '../assets/ranks/rank-30.png'; // Stratège
import rank50 from '../assets/ranks/rank-50.png'; // Gardien
import rank65 from '../assets/ranks/rank-65.png'; // Maître de Guerre
import rank78 from '../assets/ranks/rank-78.png'; // Seigneur
import rank88 from '../assets/ranks/rank-88.png'; // Oracle
import rank95 from '../assets/ranks/rank-95.png'; // Légende
import rank100 from '../assets/ranks/rank-100.png';// Maître Olympe
import rank110 from '../assets/ranks/rank-110.png';// Architecte

export default function ChallengeProgress({ totalPlays }) {
   // Plafonne la barre visuelle à 100%
   const progressVisual = Math.min(totalPlays, 100);

   // Logique des Rangs (Memoized pour la performance)
   const rankData = useMemo(() => {
      // --- 2. TABLEAU DES NIVEAUX ---
      const levels = [
         { min: 0, title: "Vagabond des Plateaux", icon: rank0 },
         { min: 5, title: "Aventurier Novice", icon: rank5 },
         { min: 15, title: "Chasseur de Reliques", icon: rank15 },
         { min: 30, title: "Stratège Reconnu", icon: rank30 },
         { min: 50, title: "Gardien des Savoirs", icon: rank50 },
         { min: 65, title: "Maître de Guerre", icon: rank65 },
         { min: 78, title: "Seigneur du Grimoire", icon: rank78 },
         { min: 88, title: "Oracle Ludique", icon: rank88 },
         { min: 95, title: "Légende Vivante", icon: rank95 },
         { min: 100, title: "Maître de l'Olympe", icon: rank100 },
         { min: 110, title: "Architecte du Destin", icon: rank110 }
      ];
      return {
         current: levels.slice().reverse().find(l => totalPlays >= l.min) || levels[0],
         next: levels.find(l => l.min > totalPlays)
      };
   }, [totalPlays]);

   // Gestion de la couleur de la barre selon l'avancement
   const getGradient = () => {
      if (totalPlays >= 95) return 'from-emerald-600 via-emerald-400 to-teal-300';
      if (totalPlays >= 50) return 'from-amber-600 via-amber-400 to-yellow-200';
      return 'from-orange-900 via-amber-800 to-amber-600';
   };

   return (
      <div className="relative w-full group">
         {/* Aura de fond */}
         <div className={`absolute -inset-0.5 rounded-[2rem] opacity-20 blur-xl transition-all duration-1000 ${totalPlays >= 50 ? 'bg-amber-400' : 'bg-orange-800'}`}></div>

         {/* Conteneur Blanc */}
         <div className="relative w-full bg-white rounded-[1.5rem] p-5 md:px-8 md:py-6 shadow-xl ring-1 ring-black/5 overflow-hidden isolation-isolate">

            {/* Texture de grain */}
            <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")` }}></div>

            <div className="relative z-10 flex flex-col gap-5">

               {/* --- HEADER (Titre Rang + Pourcentage) --- */}
               <div className="grid grid-cols-2 md:items-stretch">
                  {/* Gauche */}
                  <div className="flex flex-col justify-between items-start">
                     <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-stone-500 uppercase tracking-[0.4em]">Rang Actuel</span>
                        <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${totalPlays >= 50 ? 'bg-amber-500' : 'bg-orange-700'}`}></div>
                     </div>
                     <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <h2 className={`text-2xl md:text-4xl font-serif font-black tracking-tight ${totalPlays >= 50 ? 'text-amber-600' : 'text-orange-900'} leading-none`}>
                           {rankData.current.title}
                        </h2>
                        <img
                           src={rankData.current.icon}
                           alt={rankData.current.title}
                           className="w-12 h-12 md:w-16 md:h-16 object-contain filter drop-shadow-sm transform -translate-y-1"
                        />
                     </div>
                  </div>

                  {/* Droite */}
                  <div className="flex flex-col justify-between items-end">
                     <div className="flex items-baseline leading-none">
                        <span className="text-5xl md:text-7xl font-serif font-black text-stone-900 tracking-tighter">
                           {totalPlays}
                        </span>
                        <span className="text-xl md:text-2xl font-light text-stone-300 ml-2">%</span>
                     </div>
                     <div className="mt-4 md:mt-0">
                        <span className="text-[9px] font-bold text-stone-500 uppercase tracking-[0.2em] whitespace-nowrap">
                           {rankData.next ? `Prochain Rang : ${rankData.next.min}` : "Sommet Atteint"}
                        </span>
                     </div>
                  </div>
               </div>

               {/* --- BARRE DE PROGRESSION --- */}
               <div className="relative h-3.5 md:h-5 w-full rounded-full shadow-[inset_0_1px_4px_rgba(0,0,0,0.15)] overflow-hidden bg-stone-100">
                  {/* Graduations */}
                  {Array.from({ length: 9 }).map((_, i) => (
                     <div key={i} className="absolute top-0 bottom-0 w-[1px] bg-stone-300/30" style={{ left: `${(i + 1) * 10}%` }}></div>
                  ))}
                  {/* Jauge Colorée */}
                  <div
                     className={`absolute top-0 left-0 h-full rounded-full bg-gradient-to-r ${getGradient()} transition-all duration-1000 ease-out z-10 shadow-[inset_0_0_8px_rgba(255,255,255,0.3)]`}
                     style={{ width: `${Math.max(progressVisual, 2.5)}%` }}
                  >
                     <div className="absolute top-[1.5px] left-[2px] right-[2px] h-[35%] bg-gradient-to-b from-white/50 to-transparent rounded-full opacity-60"></div>
                  </div>
               </div>

               {/* --- FOOTER (Stats chiffres) --- */}
               <div className="flex justify-between items-center pt-3 border-t border-stone-200/60">
                  <div className="flex gap-8">
                     <div className="flex items-center gap-2.5">
                        <span className="text-[10px] font-bold text-stone-600 uppercase tracking-widest">Jouées:</span>
                        <span className="text-sm font-black text-stone-900">{totalPlays}</span>
                     </div>
                     <div className="flex items-center gap-2.5">
                        <span className="text-[10px] font-bold text-stone-600 uppercase tracking-widest">Restantes:</span>
                        <span className="text-sm font-black text-stone-900">{Math.max(0, 100 - totalPlays)}</span>
                     </div>
                  </div>
                  <div className="hidden sm:block text-[11px] font-serif font-black text-stone-400 uppercase tracking-[0.6em]">
                     CHALLENGE 10<span className="text-stone-300 mx-0.5">X</span>10
                  </div>
               </div>

            </div>
         </div>
      </div>
   );
}
