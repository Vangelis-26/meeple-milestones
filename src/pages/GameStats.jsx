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
         } catch (error) { console.error(error); } finally { setLoading(false); }
      };
      if (id) fetchData();
   }, [id]);

   const totalPlays = plays.length;
   const winRate = totalPlays > 0 ? Math.round((plays.filter(p => p.is_victory).length / totalPlays) * 100) : 0;
   const complexity = game?.complexity ? parseFloat(game.complexity) : 0;

   if (loading) return (
      <div className="min-h-screen flex items-center justify-center">
         <div className="animate-spin rounded-full h-10 w-10 border-2 border-stone-200 border-t-amber-600"></div>
      </div>
   );

   const monolithStyle = "bg-white rounded-[1.5rem] border border-stone-100 transition-all duration-300 hover:-translate-y-1 shadow-[8px_8px_0_0_rgba(28,25,23,0.05),0_15px_30px_-10px_rgba(0,0,0,0.1)]";

   return (
      <div className="flex-1 flex flex-col w-full max-w-[90rem] mx-auto px-4 md:px-8 py-8 font-sans text-stone-800 mt-[64px]">
         <div className="relative h-[250px] md:h-[380px] shrink-0 bg-stone-900 overflow-hidden rounded-[2.5rem] mb-12">
            <img src={game?.image_url || game?.thumbnail_url} className="absolute inset-0 w-full h-full object-cover object-center opacity-40 blur-[1px]" alt="" />
            <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-950/30 to-transparent"></div>

            <div className="absolute top-8 left-8 z-20">
               <button onClick={() => navigate('/dashboard')} className="group flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 transition-all shadow-sm active:scale-95">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  Retour au Dashboard
               </button>
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10 text-center">
               <h1 className="font-serif font-black text-4xl md:text-7xl text-white leading-none drop-shadow-2xl mb-3 uppercase tracking-widest">{game?.name}</h1>
               <div className="h-1.5 w-28 bg-amber-600/60 mb-4 rounded-full"></div>
               <p className="text-amber-200 font-bold tracking-[0.4em] uppercase text-[10px] md:text-xs italic opacity-90 text-shadow">Chroniques & Statistiques</p>
            </div>
         </div>

         <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-16 items-start flex-grow relative">
            <div className="lg:col-span-1 space-y-8">
               <div className={`${monolithStyle} p-8 flex flex-col items-center text-center`}>
                  <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-6">Taux de Succès</h4>
                  <div className="relative w-32 h-32 md:w-36 md:h-36 mb-2">
                     <svg className="w-full h-full transform -rotate-90">
                        <circle cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-stone-50" />
                        <circle cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray="1000" strokeDashoffset={1000 - (1000 * winRate) / 100} strokeLinecap="round" className="text-amber-500 transition-all" />
                     </svg>
                     <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl md:text-4xl font-serif font-black text-stone-900">{winRate}%</span>
                     </div>
                  </div>
                  <TrendChart plays={plays} />
               </div>

               <div className={`${monolithStyle} p-8`}>
                  <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-6 text-center">Progression Challenge</h4>
                  <div className="flex justify-center items-baseline gap-3 mb-6">
                     <span className="font-serif font-black text-4xl text-stone-900">{totalPlays}</span>
                     <span className="text-lg text-stone-300 font-bold uppercase tracking-widest">/ 10</span>
                  </div>
                  <div className="h-2.5 bg-stone-50 rounded-full overflow-hidden border border-stone-100">
                     <div className="h-full bg-amber-500 transition-all" style={{ width: `${Math.min((totalPlays / 10) * 100, 100)}%` }}></div>
                  </div>
               </div>
            </div>

            <div className="lg:col-span-2">
               <div className="relative space-y-24 md:space-y-36 before:absolute before:left-8 md:before:left-1/2 before:-translate-x-1/2 before:w-px before:h-full before:bg-stone-200">
                  {plays.map((play, index) => {
                     const isLeftSide = index % 2 === 0;
                     const isVictory = play.is_victory;
                     return (
                        <div key={play.id} className={`relative flex flex-col md:flex-row items-center justify-between gap-16 md:gap-32 ${isLeftSide ? 'md:flex-row' : 'md:flex-row-reverse'} pl-20 md:pl-0`}>
                           <div className={`absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 md:w-20 md:h-20 rounded-full border-4 md:border-[8px] border-[#FDFBF7] shadow-xl z-20 flex items-center justify-center text-3xl ${isVictory ? 'bg-amber-100 text-white' : 'bg-stone-800 text-stone-500'}`}>{isVictory ? '🏆' : '💀'}</div>
                           <div className="w-full md:w-[41%] p-8 md:p-12 bg-white rounded-[1.5rem] border border-stone-100 transition-all hover:-translate-y-1 shadow-xl">
                              <div className="flex items-center justify-between mb-8 pb-6 border-b border-stone-100">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#FDFBF7] border border-stone-200 flex items-center justify-center text-amber-700"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                                    <div className="leading-tight">
                                       <time className="block text-[10px] font-black text-amber-800 uppercase tracking-widest mb-0.5">{new Date(play.played_on).toLocaleDateString('fr-FR', { weekday: 'long' })}</time>
                                       <h4 className="font-serif font-bold text-xl text-stone-900 leading-none">{new Date(play.played_on).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</h4>
                                    </div>
                                 </div>
                                 <div className="text-[10px] font-black uppercase text-stone-700 bg-stone-50 px-3 py-1.5 rounded-full border border-stone-100">{play.duration_minutes}m</div>
                              </div>
                              <p className="text-stone-700 font-serif italic text-lg leading-relaxed">« {play.notes || "Nul scribe n'a consigné les détails de cette rencontre."} »</p>
                           </div>
                           <div className="w-full md:w-[41%] flex justify-center mt-12 md:mt-0">
                              {play.image_urls?.length > 0 ? (
                                 <div className={`relative p-3 pb-24 bg-white shadow-xl ${isLeftSide ? '-rotate-2' : 'rotate-2'} hover:rotate-0 transition-all group`}>
                                    <div className="w-full aspect-square overflow-hidden bg-stone-50"><img src={play.image_urls[0]} alt="" className="w-full h-full object-cover" /></div>
                                    <div className="absolute bottom-10 left-0 w-full text-center px-4"><span className="font-serif text-sm text-stone-600 font-bold italic">{getCaption(isVictory, play.id)}</span></div>
                                 </div>
                              ) : (
                                 <div className={`relative p-6 pb-20 bg-white shadow-xl ${isLeftSide ? 'rotate-3' : '-rotate-3'} hover:rotate-0 transition-all border border-stone-100`}>
                                    <div className="w-40 h-40 flex flex-col items-center justify-center border-2 border-dashed border-stone-200 bg-[#FDFBF7] rounded-xl relative overflow-hidden shadow-inner"><svg className="w-12 h-12 text-stone-300 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2zM12 18V6" /></svg></div>
                                    <div className="absolute bottom-10 left-0 w-full text-center px-4"><p className="font-serif text-[10px] text-stone-400 font-black italic uppercase tracking-[0.2em]">Mémoire scellée</p></div>
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
