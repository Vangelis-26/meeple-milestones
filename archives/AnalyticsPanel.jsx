// =================================================================================
// COMPOSANT : ANALYTICS PANEL (TIROIR)
// Rôle : Affichage détaillé des statistiques (Graphiques, KPIs) dans un panneau latéral.
// =================================================================================

import { useState, useEffect, useMemo } from 'react';
import { ResponsiveContainer, ComposedChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function AnalyticsPanel({ isOpen, onClose, fetchGlobalPlays }) {
   const [plays, setPlays] = useState([]);
   const [loading, setLoading] = useState(false);
   const [shouldRenderChart, setShouldRenderChart] = useState(false);

   // Chargement des données à l'ouverture
   useEffect(() => {
      if (isOpen) {
         setLoading(true);
         // Délai pour laisser l'animation CSS se finir avant de calculer le JS lourd
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

   // KPIs
   const kpi = useMemo(() => {
      if (plays.length === 0) return { wins: 0, rate: 0, totalHours: 0 };
      const wins = plays.filter(p => p.is_victory).length;
      const rate = Math.round((wins / plays.length) * 100);
      const minutes = plays.reduce((acc, p) => acc + (p.duration_minutes || 0), 0);
      return { wins, rate, totalHours: Math.round(minutes / 60) };
   }, [plays]);

   // Données Graphique (Par Mois)
   const chartData = useMemo(() => {
      const data = {};
      plays.forEach(p => {
         const key = p.played_on.substring(0, 7); // "2023-10"
         if (!data[key]) data[key] = { name: key, total: 0, wins: 0 };
         data[key].total += 1;
         if (p.is_victory) data[key].wins += 1;
      });
      return Object.values(data).sort((a, b) => a.name.localeCompare(b.name)).slice(-6); // 6 derniers mois
   }, [plays]);

   return (
      <>
         {/* Overlay */}
         <div
            className={`fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[80] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={onClose}
         ></div>

         {/* Drawer */}
         <div className={`fixed inset-y-0 right-0 w-full max-w-md bg-[#FDFBF7] shadow-2xl z-[90] transform transition-transform duration-500 ease-out border-l border-stone-200 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

            {/* Header */}
            <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-white">
               <h2 className="font-serif font-black text-2xl text-stone-900">Analyses</h2>
               <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full text-stone-400">✕</button>
            </div>

            {/* Contenu Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
               {loading ? (
                  <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full"></div></div>
               ) : (
                  <>
                     {/* 1. KPIs */}
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm text-center">
                           <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2">Victoires</p>
                           <p className="text-4xl font-serif font-black text-amber-600">{kpi.rate}%</p>
                           <p className="text-xs text-stone-400 mt-1">{kpi.wins} sur {plays.length}</p>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm text-center">
                           <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2">Temps de Jeu</p>
                           <p className="text-4xl font-serif font-black text-stone-800">{kpi.totalHours}<span className="text-base align-top ml-1 opacity-50">h</span></p>
                        </div>
                     </div>

                     {/* 2. GRAPHIQUE */}
                     <div className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm h-64">
                        <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-4">Activité Récente</p>
                        {shouldRenderChart && (
                           <ResponsiveContainer width="100%" height="85%">
                              <ComposedChart data={chartData}>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                                 <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                                 <YAxis hide />
                                 <Tooltip contentStyle={{ backgroundColor: '#1c1917', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }} itemStyle={{ color: '#fbbf24' }} />
                                 <Bar dataKey="total" fill="#e7e5e4" radius={[4, 4, 0, 0]} barSize={30} />
                                 <Bar dataKey="wins" fill="#d97706" radius={[4, 4, 0, 0]} barSize={30} />
                              </ComposedChart>
                           </ResponsiveContainer>
                        )}
                     </div>
                  </>
               )}
            </div>
         </div>
      </>
   );
}
