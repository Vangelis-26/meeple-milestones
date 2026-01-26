import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

export default function GameStats() {
   const { id } = useParams();
   const navigate = useNavigate();

   const [game, setGame] = useState(null);
   const [plays, setPlays] = useState([]);
   const [loading, setLoading] = useState(true);

   // --- LÉGENDES NARRATIVES ---
   const captions = {
      victory: [
         "Le plan s'est déroulé sans accroc.",
         "Une leçon de stratégie magistrale.",
         "L'instant où la victoire était scellée.",
         "Maître du plateau, tout simplement.",
         "L'amitié a survécu (mais de justesse).",
         "Le point culminant d'un génie tactique."
      ],
      defeat: [
         "Techniquement, j'ai presque gagné.",
         "Le hasard fait parfois mal les choses.",
         "Une retraite stratégique nécessaire.",
         "L'important, c'est de participer.",
         "Une défaite riche en enseignements.",
         "Le moment où les dés m'ont trahi."
      ]
   };

   const getCaption = (isVictory, playId) => {
      const list = isVictory ? captions.victory : captions.defeat;
      const index = playId.charCodeAt(playId.length - 1) % list.length;
      return list[index];
   };

   useEffect(() => {
      const fetchData = async () => {
         try {
            const { data: gameData } = await supabase.from('games').select('*').eq('id', id).single();
            const { data: playsData } = await supabase.from('plays').select('*').eq('game_id', id).order('played_on', { ascending: false });
            setGame(gameData);
            setPlays(playsData || []);
         } catch (error) {
            console.error("Erreur:", error);
         } finally {
            setLoading(false);
         }
      };
      if (id) fetchData();
   }, [id]);

   const totalPlays = plays.length;
   const victories = plays.filter(p => p.is_victory).length;
   const winRate = totalPlays > 0 ? Math.round((victories / totalPlays) * 100) : 0;
   const complexity = game?.complexity ? parseFloat(game.complexity) : 0;

   if (loading) return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
         <div className="animate-spin rounded-full h-12 w-12 border-4 border-stone-200 border-t-amber-600"></div>
      </div>
   );

   return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans text-stone-800">

         {/* 1. HERO BANNER */}
         <div className="relative h-[350px] md:h-[450px] shrink-0 bg-stone-950 overflow-hidden shadow-2xl">
            <img src={game?.image_url || game?.thumbnail_url} className="absolute inset-0 w-full h-full object-cover object-center opacity-40 blur-[1px] scale-105" alt="" />
            <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-transparent to-[#FDFBF7]"></div>

            <div className="absolute top-0 left-0 w-full p-6 md:p-10 z-20">
               <button onClick={() => navigate('/dashboard')} className="px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 transition-all flex items-center gap-3 group">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  Dashboard
               </button>
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10 text-center">
               <h1 className="font-serif font-black text-5xl md:text-8xl text-stone-900 leading-none drop-shadow-2xl mb-4 italic uppercase tracking-tighter">
                  {game?.name}
               </h1>
               <p className="text-amber-900 font-bold tracking-[0.4em] uppercase text-[10px] md:text-sm italic opacity-80">
                  Chroniques & Statistiques
               </p>
            </div>
         </div>

         {/* 2. ANALYTIQUES GLOBALES */}
         <div className="w-full max-w-7xl mx-auto p-4 md:p-16 grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-16">
            <div className="lg:col-span-1 space-y-8 md:space-y-12">

               <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-stone-100 shadow-xl flex flex-col items-center text-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  <h4 className="text-[10px] font-black text-stone-500 uppercase tracking-[0.3em] mb-8">Taux de Succès</h4>
                  <div className="relative w-40 h-40 md:w-52 md:h-52">
                     <svg className="w-full h-full transform -rotate-90">
                        <circle cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-stone-50" />
                        <circle cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="14" fill="transparent"
                           strokeDasharray="1000" strokeDashoffset={1000 - (1000 * winRate) / 100}
                           strokeLinecap="round" className="text-amber-500 transition-all duration-1000 ease-out"
                        />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl md:text-6xl font-serif font-black text-stone-900">{winRate}%</span>
                     </div>
                  </div>
               </div>

               <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-stone-100 shadow-xl relative overflow-hidden text-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                  <h4 className="text-[10px] font-black text-stone-500 uppercase tracking-[0.3em] mb-2">Poids du Défi (BGG)</h4>
                  <p className="text-[9px] text-stone-400 uppercase tracking-widest mb-8 italic">Exigence stratégique théorique</p>
                  <div className="flex items-center justify-between mb-6 px-6 md:px-10">
                     <span className="text-2xl md:text-3xl grayscale">🪶</span>
                     <span className="text-2xl md:text-3xl grayscale">⚒️</span>
                  </div>
                  <div className="relative h-2.5 bg-stone-50 rounded-full overflow-hidden mb-6">
                     <div
                        className={`absolute top-0 left-0 h-full transition-all duration-1000 ${complexity < 3.5 ? 'bg-amber-400' : 'bg-red-500'}`}
                        style={{ width: `${(complexity / 5) * 100}%` }}
                     ></div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black text-stone-600 uppercase tracking-widest">
                     <div className="flex items-baseline gap-1">
                        <span className="text-2xl md:text-3xl font-serif font-black text-stone-800">{complexity.toFixed(2)}</span>
                        <span className="text-[10px] font-bold text-stone-400">/ 5.00</span>
                     </div>
                     <span className="bg-stone-100 px-3 py-1.5 rounded-lg text-stone-700 border border-stone-200 uppercase text-[9px]">
                        {complexity < 4 ? 'Standard' : 'Expert'}
                     </span>
                  </div>
               </div>
            </div>

            {/* 3. CHRONIQUE NARRATIVE */}
            <div className="lg:col-span-2">
               <div className="relative space-y-24 md:space-y-36 
            before:absolute before:left-8 md:before:left-1/2 
            before:-translate-x-1/2 before:w-px before:h-full 
            before:bg-gradient-to-b before:from-amber-500/40 before:via-stone-200 before:to-transparent">

                  {plays.map((play, index) => {
                     const isLeftSide = index % 2 === 0;
                     const borderColor = play.is_victory ? 'border-l-amber-500' : 'border-l-stone-800';
                     const reliefColor = play.is_victory ? 'border-b-amber-500/95' : 'border-b-stone-900/90';

                     return (
                        <div key={play.id} className={`relative flex flex-col md:flex-row items-center justify-between gap-12 md:gap-0 
                  ${isLeftSide ? 'md:flex-row' : 'md:flex-row-reverse'} 
                  pl-20 md:pl-0`}>

                           <div className={`absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 md:w-20 md:h-20 
                    rounded-full border-[6px] md:border-[8px] border-[#FDFBF7] shadow-2xl z-20 
                    flex items-center justify-center text-3xl md:text-4xl
                    ${play.is_victory ? 'bg-amber-100 text-white shadow-amber-200/50' : 'bg-stone-800 text-stone-500 shadow-stone-200/50'}`}>
                              {play.is_victory ? '🏆' : '💀'}
                           </div>

                           {/* CARTOUCHE TEXTE AVEC EFFET HOVER */}
                           <div className={`w-full md:w-[44%] p-8 md:p-12 bg-white shadow-2xl relative 
                    border-[1px] border-stone-200 transition-all duration-300 rounded-[2rem]
                    border-l-[10px] md:border-l-[12px] ${borderColor}
                    border-b-[6px] md:border-b-[8px] ${reliefColor}
                    hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)]
                  `}>
                              <div className="absolute inset-0 bg-paper-texture opacity-[0.05] pointer-events-none rounded-[2rem]"></div>

                              <div className="flex flex-col sm:flex-row justify-between items-start mb-6 md:mb-8 border-b border-stone-100 pb-6 relative z-10 gap-4">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#FDFBF7] border border-stone-200 flex items-center justify-center text-amber-700 shadow-md">
                                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <div>
                                       <time className="block text-[9px] md:text-[10px] font-black text-amber-800 uppercase tracking-widest mb-1 opacity-90">
                                          {new Date(play.played_on).toLocaleDateString('fr-FR', { weekday: 'long' })}
                                       </time>
                                       <h4 className="font-serif font-bold text-xl md:text-2xl text-stone-900 tracking-tight leading-none">
                                          {new Date(play.played_on).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                       </h4>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-2 text-stone-600 font-bold bg-stone-50 px-3 py-1.5 rounded-full border border-stone-100 shadow-sm">
                                    <span className="text-[10px] font-black uppercase tracking-widest">{play.duration_minutes}m</span>
                                    <span className="text-sm">⏳</span>
                                 </div>
                              </div>

                              <div className="relative z-10">
                                 <p className="text-stone-700 font-serif italic leading-relaxed text-lg md:text-xl">
                                    « {play.notes || "Nul scribe n'a consigné les détails de cette rencontre."} »
                                 </p>
                              </div>
                           </div>

                           {/* POLAROID AVEC EFFET HOVER */}
                           <div className="w-full md:w-[44%] flex justify-center mt-12 md:mt-0">
                              {play.image_urls?.length > 0 ? (
                                 <div className={`relative p-4 pb-24 md:pb-28 bg-white shadow-2xl rotate-${isLeftSide ? '-2' : '2'} hover:rotate-0 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(0,0,0,0.2)] transition-all duration-300 ring-1 ring-stone-100 group`}>
                                    <div className="w-full aspect-square overflow-hidden bg-stone-50 border border-stone-100 shadow-inner">
                                       <img src={play.image_urls[0]} alt="" className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" />
                                    </div>
                                    <div className="absolute bottom-6 md:bottom-10 left-0 w-full text-center px-4">
                                       <span className="font-serif text-[11px] md:text-sm text-stone-600 font-bold italic leading-tight opacity-95">
                                          {getCaption(play.is_victory, play.id)}
                                       </span>
                                    </div>
                                    <div className="absolute -top-4 md:-top-5 left-1/2 -translate-x-1/2 w-16 md:w-20 h-8 md:h-10 bg-white/60 backdrop-blur-sm border border-white/20 -rotate-3 shadow-md"></div>
                                 </div>
                              ) : (
                                 <div className={`relative p-4 md:p-6 pb-20 md:pb-24 bg-white shadow-xl rotate-${isLeftSide ? '3' : '-3'} hover:rotate-0 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 border border-stone-100 group`}>
                                    <div className="w-36 h-36 md:w-44 md:h-44 flex flex-col items-center justify-center border-2 border-dashed border-stone-100 bg-[#FDFBF7] rounded-xl relative overflow-hidden">
                                       <svg className="w-12 h-12 md:w-16 md:h-16 text-stone-300 opacity-60 mix-blend-multiply group-hover:scale-110 transition-transform duration-700" fill="none" stroke="currentColor" strokeWidth={0.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 18V6" /></svg>
                                       <div className="absolute inset-0 bg-paper-texture opacity-[0.1]"></div>
                                    </div>
                                    <div className="absolute bottom-6 md:bottom-10 left-0 w-full text-center px-2">
                                       <p className="font-serif text-[10px] md:text-xs text-stone-500 font-bold italic uppercase tracking-widest leading-tight">
                                          « Mémoire scellée »
                                       </p>
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
