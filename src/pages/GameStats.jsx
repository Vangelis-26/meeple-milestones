import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

export default function GameStats() {
   const { id } = useParams();
   const [game, setGame] = useState(null);
   const [plays, setPlays] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const { data: gameData } = await supabase.from('games').select('*').eq('id', id).single();
            const { data: playsData } = await supabase.from('plays').select('*').eq('game_id', id).order('played_on', { ascending: false });
            setGame(gameData);
            setPlays(playsData || []);
         } catch (error) { console.error("Erreur:", error); } finally { setLoading(false); }
      };
      if (id) fetchData();
   }, [id]);

   // --- DATA & CALCULS ---
   const totalPlays = plays.length;
   const wins = plays.filter(p => p.is_victory).length;
   const winRate = totalPlays > 0 ? Math.round((wins / totalPlays) * 100) : 0;
   const complexity = game?.complexity ? parseFloat(game.complexity) : 0;
   const totalMinutes = plays.reduce((acc, curr) => acc + (curr.duration_minutes || 0), 0);
   const totalHours = Math.floor(totalMinutes / 60);

   const getComplexityColor = (c) => {
      if (c <= 2.5) return "bg-emerald-500";
      if (c <= 3.8) return "bg-amber-500";
      return "bg-rose-600";
   };

   const getCaption = (isVictory, playId) => {
      const v = ["Victoire éclatante", "Stratégie pure", "Le maître du jeu", "Moment de gloire"];
      const d = ["Leçon d'humilité", "Le sort s'acharne", "Revanche bientôt", "Tactique douteuse"];
      const list = isVictory ? v : d;
      return list[playId.charCodeAt(playId.length - 1) % list.length];
   };

   if (loading) return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
         <div className="animate-spin rounded-full h-10 w-10 border-2 border-stone-200 border-t-amber-600"></div>
      </div>
   );

   const monolithStyle = "bg-white rounded-[1.5rem] border border-stone-100 transition-all duration-300 hover:-translate-y-1 shadow-[8px_8px_0_0_rgba(28,25,23,0.05),0_15px_30px_-10px_rgba(0,0,0,0.1)]";

   return (
      <div className="min-h-screen bg-[#FDFBF7] font-sans text-stone-800 -mt-20 md:-mt-24 relative selection:bg-amber-100">

         {/* --- 1. HEADER HERO --- */}
         <div className="relative h-[250px] md:h-[380px] shrink-0 bg-stone-900 overflow-hidden pt-20 md:pt-24 shadow-2xl z-10 group border-b-[6px] border-stone-800">
            <img src={game?.image_url || game?.thumbnail_url} className="absolute inset-0 w-full h-full object-cover object-center opacity-40 blur-[1px] scale-105 transition-transform duration-[20s] group-hover:scale-100" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent"></div>

            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10 text-center mt-10 md:mt-12">
               <h1 className="font-serif font-black text-4xl md:text-7xl text-stone-900 leading-none drop-shadow-2xl mb-4 uppercase tracking-widest"
                  style={{ WebkitTextStroke: '2px #e7e5e4', textShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                  {game?.name}
               </h1>
               <div className="h-1.5 w-28 bg-amber-600/60 mb-4 rounded-full shadow-lg"></div>
               <p className="text-amber-200 font-bold tracking-[0.4em] uppercase text-[10px] md:text-xs italic opacity-90 text-shadow">Chroniques & Statistiques</p>
            </div>
         </div>

         {/* --- 2. CONTENU PRINCIPAL --- */}
         <div className="w-full max-w-7xl mx-auto p-4 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-start flex-grow relative z-10">

            {/* --- COLONNE DE GAUCHE : WIDGETS --- */}
            <div className="lg:col-span-4 space-y-8 sticky top-24">

               {/* TAUX DE SUCCÈS */}
               <div className={`${monolithStyle} p-8 flex flex-col items-center text-center`}>
                  <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-6">Taux de Succès</h4>
                  <div className="relative w-36 h-36 mb-4">
                     <svg className="w-full h-full transform -rotate-90">
                        <circle cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-stone-100" />
                        <circle cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray="1000" strokeDashoffset={1000 - (1000 * winRate) / 100} strokeLinecap="round" className="text-amber-500 transition-all duration-1000" />
                     </svg>
                     <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-4xl font-serif font-black text-stone-900">{winRate}%</span>
                     </div>
                  </div>
                  <div className="flex gap-4 w-full justify-center text-center">
                     <div><span className="block text-xl font-bold text-stone-800">{wins}</span><span className="text-[9px] font-black uppercase text-stone-400">Victoires</span></div>
                     <div className="w-px bg-stone-100"></div>
                     <div><span className="block text-xl font-bold text-stone-800">{totalPlays - wins}</span><span className="text-[9px] font-black uppercase text-stone-400">Défaites</span></div>
                  </div>
               </div>

               {/* CHALLENGE */}
               <div className={`${monolithStyle} p-8`}>
                  <div className="flex justify-between items-baseline mb-4">
                     <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Challenge</h4>
                     <span className="text-sm font-bold text-stone-800">{totalPlays} <span className="text-stone-300">/ 10</span></span>
                  </div>
                  <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden border border-stone-100 shadow-inner">
                     <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${Math.min((totalPlays / 10) * 100, 100)}%` }}></div>
                  </div>
               </div>

               {/* TEMPS TOTAL */}
               <div className={`${monolithStyle} p-8 flex items-center justify-between`}>
                  <div>
                     <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-1">Temps Total</h4>
                     <p className="text-2xl font-serif font-black text-stone-800">{totalHours}h <span className="text-sm text-stone-400">{totalMinutes % 60}m</span></p>
                  </div>
                  {/* Sablier visible comme demandé */}
                  <span className="text-4xl text-stone-300">⏳</span>
               </div>

               {/* INFO JEU (Complexité/Joueurs) */}
               <div className={`${monolithStyle} p-8`}>
                  <div className="mb-6">
                     <div className="flex justify-between items-center mb-3">
                        <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Complexité</h4>
                        <span className="text-lg font-serif font-bold text-stone-800">{complexity.toFixed(2)}</span>
                     </div>
                     <div className="flex gap-1 h-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                           <div key={i} className={`flex-1 rounded-full ${i <= Math.ceil(complexity) ? getComplexityColor(complexity) : 'bg-stone-100'}`}></div>
                        ))}
                     </div>
                  </div>
                  <div className="flex justify-between border-t border-stone-50 pt-4 text-center">
                     <div>
                        <span className="block text-lg font-bold text-stone-800">{game?.min_players}-{game?.max_players}</span>
                        <span className="text-[9px] text-stone-400 uppercase font-black tracking-wider">Joueurs</span>
                     </div>
                     <div>
                        <span className="block text-lg font-bold text-stone-800">{game?.playing_time}m</span>
                        <span className="text-[9px] text-stone-400 uppercase font-black tracking-wider">Durée</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* --- DROITE : TIMELINE VERTICALE --- */}
            <div className="lg:col-span-8 relative">

               {/* La Ligne Verticale (Positionnée à gauche) */}
               <div className="absolute left-8 top-4 bottom-0 w-px bg-stone-300 dashed"></div>

               <div className="space-y-16 py-4">
                  {plays.map((play, index) => {
                     const isVictory = play.is_victory;

                     // Styles "Gold"
                     // MODIFICATION ICI : Suppression de tileBorderColor
                     const shadowRelief = isVictory ? 'rgba(217,119,6,0.08)' : 'rgba(28,25,23,0.05)';
                     const reliefColor = isVictory ? 'rgba(217,119,6,0.15)' : 'rgba(28,25,23,0.15)';

                     const iconBg = isVictory ? 'bg-amber-500 text-white shadow-amber-200' : 'bg-stone-800 text-stone-400';

                     // Badges demandés
                     const badgeText = isVictory ? 'Glorieuse Victoire' : 'Lamentable Défaite';
                     const badgeStyle = isVictory ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-stone-100 text-stone-600 border-stone-200';

                     return (
                        <div key={play.id} className="relative group">

                           {/* ICONE (SUR LA LIGNE) */}
                           <div className={`absolute left-8 top-8 -translate-x-1/2 w-12 h-12 rounded-full border-[4px] border-[#FDFBF7] shadow-lg z-20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${iconBg}`}>
                              <span className="text-xl">{isVictory ? '🏆' : '💀'}</span>
                           </div>

                           {/* CONTENU (Décalé à droite de la ligne) */}
                           <div className="ml-24 flex flex-col xl:flex-row gap-8 items-start">

                              {/* CARTE TUILE 3D */}
                              {/* MODIFICATION ICI : Suppression de ${tileBorderColor} dans le className */}
                              <div
                                 className={`flex-1 w-full bg-white rounded-2xl p-8 border-2 border-stone-100 transition-all duration-300 group-hover:-translate-y-1`}
                                 style={{ boxShadow: `8px 8px 0 0 ${shadowRelief}, 0 15px 35px -10px ${reliefColor}` }}
                              >
                                 <div className="flex justify-between items-start mb-6 border-b border-stone-100 pb-4">
                                    <div>
                                       <time className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1 block">
                                          {new Date(play.played_on).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric' })}
                                       </time>
                                       <h2 className="font-serif font-bold text-3xl text-stone-900 capitalize leading-none">
                                          {new Date(play.played_on).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                                       </h2>
                                    </div>
                                    {/* Badge Victoire/Défaite */}
                                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border ${badgeStyle}`}>
                                       {badgeText}
                                    </div>
                                 </div>

                                 <p className="text-stone-600 font-serif text-lg leading-relaxed italic pl-4 border-l-2 border-stone-100">
                                    « {play.notes || "Le silence est d'or. Aucune archive écrite pour cette partie."} »
                                 </p>

                                 <div className="mt-8 pt-4 border-t border-stone-50 flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-stone-500 text-xs font-bold uppercase tracking-wider bg-stone-50 px-3 py-1.5 rounded-full border border-stone-100">
                                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                       {play.duration_minutes} min
                                    </div>
                                 </div>
                              </div>

                              {/* POLAROID (Positionné à droite) */}
                              {play.image_urls?.length > 0 && (
                                 <div className="w-full xl:w-64 shrink-0 flex justify-center xl:block mt-2 xl:mt-0">
                                    <div className="bg-white p-3 pb-12 shadow-xl rotate-1 group-hover:rotate-0 transition-all duration-500 relative border border-stone-200">
                                       {/* SCOTCH */}
                                       <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-stone-100/40 backdrop-blur-[2px] border-x border-white/60 shadow-sm -rotate-2 z-20 pointer-events-none opacity-80"></div>

                                       {/* IMAGE */}
                                       <div className="aspect-square bg-stone-100 overflow-hidden mb-3 filter sepia-[0.15] group-hover:sepia-0 transition-all duration-700 shadow-inner">
                                          <img src={play.image_urls[0]} alt="Souvenir" className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700" />
                                       </div>

                                       {/* LÉGENDE */}
                                       <div className="absolute bottom-4 left-0 w-full text-center px-4">
                                          <span className="font-handwriting text-stone-500 text-xs font-bold opacity-80 italic">
                                             {getCaption(isVictory, play.id)}
                                          </span>
                                       </div>
                                    </div>
                                 </div>
                              )}
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>

         </div>
      </div>
   );
}
