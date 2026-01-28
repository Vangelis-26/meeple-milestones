import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
      if (c <= 2.0) return "bg-emerald-600";
      if (c <= 3.5) return "bg-amber-500";
      return "bg-rose-700";
   };

   const getCaption = (isVictory, playId) => {
      const v = ["Victoire éclatante", "Stratégie pure", "Le maître du jeu", "Moment de gloire", "Triomphe absolu"];
      const d = ["Leçon d'humilité", "Le sort s'acharne", "Revanche bientôt", "Tactique douteuse", "L'expérience rentre"];
      const list = isVictory ? v : d;
      return list[(playId || "").charCodeAt(0) % list.length];
   };

   if (loading) return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
         <div className="animate-spin rounded-full h-10 w-10 border-4 border-stone-200 border-t-amber-600"></div>
      </div>
   );

   const monolithStyle = "bg-white rounded-[1.5rem] border transition-all duration-300 hover:-translate-y-1 shadow-[8px_8px_0_0_rgba(28,25,23,0.05),0_15px_30px_-10px_rgba(0,0,0,0.1)]";

   return (
      <div className="min-h-screen bg-[#FDFBF7] font-sans text-stone-800 -mt-20 md:-mt-24 relative selection:bg-amber-100">

         {/* --- 1. HEADER HERO (IMMERSION TOTALE) --- */}
         <div className="relative h-[400px] md:h-[520px] shrink-0 bg-stone-900 overflow-hidden pt-20 md:pt-24 shadow-2xl z-10 border-b-[6px] border-stone-800">
            {/* Image du jeu en plein écran avec opacité pour l'immersion */}
            <img
               src={game?.image_url || game?.thumbnail_url}
               className="absolute inset-0 w-full h-full object-cover object-center opacity-60 saturate-[0.8]"
               alt=""
            />

            {/* Dégradés stratégiques pour la lisibilité du texte */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-transparent to-transparent"></div>

            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10 text-center mt-10 md:mt-16">

               {/* TITRE BLANC & PUISSANT (Style Affiche de Film) */}
               <h1 className="font-serif font-black text-6xl md:text-8xl lg:text-9xl leading-none mb-6 tracking-tight text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
                  {game?.name}
               </h1>

               {/* Sous-titre sobre (Sans date) */}
               <div className="flex items-center gap-4 opacity-90">
                  <div className="h-px w-8 bg-white/70 shadow-sm"></div>
                  <p className="text-white font-bold tracking-[0.4em] uppercase text-[10px] md:text-xs drop-shadow-md">
                     Chroniques & Statistiques
                  </p>
                  <div className="h-px w-8 bg-white/70 shadow-sm"></div>
               </div>
            </div>
         </div>

         {/* --- 2. CONTENU PRINCIPAL --- */}
         <div className="w-full max-w-7xl mx-auto p-4 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-start flex-grow relative z-10">

            {/* --- COLONNE DE GAUCHE : WIDGETS --- */}
            <div className="lg:col-span-4 space-y-8 sticky top-24">

               {/* TAUX DE SUCCÈS (Police ajustée pour 100%) */}
               <div className={`${monolithStyle} border-stone-100 p-8 flex flex-col items-center text-center group`}>
                  <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-6">Taux de Succès</h4>
                  <div className="relative w-40 h-40 mb-6 transition-transform duration-500 group-hover:scale-105">
                     <svg className="w-full h-full transform -rotate-90">
                        <circle cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-stone-100" />
                        <circle
                           cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="8" fill="transparent"
                           strokeDasharray="1000" strokeDashoffset={1000 - (1000 * winRate) / 100}
                           strokeLinecap="round" className="text-amber-500 transition-all duration-1000 ease-out"
                        />
                     </svg>
                     <div className="absolute inset-0 flex items-center justify-center flex-col">
                        {/* CORRECTION : text-4xl au lieu de 5xl pour que 100% rentre */}
                        <span className="text-4xl font-serif font-black text-stone-900 tracking-tight">{winRate}%</span>
                     </div>
                  </div>
                  <div className="flex gap-8 w-full justify-center text-center">
                     <div><span className="block text-2xl font-serif font-bold text-stone-800">{wins}</span><span className="text-[9px] font-black uppercase text-stone-400">Victoires</span></div>
                     <div className="w-px bg-stone-100"></div>
                     <div><span className="block text-2xl font-serif font-bold text-stone-800">{totalPlays - wins}</span><span className="text-[9px] font-black uppercase text-stone-400">Défaites</span></div>
                  </div>
               </div>

               {/* CHALLENGE BAR */}
               <div className={`${monolithStyle} border-stone-100 p-8`}>
                  <div className="flex justify-between items-baseline mb-4">
                     <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Challenge</h4>
                     <span className="text-sm font-bold text-stone-800">{totalPlays} <span className="text-stone-300">/ 10</span></span>
                  </div>
                  <div className="h-3 bg-stone-100 rounded-full overflow-hidden border border-stone-100 shadow-inner">
                     <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-1000 relative" style={{ width: `${Math.min((totalPlays / 10) * 100, 100)}%` }}>
                        <div className="absolute top-0 right-0 bottom-0 w-full bg-white/20 animate-pulse"></div>
                     </div>
                  </div>
               </div>

               {/* INFO TECHNIQUE */}
               <div className={`${monolithStyle} border-stone-100 p-8`}>
                  <div className="mb-6">
                     <div className="flex justify-between items-center mb-3">
                        <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Poids BGG</h4>
                        <span className="text-lg font-serif font-bold text-stone-800">{complexity.toFixed(2)}</span>
                     </div>
                     <div className="flex gap-1 h-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                           <div key={i} className={`flex-1 rounded-sm transition-all duration-500 ${i <= Math.ceil(complexity) ? getComplexityColor(complexity) : 'bg-stone-100'}`}></div>
                        ))}
                     </div>
                  </div>
                  <div className="flex justify-between border-t border-stone-100 pt-4 text-center">
                     <div>
                        <span className="block text-xl font-serif font-bold text-stone-800">{game?.min_players}-{game?.max_players}</span>
                        <span className="text-[9px] text-stone-400 uppercase font-black tracking-wider">Joueurs</span>
                     </div>
                     <div>
                        <span className="block text-xl font-serif font-bold text-stone-800">{game?.playing_time}</span>
                        <span className="text-[9px] text-stone-400 uppercase font-black tracking-wider">Minutes</span>
                     </div>
                     <div>
                        <span className="block text-xl font-serif font-bold text-stone-800">{game?.min_age}+</span>
                        <span className="text-[9px] text-stone-400 uppercase font-black tracking-wider">Age</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* --- DROITE : TIMELINE VERTICALE --- */}
            <div className="lg:col-span-8 relative">

               {/* TITRE DE SECTION */}
               <div className="mb-12 pl-8 border-l-4 border-amber-500">
                  <h3 className="text-3xl font-serif font-black text-stone-900 mb-1">Chroniques du Jeu</h3>
                  <p className="text-stone-500 italic">"Chaque partie forge la légende."</p>
               </div>

               {/* Ligne Verticale Continue */}
               <div className="absolute left-[39px] top-24 bottom-0 w-0.5 bg-stone-200"></div>

               <div className="space-y-12">
                  {plays.map((play) => {
                     const isVictory = play.is_victory;
                     const borderColor = isVictory ? 'border-amber-400/60' : 'border-stone-300';
                     const shadowRelief = isVictory ? 'rgba(217,119,6,0.08)' : 'rgba(28,25,23,0.05)';
                     const badgeText = isVictory ? 'Glorieuse Victoire' : 'Lamentable Défaite';
                     const badgeClass = isVictory ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-stone-100 text-stone-600 border-stone-200';
                     const iconBg = isVictory ? 'bg-amber-500 text-white shadow-amber-200 shadow-lg' : 'bg-stone-200 text-stone-400';

                     return (
                        <div key={play.id} className="relative group">

                           {/* ICONE RONDE (Sur la ligne) */}
                           <div className={`absolute left-10 top-8 -translate-x-1/2 w-14 h-14 rounded-full border-[6px] border-[#FDFBF7] z-20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${iconBg}`}>
                              <span className="text-2xl drop-shadow-sm">{isVictory ? '🏆' : '💀'}</span>
                           </div>

                           {/* CARTE CONTENU */}
                           <div className="ml-24 flex flex-col xl:flex-row gap-6 items-start">

                              {/* 1. CARTE TEXTE (Animée au survol) */}
                              <div
                                 className={`${monolithStyle} ${borderColor} border-2 flex-1 p-8 relative overflow-hidden`}
                                 style={{ boxShadow: `8px 8px 0 0 ${shadowRelief}` }}
                              >
                                 <div className="flex flex-wrap gap-3 items-center mb-4">
                                    <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${badgeClass}`}>
                                       {badgeText}
                                    </span>
                                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-1">
                                       <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                       {play.duration_minutes} min
                                    </span>
                                 </div>

                                 <h3 className="font-serif font-bold text-2xl text-stone-900 mb-1 capitalize">
                                    {new Date(play.played_on).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                 </h3>

                                 <div className="mt-6 relative pl-6">
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-full ${isVictory ? 'bg-amber-300' : 'bg-stone-300'}`}></div>
                                    <p className="text-stone-600 font-serif italic text-lg leading-relaxed">
                                       « {play.notes || "Le silence est d'or. Aucune archive écrite pour cette partie."} »
                                    </p>
                                 </div>
                              </div>

                              {/* 2. POLAROID (TOTALEMENT STATIQUE & CORRIGÉ) */}
                              {play.image_urls?.length > 0 && (
                                 <div className="w-full xl:w-64 shrink-0 mt-4 xl:mt-0 flex justify-center xl:block">
                                    <div className="bg-white p-3 pb-8 shadow-[0_10px_20px_rgba(0,0,0,0.15)] rotate-2 border border-stone-200 max-w-[220px] mx-auto relative">
                                       {/* SCOTCH */}
                                       <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-stone-100/50 backdrop-blur-[1px] -rotate-1 shadow-sm border-l border-white/50 z-10"></div>

                                       <div className="aspect-square bg-stone-100 overflow-hidden mb-2 shadow-inner border border-stone-100">
                                          <img src={play.image_urls[0]} alt="Souvenir" className="w-full h-full object-cover" />
                                       </div>
                                       <div className="text-center pt-2">
                                          <span className="font-handwriting text-xs text-stone-400 italic">
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

                  {plays.length === 0 && (
                     <div className="ml-24 p-12 text-center bg-white rounded-[2rem] border border-dashed border-stone-300">
                        <p className="text-stone-400 font-serif italic text-xl mb-4">"Ce livre est encore vierge..."</p>
                        <p className="text-stone-500 text-sm">Jouez votre première partie pour commencer à écrire l'histoire.</p>
                     </div>
                  )}
               </div>
            </div>

         </div>
      </div>
   );
}
