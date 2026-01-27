import { useState, useEffect, useMemo } from 'react';
import {
   ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid, Cell
} from 'recharts';

export default function AnalyticsPanel({ isOpen, onClose, fetchGlobalPlays }) {
   const [plays, setPlays] = useState([]);
   const [loading, setLoading] = useState(false);
   const [shouldRenderChart, setShouldRenderChart] = useState(false);

   // 1. Chargement des données
   useEffect(() => {
      if (isOpen) {
         setLoading(true);
         // Petit délai pour laisser le tiroir s'ouvrir avant de rendre le chart lourd (Fix Warning Recharts)
         const timer = setTimeout(() => setShouldRenderChart(true), 300);

         fetchGlobalPlays().then(data => {
            setPlays(data || []);
            setLoading(false);
         });

         return () => clearTimeout(timer);
      } else {
         setShouldRenderChart(false);
      }
   }, [isOpen, fetchGlobalPlays]);

   // --- CALCULS AVANCÉS (KPIs) ---

   const kpi = useMemo(() => {
      if (plays.length === 0) return { wins: 0, rate: 0, hIndex: 0, totalHours: 0 };

      // Taux de victoire
      const wins = plays.filter(p => p.is_victory).length;
      const rate = Math.round((wins / plays.length) * 100);

      // Temps de jeu total (si duration_minutes existe, sinon estimation 45min/partie)
      const totalMinutes = plays.reduce((acc, curr) => acc + (curr.duration_minutes || 45), 0);
      const totalHours = Math.round(totalMinutes / 60);

      // Calcul du H-INDEX (Le Graal du Gamer)
      // "Un H-Index de 5 signifie que vous avez joué 5 jeux au moins 5 fois chacun"
      const counts = {};
      plays.forEach(p => { counts[p.game_id] = (counts[p.game_id] || 0) + 1; });
      const sortedCounts = Object.values(counts).sort((a, b) => b - a);
      let hIndex = 0;
      for (let i = 0; i < sortedCounts.length; i++) {
         if (sortedCounts[i] >= i + 1) hIndex = i + 1;
         else break;
      }

      return { wins, rate, hIndex, totalHours, totalPlays: plays.length };
   }, [plays]);

   // --- DONNÉES DU GRAPHIQUE COMPOSÉ ---
   const chartData = useMemo(() => {
      if (plays.length === 0) return [];

      const groups = {};
      plays.forEach(play => {
         const monthKey = play.played_on.substring(0, 7); // "2024-01"
         groups[monthKey] = (groups[monthKey] || 0) + 1;
      });

      // On transforme en tableau trié et on ajoute le cumulatif
      let cumulative = 0;
      return Object.entries(groups)
         .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
         .map(([date, count]) => {
            cumulative += count;
            const [year, month] = date.split('-');
            const dateObj = new Date(year, month - 1);
            return {
               dateStr: dateObj.toLocaleDateString('fr-FR', { month: 'short' }),
               fullDate: dateObj.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
               count: count,
               cumulative: cumulative
            };
         });
   }, [plays]);

   const CustomTooltip = ({ active, payload }) => {
      if (active && payload && payload.length) {
         return (
            <div className="bg-stone-900/90 backdrop-blur text-white p-4 rounded-xl border border-amber-500/30 shadow-2xl">
               <p className="text-amber-400 font-serif font-bold mb-2 uppercase tracking-widest text-[10px]">{payload[0].payload.fullDate}</p>
               <div className="space-y-1 text-sm">
                  <p className="flex justify-between gap-4">
                     <span className="text-stone-300">Ce mois :</span>
                     <span className="font-bold text-white">+{payload[0].payload.count} parties</span>
                  </p>
                  <p className="flex justify-between gap-4 border-t border-white/10 pt-1 mt-1">
                     <span className="text-stone-400">Total cumulé :</span>
                     <span className="font-bold text-amber-400">{payload[0].payload.cumulative}</span>
                  </p>
               </div>
            </div>
         );
      }
      return null;
   };

   return (
      <>
         {/* OVERLAY */}
         <div
            className={`fixed inset-0 bg-stone-950/60 backdrop-blur-sm z-40 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={onClose}
         ></div>

         {/* TIROIR PRINCIPAL */}
         <div className={`fixed top-0 left-0 right-0 z-50 bg-[#FBF9F6] border-b-8 border-stone-900 shadow-2xl transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}>

            {/* HEADER PREMIUM */}
            <div className="bg-stone-900 p-6 flex justify-between items-end relative overflow-hidden">
               <div className="absolute -right-20 -top-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
               <div className="absolute left-10 top-10 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl"></div>

               <div className="relative z-10">
                  <h2 className="text-3xl font-serif font-black text-amber-50 flex items-center gap-3">
                     <span className="text-amber-500">⚜️</span> Table de Commandement
                  </h2>
                  <p className="text-stone-400 text-xs uppercase tracking-[0.3em] mt-1 font-bold">Analyses & Statistiques de Campagne</p>
               </div>

               <button onClick={onClose} className="text-stone-500 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all relative z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>

            {/* CONTENU */}
            <div className="p-6 md:p-10 max-h-[80vh] overflow-y-auto custom-scrollbar">
               {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                     <div className="animate-spin rounded-full h-12 w-12 border-4 border-stone-200 border-t-amber-600"></div>
                     <p className="text-stone-400 font-serif italic">Consultation des archives...</p>
                  </div>
               ) : plays.length === 0 ? (
                  <div className="text-center py-20 bg-stone-100 rounded-3xl border-2 border-dashed border-stone-200">
                     <span className="text-5xl mb-4 block opacity-50">📜</span>
                     <p className="text-stone-500 font-serif text-xl">Le grimoire est vierge.</p>
                     <p className="text-stone-400 text-sm mt-2">Jouez votre première partie pour débloquer les statistiques.</p>
                  </div>
               ) : (
                  <div className="space-y-10">

                     {/* 1. LES CARTES KPI (H-INDEX & CO) */}
                     <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* H-INDEX */}
                        <div className="bg-stone-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden group">
                           <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-amber-500/20 to-transparent rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                           <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">H-Index</p>
                           <div className="flex items-baseline gap-2">
                              <span className="text-5xl font-serif font-black text-amber-500">{kpi.hIndex}</span>
                              <span className="text-xs text-stone-500 font-medium">Légende</span>
                           </div>
                           <p className="text-[10px] text-stone-400 mt-2 leading-tight opacity-70">Vous avez joué à {kpi.hIndex} jeux au moins {kpi.hIndex} fois.</p>
                        </div>

                        {/* WIN RATE */}
                        <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
                           <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Victoires</p>
                           <div className="flex items-baseline gap-2">
                              <span className="text-4xl font-serif font-black text-stone-800">{kpi.rate}%</span>
                           </div>
                           <div className="w-full bg-stone-100 h-1.5 rounded-full mt-3 overflow-hidden">
                              <div className="bg-green-500 h-full rounded-full" style={{ width: `${kpi.rate}%` }}></div>
                           </div>
                           <p className="text-[10px] text-stone-400 mt-2">{kpi.wins} succès sur {kpi.totalPlays} parties</p>
                        </div>

                        {/* TIME PLAYED */}
                        <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
                           <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Temps de Jeu</p>
                           <div className="flex items-baseline gap-1">
                              <span className="text-4xl font-serif font-black text-stone-800">{kpi.totalHours}</span>
                              <span className="text-sm font-bold text-stone-400">Heures</span>
                           </div>
                           <p className="text-[10px] text-stone-400 mt-2">Estimation basée sur vos parties.</p>
                        </div>

                        {/* TOTAL */}
                        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 shadow-sm">
                           <p className="text-amber-800/60 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Volume Total</p>
                           <div className="flex items-baseline gap-1">
                              <span className="text-4xl font-serif font-black text-amber-600">{kpi.totalPlays}</span>
                              <span className="text-sm font-bold text-amber-800/50">Parties</span>
                           </div>
                           <p className="text-[10px] text-amber-700/50 mt-2">Continuez d'écrire l'histoire.</p>
                        </div>
                     </div>

                     {/* 2. LE GRAPHIQUE COMPOSÉ (Barres + Ligne) */}
                     <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-lg relative">
                        <div className="flex justify-between items-end mb-8">
                           <div>
                              <h3 className="text-xl font-serif font-bold text-stone-900">Activité & Progression</h3>
                              <p className="text-xs text-stone-400 uppercase tracking-widest font-bold mt-1">Historique Mensuel</p>
                           </div>
                           <div className="flex gap-4 text-xs font-bold uppercase tracking-wider">
                              <div className="flex items-center gap-2 text-stone-400"><span className="w-3 h-3 bg-amber-200 rounded-sm"></span> Volume</div>
                              <div className="flex items-center gap-2 text-stone-400"><span className="w-8 h-0.5 bg-stone-800"></span> Cumul</div>
                           </div>
                        </div>

                        <div className="h-64 w-full">
                           {shouldRenderChart ? (
                              <ResponsiveContainer width="100%" height="100%">
                                 <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" vertical={false} />
                                    <XAxis dataKey="dateStr" tick={{ fill: '#a8a29e', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} dy={10} />
                                    <YAxis yAxisId="left" hide />
                                    <YAxis yAxisId="right" orientation="right" hide />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f5f5f4' }} />

                                    {/* Barres pour le volume mensuel */}
                                    <Bar yAxisId="left" dataKey="count" barSize={20} radius={[4, 4, 0, 0]}>
                                       {chartData.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill="#fcd34d" />
                                       ))}
                                    </Bar>

                                    {/* Ligne pour la progression cumulée */}
                                    <Line yAxisId="right" type="monotone" dataKey="cumulative" stroke="#292524" strokeWidth={3} dot={{ r: 4, fill: '#292524', strokeWidth: 0 }} activeDot={{ r: 6, stroke: '#fcd34d', strokeWidth: 3 }} />
                                 </ComposedChart>
                              </ResponsiveContainer>
                           ) : (
                              <div className="h-full w-full flex items-center justify-center bg-stone-50 rounded-xl animate-pulse">
                                 <span className="text-stone-300 font-serif italic">Initialisation du tracé...</span>
                              </div>
                           )}
                        </div>
                     </div>

                     {/* 3. DERNIERS EXPLOITS (Tableau Compact) */}
                     <div>
                        <h3 className="text-sm font-serif font-bold text-stone-500 uppercase tracking-widest mb-4">Derniers Exploits</h3>
                        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
                           {plays.slice(-5).reverse().map((play, idx) => (
                              <div key={play.id} className={`flex items-center justify-between p-4 ${idx !== 4 ? 'border-b border-stone-100' : ''} hover:bg-stone-50 transition-colors`}>
                                 <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${play.is_victory ? 'bg-amber-100 text-amber-600' : 'bg-stone-100 text-stone-400'}`}>
                                       {play.is_victory ? '🏆' : '💀'}
                                    </div>
                                    <div>
                                       {/* On aurait besoin du nom du jeu ici idéalement, mais on a l'ID. Pour l'instant on affiche la date propre */}
                                       <p className="font-bold text-stone-800 text-sm">Partie du {new Date(play.played_on).toLocaleDateString('fr-FR')}</p>
                                       <p className="text-[10px] text-stone-400 font-black uppercase tracking-wider">{play.duration_minutes ? `${play.duration_minutes} min` : 'Durée inconnue'}</p>
                                    </div>
                                 </div>
                                 <div className="text-right">
                                    <span className="text-xs font-serif font-bold text-stone-300">#{play.id.substring(0, 4)}</span>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>

                  </div>
               )}
            </div>
         </div>
      </>
   );
}
