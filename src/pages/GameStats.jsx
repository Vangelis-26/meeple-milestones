import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import TrendChart from '../components/TrendChart';

export default function GameStats() {
   const { id } = useParams();
   const navigate = useNavigate();
   const [game, setGame] = useState(null);
   const [plays, setPlays] = useState([]);
   const [loading, setLoading] = useState(true);

   // --- CAPTIONS & UTILS ---
   const captions = {
      victory: ["Le plan s'est déroulé sans accroc.", "Une leçon de stratégie magistrale.", "L'instant où la victoire était scellée.", "Maître du plateau, tout simplement.", "L'amitié a survécu (mais de justesse).", "Le point culminant d'un génie tactique."],
      defeat: ["Techniquement, j'ai presque gagné.", "Le hasard fait parfois mal les choses.", "Une retraite stratégique nécessaire.", "L'important, c'est de participer.", "Une défaite riche en enseignements.", "Le moment où les dés m'ont trahi."]
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
   const winRate = totalPlays > 0 ? Math.round((plays.filter(p => p.is_victory).length / totalPlays) * 100) : 0;
   const complexity = game?.complexity ? parseFloat(game.complexity) : 0;

   if (loading) return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
         <div className="animate-spin rounded-full h-10 w-10 border-2 border-stone-200 border-t-amber-600"></div>
      </div>
   );

   const monolithStyle = "bg-white rounded-[1.5rem] border border-stone-100 transition-all duration-300 hover:-translate-y-1 shadow-[8px_8px_0_0_rgba(28,25,23,0.05),0_15px_30px_-10px_rgba(0,0,0,0.1)]";

   return (
      <div className="min-h-screen bg-[#F5F5F2] flex flex-col font-sans text-stone-800 pt-16 md:pt-20">

         {/* SECTION 1 : HERO (TITRE) */}
         {/* pt-20/24 : On redonne l'espace interne pour que le contenu ne soit pas caché par la navbar */}
         <div className="relative h-[250px] md:h-[380px] shrink-0 bg-stone-900 overflow-hidden pt-20 md:pt-24">
            <img src={game?.image_url || game?.thumbnail_url} className="absolute inset-0 w-full h-full object-cover object-center opacity-40 blur-[1px]" alt="" />
            <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-950/30 to-transparent"></div>

            {/* Bouton Dashboard : Ajusté avec mt-20/24 pour passer sous la navbar */}
            <div className="absolute top-0 left-0 w-full p-4 md:p-6 z-20 mt-20 md:mt-24">
               <button onClick={() => navigate('/dashboard')} className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 transition-all flex items-center gap-2 group">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  Dashboard
               </button>
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10 text-center">
               <h1 className="font-serif font-black text-4xl md:text-7xl text-stone-900 leading-none drop-shadow-2xl mb-3 uppercase tracking-widest">{game?.name}</h1>
               <div className="h-1.5 w-28 bg-amber-600/40 mb-4 rounded-full"></div>
               <p className="text-amber-900 font-bold tracking-[0.4em] uppercase text-[10px] md:text-xs italic opacity-90">Chroniques & Statistiques</p>
            </div>
         </div>

         {/* SECTION 2 : STREAM (FIL) */}
         <div className="w-full max-w-7xl mx-auto p-4 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-16 items-start flex-grow relative">

            <div className="lg:col-span-1 space-y-8">
               {/* CARTES STATS (MAÎTRISE, DÉFI, FICHE BGG) */}
               <div className={`${monolithStyle} p-8 flex flex-col items-center text-center`}>
                  <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-6">Taux de Succès</h4>
                  <div className="relative w-32 h-32 md:w-36 md:h-36 mb-2">
                     <svg className="w-full h-full transform -rotate-90">
                        <circle cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-stone-50" />
                        <circle cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray="1000" strokeDashoffset={1000 - (1000 * winRate) / 100} strokeLinecap="round" className="text-amber-500 transition-all duration-1000" />
                     </svg>
                     <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl md:text-4xl font-serif font-black text-stone-900">{winRate}%</span>
                     </div>
                  </div>
                  <TrendChart plays={plays} />
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] mt-3">Courbe de Maîtrise</p>
               </div>

               <div className={`${monolithStyle} p-8`}>
                  <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-6 text-center">Progression Challenge</h4>
                  <div className="flex justify-center items-baseline gap-3 mb-6">
                     <span className="font-serif font-black text-4xl text-stone-900">{totalPlays}</span>
                     <span className="text-lg text-stone-300 font-bold uppercase tracking-widest">/ 10</span>
                  </div>
                  <div className="h-2.5 bg-stone-50 rounded-full overflow-hidden border border-stone-100 shadow-inner">
                     <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${(totalPlays / 10) * 100}%` }}></div>
                  </div>
               </div>

               <div className={`${monolithStyle} p-8`}>
                  <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-8 text-center">Fiche BGG</h4>
                  <div className="grid grid-cols-2 gap-y-8">
                     <div className="flex flex-col items-center border-r border-stone-50">
                        <svg className="w-5 h-5 mb-2 text-stone-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 110-8 4 4 0 010 8zm14 14v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 8" /></svg>
                        <span className="text-lg font-black text-stone-800 tracking-tight">{game?.min_players}—{game?.max_players}</span>
                        <span className="text-[9px] text-stone-400 uppercase font-black tracking-[0.2em] mt-1">Joueurs</span>
                     </div>
                     <div className="flex flex-col items-center">
                        <svg className="w-5 h-5 mb-2 text-stone-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="text-lg font-black text-stone-800 tracking-tight">{game?.playing_time}m</span>
                        <span className="text-[9px] text-stone-400 uppercase font-black tracking-[0.2em] mt-1">Durée</span>
                     </div>
                  </div>
               </div>

               <div className={`${monolithStyle} p-8 text-center`}>
                  <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-12">Complexité</h4>
                  <div className="relative h-1.5 bg-stone-50 rounded-full mb-10 border border-stone-100">
                     <span className="absolute -left-2 -top-12 text-2xl text-amber-500 opacity-80">🪶</span>
                     <span className="absolute -right-2 -top-12 text-2xl text-red-700 opacity-80">⚒️</span>
                     <div className={`absolute top-0 left-0 h-full transition-all duration-1000 ${complexity < 3.5 ? 'bg-amber-400' : 'bg-red-600'}`} style={{ width: `${(complexity / 5) * 100}%` }}></div>
                  </div>
                  <div className="flex justify-between items-center mt-6">
                     <span className="text-3xl font-serif font-black text-stone-900 tracking-tighter">{complexity.toFixed(2)} <span className="text-[10px] text-stone-300">/ 5</span></span>
                     <span className="bg-stone-900 text-white px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest">{complexity < 4 ? 'Standard' : 'Expert'}</span>
                  </div>
               </div>
            </div>

            {/* TIMELINE NARRATIVE */}
            <div className="lg:col-span-2">
               <div className="relative space-y-24 md:space-y-36 before:absolute before:left-8 md:before:left-1/2 before:-translate-x-1/2 before:w-px before:h-full before:bg-stone-200">
                  {plays.map((play, index) => {
                     const isLeftSide = index % 2 === 0;
                     const reliefColor = play.is_victory ? 'rgba(217,119,6,0.15)' : 'rgba(28,25,23,0.15)';
                     const shadowRelief = play.is_victory ? 'rgba(217,119,6,0.08)' : 'rgba(28,25,23,0.05)';

                     return (
                        <div key={play.id} className={`relative flex flex-col md:flex-row items-center justify-between gap-16 md:gap-32 ${isLeftSide ? 'md:flex-row' : 'md:flex-row-reverse'} pl-20 md:pl-0`}>
                           <div className={`absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 md:w-20 md:h-20 rounded-full border-4 md:border-[10px] border-[#FDFBF7] shadow-xl z-20 flex items-center justify-center text-3xl ${play.is_victory ? 'bg-amber-100 text-white shadow-amber-200/50' : 'bg-stone-800 text-stone-500'}`}>{play.is_victory ? '🏆' : '💀'}</div>

                           <div
                              className="w-full md:w-[41%] p-8 md:p-12 bg-white rounded-[1.5rem] border border-stone-100 transition-all duration-300 hover:-translate-y-1"
                              style={{
                                 boxShadow: `8px 8px 0 0 ${shadowRelief}, 0 15px 35px -10px ${reliefColor}`
                              }}
                           >
                              <div className="flex items-center justify-between mb-8 pb-6 border-b border-stone-100">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 aspect-square shrink-0 rounded-full bg-[#FDFBF7] border border-stone-200 flex items-center justify-center text-amber-700 shadow-sm">
                                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <div className="leading-tight">
                                       <time className="block text-[10px] font-black text-amber-800 uppercase tracking-widest mb-0.5">{new Date(play.played_on).toLocaleDateString('fr-FR', { weekday: 'long' })}</time>
                                       <h4 className="font-serif font-bold text-xl md:text-2xl text-stone-900 leading-none">{new Date(play.played_on).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</h4>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-1.5 text-stone-700 bg-stone-50 px-3 py-1.5 rounded-full border border-stone-100 text-[10px] font-black uppercase tracking-wider">
                                    {play.duration_minutes}m
                                 </div>
                              </div>
                              <p className="text-stone-700 font-serif italic leading-relaxed text-lg md:text-xl">« {play.notes || "Nul scribe n'a consigné les détails de cette rencontre."} »</p>
                           </div>

                           <div className="w-full md:w-[41%] flex justify-center mt-12 md:mt-0">
                              {play.image_urls?.length > 0 ? (
                                 <div className={`
                                    relative p-3 pb-24 bg-white shadow-xl 
                                    ${isLeftSide ? '-rotate-2' : 'rotate-2'} 
                                    hover:rotate-0 transition-all duration-300 ring-1 ring-stone-100 group
                                 `}>
                                    <div className="w-full aspect-square overflow-hidden bg-stone-50 border border-stone-100 shadow-inner"><img src={play.image_urls[0]} alt="" className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" /></div>
                                    <div className="absolute bottom-10 left-0 w-full text-center px-4"><span className="font-serif text-sm text-stone-600 font-bold italic leading-tight opacity-95">{getCaption(play.is_victory, play.id)}</span></div>
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-10 bg-white/70 backdrop-blur-md border border-white/30 -rotate-3 shadow-md"></div>
                                 </div>
                              ) : (
                                 <div className={`
                                    relative p-6 pb-20 bg-white shadow-xl 
                                    ${isLeftSide ? 'rotate-3' : '-rotate-3'} 
                                    hover:rotate-0 transition-all duration-300 border border-stone-100 group
                                 `}>
                                    <div className="w-40 h-40 flex flex-col items-center justify-center border-2 border-dashed border-stone-200 bg-[#FDFBF7] rounded-xl relative overflow-hidden shadow-inner"><svg className="w-12 h-12 text-stone-300 opacity-60 group-hover:scale-110 transition-transform duration-700" fill="none" stroke="currentColor" strokeWidth={0.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 18V6" /></svg><div className="absolute inset-0 bg-paper-texture opacity-[0.1]"></div></div>
                                    <div className="absolute bottom-10 left-0 w-full text-center px-4"><p className="font-serif text-[10px] text-stone-400 font-black italic uppercase tracking-[0.2em] leading-tight">Mémoire scellée</p></div>
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
