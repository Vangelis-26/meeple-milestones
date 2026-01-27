import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChallenge } from '../hooks/useChallenge';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

export default function GlobalStats() {
   const navigate = useNavigate();
   const { getAllPlays } = useChallenge();
   const [plays, setPlays] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      getAllPlays().then(data => {
         setPlays(data || []);
         setLoading(false);
      });
   }, [getAllPlays]);

   // --- LOGIQUE DE PROGRESSION "SPRINT FINAL" ---
   const progression = useMemo(() => {
      const totalPlays = plays.length;

      const levels = [
         { min: 0, title: "Vagabond des Plateaux", icon: "🥾" },
         { min: 5, title: "Aventurier Novice", icon: "🎒" },
         { min: 15, title: "Chasseur de Reliques", icon: "🔍" },
         { min: 30, title: "Stratège Reconnu", icon: "📜" },
         { min: 50, title: "Gardien des Savoirs", icon: "🕯️" }, // Pic d'effort à mi-parcours
         { min: 65, title: "Maître de Guerre", icon: "⚔️" },
         { min: 78, title: "Seigneur du Grimoire", icon: "🏰" },
         { min: 88, title: "Oracle Ludique", icon: "✨" },
         { min: 95, title: "Légende Vivante", icon: "👑" },
         { min: 100, title: "Maître de l'Olympe", icon: "⚡" }, // LE BUT ULTIME
         { min: 110, title: "Architecte du Destin", icon: "🌌" } // L'apothéose bonus
      ];

      const currentLevelIndex = [...levels].reverse().findIndex(l => totalPlays >= l.min);
      const levelIdx = currentLevelIndex !== -1 ? levels.length - 1 - currentLevelIndex : 0;
      const currentLevel = levels[levelIdx];
      const nextLevel = levels[levelIdx + 1] || { min: totalPlays + 15, title: "Éternité", icon: "♾️" };

      const range = nextLevel.min - currentLevel.min;
      const progressInLevel = totalPlays - currentLevel.min;
      const percent = Math.min(Math.round((progressInLevel / range) * 100), 100);

      return {
         level: levelIdx + 1,
         title: currentLevel.title,
         currentXP: totalPlays,
         nextLevelXP: nextLevel.min,
         progress: percent,
         icon: currentLevel.icon
      };
   }, [plays]);

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

   const chartData = useMemo(() => {
      const groups = {};
      plays.forEach(play => {
         const monthKey = play.played_on.substring(0, 7);
         groups[monthKey] = (groups[monthKey] || 0) + 1;
      });
      let cumulative = 0;
      return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b)).map(([date, count]) => {
         cumulative += count;
         const [year, month] = date.split('-');
         return {
            dateStr: new Date(year, month - 1).toLocaleDateString('fr-FR', { month: 'short' }),
            fullDate: new Date(year, month - 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
            count, cumulative
         };
      });
   }, [plays]);

   if (loading) return (
      <div className="min-h-screen flex items-center justify-center">
         <div className="animate-spin rounded-full h-12 w-12 border-4 border-stone-200 border-t-amber-600"></div>
      </div>
   );

   return (
      <div className="flex-1 flex flex-col w-full max-w-[90rem] mx-auto px-4 md:px-8 py-8 font-sans text-stone-900 mt-[64px]">

         <div className="max-w-7xl w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
               <button
                  onClick={() => navigate('/dashboard')}
                  className="group flex items-center gap-3 px-5 py-2.5 bg-white border-2 border-stone-200 rounded-2xl hover:border-amber-500 transition-all shadow-sm mb-4"
               >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-stone-400 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                     <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span className="text-[10px] font-black uppercase tracking-widest text-stone-600">Retour au Dashboard</span>
               </button>
               <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight text-stone-900">Sanctuaire des Statistiques</h1>
            </div>
            <p className="text-amber-700 font-serif italic text-lg md:text-right max-w-sm leading-tight">
               Là où les victoires deviennent légendes et les défaites... de simples récits de taverne.
            </p>
         </div>

         <div className="max-w-7xl w-full space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

               {/* CARTE NIVEAU DE GLOIRE - SYSTÈME POURCENTAGE ULTRA PREMIUM */}
               <div className="bg-stone-900 text-white p-8 rounded-[2.5rem] border border-stone-800 relative group overflow-hidden transition-all duration-500 hover:-translate-y-1 shadow-2xl">
                  <div className="relative z-10 flex flex-col h-full">
                     <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-3xl shadow-inner group-hover:scale-110 transition-transform duration-500">
                           {progression.icon}
                        </div>
                        <div>
                           <p className="text-amber-500 text-[9px] font-black uppercase tracking-[0.2em]">Grade {progression.level}</p>
                           <h2 className="text-xl font-serif font-black tracking-tight leading-none uppercase">{progression.title}</h2>
                        </div>
                     </div>

                     <div className="mt-auto space-y-2.5">
                        <div className="flex justify-between items-end">
                           <span className="text-[9px] font-black uppercase tracking-widest text-stone-500">Avancement</span>
                           <span className="text-[11px] font-serif italic text-amber-500 font-bold">{progression.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-[1px]">
                           <div
                              className="h-full bg-gradient-to-r from-amber-700 via-amber-500 to-amber-300 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(245,158,11,0.3)] rounded-full"
                              style={{ width: `${progression.progress}%` }}
                           ></div>
                        </div>
                     </div>
                  </div>
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-all"></div>
               </div>

               <StatCard title="Ratio de Triomphe" value={`${kpi.rate}%`} sub={`${kpi.wins} succès / ${kpi.total}`} color="stone" icon="⚔️" />
               <StatCard title="Heures Perdues" value={kpi.totalHours} sub="Dans les méandres du jeu" color="stone" icon="⌛" />
               <StatCard title="Parties Gravées" value={kpi.total} sub="Lignes inscrites au grimoire" color="amber" icon="📜" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
               <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-xl border border-stone-100">
                  <h3 className="text-xl font-serif font-bold mb-8 flex items-center gap-2 text-stone-800">
                     <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.4)]"></span>
                     Rythme des Épopées (Activité Mensuelle)
                  </h3>
                  <div className="h-80 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={chartData}>
                           <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" vertical={false} />
                           <XAxis dataKey="dateStr" tick={{ fill: '#a8a29e', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                           <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f5f5f4' }} />
                           <Bar dataKey="count" fill="#fcd34d" radius={[6, 6, 0, 0]} barSize={30} />
                           <Line type="monotone" dataKey="cumulative" stroke="#292524" strokeWidth={4} dot={{ r: 6, fill: '#292524' }} />
                        </ComposedChart>
                     </ResponsiveContainer>
                  </div>
               </div>

               <div className="bg-stone-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col">
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl"></div>
                  <h3 className="text-xl font-serif font-bold mb-6 relative z-10 italic text-amber-50">Dernières Inscriptions</h3>
                  <div className="space-y-4 relative z-10 overflow-y-auto no-scrollbar pr-2">
                     {plays.slice(-6).reverse().map(play => (
                        <div key={play.id} className="group flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 hover:border-amber-500/30 transition-all">
                           <div className="flex items-center gap-4">
                              <span className="text-xl group-hover:scale-110 transition-transform">{play.is_victory ? '🏆' : '💀'}</span>
                              <div className="min-w-0">
                                 <p className="font-bold text-sm leading-tight truncate text-stone-100">{play.game?.name}</p>
                                 <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest mt-0.5">{new Date(play.played_on).toLocaleDateString()}</p>
                              </div>
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

function StatCard({ title, value, sub, color, icon }) {
   const isAmber = color === 'amber';
   return (
      <div className={`${isAmber ? 'bg-stone-900 text-white shadow-[0_20px_50px_rgba(0,0,0,0.15)]' : 'bg-white text-stone-900 shadow-sm'} p-8 rounded-[2.5rem] border border-stone-100/50 relative group overflow-hidden transition-all duration-500 hover:-translate-y-1`}>
         <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-6xl transition-all duration-700 pointer-events-none select-none
            ${isAmber ? 'opacity-40 group-hover:opacity-60 text-amber-500' : 'opacity-30 group-hover:opacity-50 text-stone-200'} 
            group-hover:scale-110 group-hover:rotate-3`}>
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
      return (
         <div className="bg-stone-900/95 backdrop-blur-sm p-4 rounded-2xl border border-amber-500/30 shadow-2xl">
            <p className="text-amber-400 font-serif font-bold mb-1 text-xs uppercase tracking-widest">{payload[0].payload.fullDate}</p>
            <p className="text-white font-bold text-sm">⚔️ {payload[0].payload.count} parties disputées</p>
            <p className="text-stone-400 text-[10px] mt-1 italic">Total cumulé : {payload[0].payload.cumulative}</p>
         </div>
      );
   }
   return null;
};
