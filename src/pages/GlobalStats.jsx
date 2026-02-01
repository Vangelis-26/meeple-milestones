CartesianGrid// ==========================================
// 1. IMPORTS & DÉPENDANCES
// ==========================================
import { useState, useEffect, useMemo } from 'react';
import { useChallenge } from '../hooks/useChallenge';
import {
   ComposedChart,
   Area,
   Bar,
   XAxis,
   YAxis,
   Tooltip,
   CartesianGrid
} from 'recharts';

// --- IMPORTS DES IMAGES DE RANGS (Nomenclature ChallengeProgress) ---
import rank0 from '../assets/ranks/rank-0.png';
import rank5 from '../assets/ranks/rank-5.png';
import rank15 from '../assets/ranks/rank-15.png';
import rank30 from '../assets/ranks/rank-30.png';
import rank50 from '../assets/ranks/rank-50.png';
import rank65 from '../assets/ranks/rank-65.png';
import rank78 from '../assets/ranks/rank-78.png';
import rank88 from '../assets/ranks/rank-88.png';
import rank95 from '../assets/ranks/rank-95.png';
import rank100 from '../assets/ranks/rank-100.png';
import rank110 from '../assets/ranks/rank-110.png';

export default function GlobalStats() {
   // ==========================================
   // 2. INITIALISATION & ÉTAT (STATE)
   // ==========================================
   const { getAllPlays } = useChallenge();
   const [plays, setPlays] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      getAllPlays().then(data => {
         setPlays(data || []);
         setLoading(false);
      });
   }, [getAllPlays]);

   // ==========================================
   // 3. LOGIQUE MÉMORISÉE (MEMOIZED LOGIC)
   // ==========================================

   // --- SYSTÈME DE PROGRESSION & GRADES ---
   const progression = useMemo(() => {
      const totalPlays = plays.length;
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
      const currentLevelIndex = [...levels].reverse().findIndex(l => totalPlays >= l.min);
      const levelIdx = currentLevelIndex !== -1 ? levels.length - 1 - currentLevelIndex : 0;
      const currentLevel = levels[levelIdx];
      const nextLevel = levels[levelIdx + 1] || { min: totalPlays + 15, title: "Éternité", icon: rank110 };
      const range = nextLevel.min - currentLevel.min;
      const progressInLevel = totalPlays - currentLevel.min;
      const percent = Math.min(Math.round((progressInLevel / range) * 100), 100);

      return {
         level: levelIdx + 1,
         title: currentLevel.title,
         progress: percent,
         icon: currentLevel.icon
      };
   }, [plays]);

   // --- INDICATEURS CLÉS (KPIs) ---
   const kpi = useMemo(() => {
      if (plays.length === 0) return { wins: 0, rate: 0, totalHours: 0, total: 0 };
      const wins = plays.filter(p => p.is_victory).length;
      const totalMinutes = plays.reduce((acc, curr) => acc + (curr.duration_minutes || 45), 0);
      return {
         wins,
         rate: Math.round((wins / plays.length) * 100),
         totalHours: Math.round(totalMinutes / 60),
         total: plays.length
      };
   }, [plays]);

   // ==========================================
   // PRÉPARATION DES DONNÉES DU GRAPHIQUE
   // ==========================================
   const chartData = useMemo(() => {
      // --- 1. GROUPEMENT DES PARTIES PAR MOIS ---
      const groups = {};
      plays.forEach(play => {
         if (play.played_on) {
            const monthKey = play.played_on.substring(0, 7); // Récupère "YYYY-MM"
            groups[monthKey] = (groups[monthKey] || 0) + 1;
         }
      });

      // --- 2. TRI CHRONOLOGIQUE DES MOIS ---
      const sortedEntries = Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));

      // --- 3. TRANSFORMATION & CALCUL DU CUMULATIF (APPROCHE IMMUABLE) ---
      return sortedEntries.reduce((accumulator, [date, count], index) => {
         const previousCumulative = index > 0 ? accumulator[index - 1].cumulative : 0;
         const currentCumulative = previousCumulative + count;

         const [year, month] = date.split('-');
         const dateObj = new Date(parseInt(year), parseInt(month) - 1);

         accumulator.push({
            dateStr: dateObj.toLocaleDateString('fr-FR', { month: 'short' }),
            fullDate: dateObj.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
            count: count,
            cumulative: currentCumulative
         });

         return accumulator;
      }, []);
   }, [plays]);

   // ==========================================
   // 4. RENDU : ÉTAT DE CHARGEMENT
   // ==========================================
   if (loading) return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
         <div className="animate-spin rounded-full h-12 w-12 border-4 border-stone-200 border-t-amber-600"></div>
      </div>
   );

   // ==========================================
   // 5. RENDU : INTERFACE PRINCIPALE
   // ==========================================
   return (
      <div className="flex-1 flex flex-col w-full max-w-[90rem] mx-auto px-4 md:px-8 py-8 font-sans text-stone-900 mt-[64px]">

         {/* --- ENTÊTE (HEADER) --- */}
         <div className="max-w-7xl w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
               <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight text-stone-900">Sanctuaire des Statistiques</h1>
            </div>
            <p className="text-amber-700 font-serif italic text-lg md:text-right max-w-sm leading-tight">
               "Là où les victoires deviennent légendes et les défaites... de simples récits de taverne."
            </p>
         </div>

         <div className="max-w-7xl w-full space-y-8">

            {/* --- SECTION : CARTES DE STATISTIQUES --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

               {/* CARTE GRADE (HERO CARD) */}
               <div className="bg-stone-900 text-white p-8 rounded-[2.5rem] border border-stone-800 relative group overflow-hidden transition-all duration-500 hover:-translate-y-2 shadow-2xl">
                  <div className="relative z-10 flex flex-col h-full">
                     <div className="flex items-center gap-4 mb-4">
                        {/* Container Image mis à jour */}
                        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 overflow-hidden transition-transform duration-500 group-hover:scale-110">
                           <img src={progression.icon} alt={progression.title} className="w-full h-full object-contain p-1" />
                        </div>
                        <div>
                           <p className="text-amber-500 text-[9px] font-black uppercase tracking-[0.2em]">Grade {progression.level}</p>
                           <h2 className="text-xl font-serif font-black tracking-tight uppercase leading-none">{progression.title}</h2>
                        </div>
                     </div>
                     <div className="mt-auto space-y-2.5">
                        <div className="flex justify-between items-end">
                           <span className="text-[9px] font-black uppercase tracking-widest text-stone-500">Avancement</span>
                           <span className="text-[11px] font-serif italic text-amber-500 font-bold">{progression.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-[1px]">
                           <div
                              className="h-full bg-gradient-to-r from-amber-700 via-amber-500 to-amber-300 transition-all duration-1000"
                              style={{ width: `${progression.progress}%` }}
                           ></div>
                        </div>
                     </div>
                  </div>
               </div>

               <StatCard title="Ratio de Triomphe" value={`${kpi.rate}%`} sub={`${kpi.wins} succès / ${kpi.total}`} color="stone" icon="⚔️" />
               <StatCard title="Heures Perdues" value={kpi.totalHours} sub="Dans les méandres du jeu" color="stone" icon="⌛" />
               <StatCard title="Parties Gravées" value={kpi.total} sub="Lignes inscrites au grimoire" color="amber" icon="📜" />
            </div>

            {/* --- SECTION : GRAPHIQUE & DERNIÈRES PARTIES --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">

               {/* BLOC GRAPHIQUE */}
               <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm col-span-1 lg:col-span-2">
                  <div className="flex items-center justify-between mb-8">
                     <h3 className="font-serif text-xl font-bold text-stone-800 flex items-center gap-3">
                        <span className="w-2 h-6 bg-amber-500 rounded-full"></span>
                        Rythme des Épopées
                     </h3>
                     <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Chronologie des Parties</p>
                  </div>

                  <div className="h-[350px] w-full">
                     {!loading && chartData.length > 0 ? (
                        <div className="w-full h-full overflow-hidden">
                           <ComposedChart
                              width={window.innerWidth > 1000 ? 750 : window.innerWidth - 80}
                              height={350}
                              data={chartData}
                              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                           >
                              <defs>
                                 <linearGradient id="colorAmberBar" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.6} />
                                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.05} />
                                 </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                              <XAxis dataKey="dateStr" axisLine={false} tickLine={false} tick={{ fill: '#a8a29e', fontSize: 10, fontWeight: 700 }} dy={10} />
                              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a8a29e', fontSize: 10, fontWeight: 700 }} />
                              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#fdfbf7' }} />
                              <Bar dataKey="count" barSize={45} fill="url(#colorAmberBar)" radius={[12, 12, 0, 0]} />
                              <Area type="monotone" dataKey="count" stroke="#d97706" strokeWidth={4} fill="transparent" dot={{ r: 6, fill: '#d97706', strokeWidth: 3, stroke: '#fff' }} />
                           </ComposedChart>
                        </div>
                     ) : (
                        <div className="h-full w-full flex items-center justify-center border-2 border-dashed border-stone-50 rounded-[2rem]">
                           <p className="text-stone-300 font-serif italic text-sm">Synchronisation des annales...</p>
                        </div>
                     )}
                  </div>
               </div>

               {/* BLOC : DERNIERS ÉCRITS (AVEC EFFET DORÉ AU SURVOL) */}
               <div className="bg-stone-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col">
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"></div>
                  <h3 className="text-xl font-serif font-bold mb-6 italic text-amber-50 flex items-center gap-2 relative z-10">🖋️ Derniers Écrits</h3>
                  <div className="space-y-0 relative z-10 overflow-y-auto no-scrollbar pr-2 h-full">
                     <div className="absolute left-[19px] top-2 bottom-4 w-px bg-stone-700/50"></div>
                     {plays.slice(-6).reverse().map((play) => (
                        <div key={play.id} className="group relative pl-10 py-3 first:pt-0">
                           <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-stone-900 z-20 transition-transform group-hover:scale-125 ${play.is_victory ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-stone-600'}`}></div>

                           {/* EFFET DÉCLENCHÉ ICI : group-hover:border-amber-500/30 */}
                           <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 hover:border-amber-500/30 transition-all hover:translate-x-1 cursor-default">
                              <div className="min-w-0">
                                 {/* EFFET DORÉ SUR LE TEXTE : group-hover:text-amber-400 */}
                                 <p className="font-bold text-sm leading-tight truncate text-stone-100 group-hover:text-amber-400 transition-colors">
                                    {play.games?.name}
                                 </p>
                                 <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest mt-0.5">{new Date(play.played_on).toLocaleDateString()}</p>
                              </div>
                              {/* ZOOM SUR L'ICONE : group-hover:scale-125 */}
                              <span className="text-xl drop-shadow-md transition-transform duration-300 group-hover:scale-125">
                                 {play.is_victory ? '🏆' : '💀'}
                              </span>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

// ==========================================
// 6. SOUS-COMPOSANTS (HELPER COMPONENTS)
// ==========================================

function StatCard({ title, value, sub, color, icon }) {
   const isAmber = color === 'amber';
   return (
      <div className={`${isAmber ? 'bg-stone-900 text-white' : 'bg-white text-stone-900'} p-8 rounded-[2.5rem] border border-stone-100/50 relative group overflow-hidden transition-all duration-500 hover:-translate-y-2 shadow-sm`}>
         <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-6xl transition-all duration-700 pointer-events-none select-none ${isAmber ? 'opacity-40 group-hover:opacity-60 text-amber-500' : 'opacity-30 group-hover:opacity-50 text-stone-200'} group-hover:scale-110 group-hover:rotate-6`}>
            {icon}
         </span>
         <div className="relative z-10">
            <p className={`${isAmber ? 'text-amber-500' : 'text-stone-400'} text-[10px] font-black uppercase tracking-[0.2em] mb-2`}>{title}</p>
            <p className="text-5xl font-serif font-black">{value}</p>
            <p className={`${isAmber ? 'text-stone-500' : 'text-stone-400'} text-[10px] font-bold mt-2 italic`}>{sub}</p>
         </div>
      </div>
   );
}

const CustomTooltip = ({ active, payload }) => {
   if (active && payload && payload.length) {
      const { fullDate, count, cumulative } = payload[0].payload;
      return (
         <div className="bg-stone-900/95 backdrop-blur-sm p-4 rounded-2xl border border-amber-500/30 shadow-2xl">
            <p className="text-amber-400 font-serif font-bold mb-1 text-xs uppercase tracking-widest">{fullDate}</p>
            <p className="text-white font-bold text-sm">⚔️ {count} parties disputées</p>
            <p className="text-stone-400 text-[10px] mt-1 italic">Total cumulé : {cumulative}</p>
         </div>
      );
   }
   return null;
};
