// =================================================================================
// PAGE : DÉTAILS DU JEU (GRIMOIRE)
// Rôle : Affichage des statistiques et chronologie des parties avec édition.
// =================================================================================

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../services/supabase';

export default function GameStats() {
   const { id } = useParams();
   const [game, setGame] = useState(null);
   const [plays, setPlays] = useState([]);
   const [loading, setLoading] = useState(true);

   // --- ÉTATS POUR L'ÉDITION ---
   const [editingPlay, setEditingPlay] = useState(null);
   const [isEditModalOpen, setIsEditModalOpen] = useState(false);

   // Charger les données du jeu
   useEffect(() => {
      const fetchData = async () => {
         try {
            const { data: gameData } = await supabase.from('games').select('*').eq('id', id).single();
            const { data: playsData } = await supabase.from('plays').select('*').eq('game_id', id).order('played_on', { ascending: false });
            setGame(gameData);
            setPlays(playsData || []);
         } catch (error) {
            console.error("Erreur de récupération :", error);
         } finally {
            setLoading(false);
         }
      };
      if (id) fetchData();
   }, [id]);

   // --- FONCTION DE MISE À JOUR ---
   const handleUpdatePlay = async (e) => {
      e.preventDefault();
      try {
         const { error } = await supabase
            .from('plays')
            .update({
               played_on: editingPlay.played_on,
               is_victory: editingPlay.is_victory,
               notes: editingPlay.notes
            })
            .eq('id', editingPlay.id);

         if (error) throw error;

         // Mise à jour locale pour éviter le rafraîchissement forcé
         setPlays(plays.map(p => p.id === editingPlay.id ? editingPlay : p));
         setIsEditModalOpen(false);
         setEditingPlay(null);
      } catch (error) {
         console.error("Erreur mise à jour :", error.message);
      }
   };

   // --- CALCULS ET HELPERS ---
   const totalPlays = plays.length;
   const wins = plays.filter(p => p.is_victory).length;
   const winRate = totalPlays > 0 ? Math.round((wins / totalPlays) * 100) : 0;
   const complexity = game?.complexity ? parseFloat(game.complexity) : 0;

   const getComplexityColor = (c) => {
      if (c <= 2.0) return "bg-emerald-600";
      if (c <= 3.5) return "bg-amber-500";
      return "bg-rose-700";
   };

   const getCaption = (isVictory, playId) => {
      const v = ["Victoire éclatante", "Stratégie pure", "Triomphe absolu"];
      const d = ["Leçon d'humilité", "Le sort s'acharne", "L'expérience rentre"];
      const list = isVictory ? v : d;
      return list[(playId || "").charCodeAt(0) % list.length];
   };

   if (loading) return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
         <div className="animate-spin rounded-full h-10 w-10 border-4 border-stone-200 border-t-amber-600"></div>
      </div>
   );

   const monolithStyle = "bg-white rounded-[1.5rem] border transition-all duration-300 shadow-[8px_8px_0_0_rgba(28,25,23,0.05),0_15px_30px_-10px_rgba(0,0,0,0.1)]";

   return (
      <div className="min-h-screen bg-[#FDFBF7] font-sans text-stone-800 relative selection:bg-amber-100">

         {/* --- 1. HEADER HERO --- */}
         <div className="relative h-[350px] md:h-[500px] bg-stone-900 overflow-hidden shadow-2xl z-10 border-b-[6px] border-stone-800">
            <img src={game?.image_url || game?.thumbnail_url} className="absolute inset-0 w-full h-full object-cover opacity-60 saturate-[0.8]" alt="" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-transparent to-transparent"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10 text-center">
               <h1 className="font-serif font-black text-4xl md:text-8xl lg:text-9xl leading-tight mb-4 text-white drop-shadow-xl">{game?.name}</h1>
               <p className="text-white font-bold tracking-[0.4em] uppercase text-[10px] md:text-xs opacity-90">Chroniques & Statistiques</p>
            </div>
         </div>

         {/* --- 2. CONTENU --- */}
         <div className="w-full max-w-7xl mx-auto px-4 py-12 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 relative z-20">

            {/* --- WIDGETS --- */}
            <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-28 h-fit">
               <div className={`${monolithStyle} border-stone-100 p-8 flex flex-col items-center text-center`}>
                  <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-6">Taux de Succès</h4>
                  <div className="relative w-32 h-32 md:w-40 md:h-40 mb-6">
                     <svg className="w-full h-full transform -rotate-90">
                        <circle cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-stone-100" />
                        <circle cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="1000" strokeDashoffset={1000 - (1000 * winRate) / 100} strokeLinecap="round" className="text-amber-500 transition-all duration-1000" />
                     </svg>
                     <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl md:text-4xl font-serif font-black text-stone-900 tracking-tight">{winRate}%</span>
                     </div>
                  </div>
                  <div className="flex gap-8 w-full justify-center text-center">
                     <div><span className="block text-xl font-serif font-bold text-stone-800">{wins}</span><span className="text-[9px] font-black uppercase text-stone-400">Victoires</span></div>
                     <div className="w-px bg-stone-100"></div>
                     <div><span className="block text-xl font-serif font-bold text-stone-800">{totalPlays - wins}</span><span className="text-[9px] font-black uppercase text-stone-400">Défaites</span></div>
                  </div>
               </div>

               <div className={`${monolithStyle} border-stone-100 p-8`}>
                  <div className="mb-6">
                     <div className="flex justify-between items-center mb-3">
                        <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Poids BGG</h4>
                        <span className="text-lg font-serif font-bold text-stone-800">{complexity.toFixed(2)}</span>
                     </div>
                     <div className="flex gap-1 h-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                           <div key={i} className={`flex-1 rounded-sm ${i <= Math.ceil(complexity) ? getComplexityColor(complexity) : 'bg-stone-100'}`}></div>
                        ))}
                     </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 border-t border-stone-100 pt-6 text-center">
                     <div><span className="block text-lg font-serif font-bold text-stone-800">{game?.min_players}-{game?.max_players}</span><span className="text-[8px] text-stone-400 uppercase font-black tracking-widest">Joueurs</span></div>
                     <div><span className="block text-lg font-serif font-bold text-stone-800">{game?.playing_time}</span><span className="text-[8px] text-stone-400 uppercase font-black tracking-widest">Mins</span></div>
                     <div><span className="block text-lg font-serif font-bold text-stone-800">{game?.min_age}+</span><span className="text-[8px] text-stone-400 uppercase font-black tracking-widest">Âge</span></div>
                  </div>
               </div>
            </div>

            {/* --- TIMELINE --- */}
            <div className="lg:col-span-8 relative">
               <div className="mb-12 md:pl-8 border-l-4 border-amber-500 pl-6">
                  <h3 className="text-2xl md:text-3xl font-serif font-black text-stone-900 mb-1">Chroniques du Jeu</h3>
                  <p className="text-stone-500 italic text-sm md:text-base">"Chaque partie forge la légende."</p>
               </div>

               <div className="absolute left-[20px] md:left-[39px] top-24 bottom-0 w-0.5 bg-stone-100 hidden sm:block"></div>

               <div className="space-y-16">
                  {plays.map((play) => {
                     const isVictory = play.is_victory;
                     const borderColor = isVictory ? 'border-amber-400/50' : 'border-stone-200';

                     return (
                        <div key={play.id} className="relative group/play">

                           {/* --- BLOC ICONE + BOUTON (ALIGNÉ SOUS L'ICONE) --- */}
                           <div className="absolute left-0 sm:left-10 top-0 sm:top-8 sm:-translate-x-1/2 z-30 flex flex-col items-center gap-2">
                              {/* Icône principale */}
                              <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full border-[4px] sm:border-[6px] border-[#FDFBF7] flex items-center justify-center shadow-md ${isVictory ? 'bg-amber-500 text-white shadow-amber-200' : 'bg-stone-200 text-stone-400'}`}>
                                 <span className="text-lg sm:text-2xl">{isVictory ? '🏆' : '💀'}</span>
                              </div>

                              {/* Bouton Édition - Aligné en dessous sans overlap */}
                              <button
                                 onClick={() => { setEditingPlay({ ...play }); setIsEditModalOpen(true); }}
                                 className="p-2 bg-white rounded-full text-stone-400 border border-stone-200 shadow-sm hover:text-amber-600 lg:opacity-0 lg:group-hover/play:opacity-100 transition-all active:scale-90"
                              >
                                 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                 </svg>
                              </button>
                           </div>

                           <div className="pl-14 sm:ml-24 flex flex-col xl:flex-row gap-6 items-start relative">
                              <div className={`${monolithStyle} ${borderColor} border-2 flex-1 p-6 md:p-8 relative overflow-hidden w-full`}>
                                 <h3 className="font-serif font-bold text-xl md:text-2xl text-stone-900 mb-1 capitalize leading-snug">
                                    {new Date(play.played_on).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                 </h3>
                                 <div className="mt-6 relative pl-6">
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-full ${isVictory ? 'bg-amber-300' : 'bg-stone-200'}`}></div>
                                    <p className="text-stone-600 font-serif italic text-base md:text-lg leading-relaxed">
                                       « {play.notes || "Le silence est d'or..."} »
                                    </p>
                                 </div>
                              </div>

                              {play.image_urls?.length > 0 && (
                                 <div className="w-full xl:w-64 shrink-0 mt-4 xl:mt-0 flex justify-center xl:block">
                                    <div className="bg-white p-3 pb-8 shadow-xl rotate-2 border border-stone-200 max-w-[200px] mx-auto relative">
                                       <div className="aspect-square bg-stone-100 overflow-hidden mb-2 shadow-inner">
                                          <img src={play.image_urls[0]} alt="Souvenir" className="w-full h-full object-cover" />
                                       </div>
                                       <div className="text-center pt-2">
                                          <span className="font-handwriting text-[10px] text-stone-400 italic">{getCaption(isVictory, play.id)}</span>
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

         {/* --- MODALE D'ÉDITION --- */}
         {isEditModalOpen && editingPlay && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
               <div className="absolute inset-0 bg-stone-900/70 backdrop-blur-md" onClick={() => setIsEditModalOpen(false)}></div>
               <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 md:p-10 relative z-10 shadow-2xl border border-stone-100 animate-in zoom-in-95 duration-200">
                  <h2 className="text-2xl font-serif font-black text-stone-900 mb-8 flex items-center gap-3 italic">
                     <span className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white not-italic text-sm">🖋️</span>
                     Rectifier le Récit
                  </h2>

                  <form onSubmit={handleUpdatePlay} className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">Date</label>
                           <input type="date" value={editingPlay.played_on} onChange={e => setEditingPlay({ ...editingPlay, played_on: e.target.value })} className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-amber-500/20 outline-none" required />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">Issue</label>
                           <button type="button" onClick={() => setEditingPlay({ ...editingPlay, is_victory: !editingPlay.is_victory })} className={`w-full py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${editingPlay.is_victory ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' : 'bg-stone-100 text-stone-400'}`}>
                              {editingPlay.is_victory ? '🏆 Victoire' : '💀 Défaite'}
                           </button>
                        </div>
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">Notes de l'épopée</label>
                        <textarea value={editingPlay.notes || ''} onChange={e => setEditingPlay({ ...editingPlay, notes: e.target.value })} rows="4" className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-amber-500/20 outline-none resize-none font-serif italic text-stone-600" />
                     </div>
                     <div className="flex gap-4 pt-4">
                        <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Annuler</button>
                        <button type="submit" className="flex-[2] bg-stone-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl active:scale-95">Sceller l'archive</button>
                     </div>
                  </form>
               </div>
            </div>
         )}
      </div>
   );
}
