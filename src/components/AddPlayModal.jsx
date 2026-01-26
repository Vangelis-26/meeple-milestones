import { useState, useEffect, useRef } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';

export default function AddPlayModal({ isOpen, game, targetProgress, playToEdit, onClose, onPlayAdded, showToast }) {
   const { user } = useAuth();
   const fileInputRef = useRef(null);
   
   // --- ÉTATS ---
   const [loading, setLoading] = useState(false);
   
   // Données Formulaire
   const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
   const [hours, setHours] = useState(0);
   const [minutes, setMinutes] = useState(0);
   const [isVictory, setIsVictory] = useState(null); 
   const [notes, setNotes] = useState('');

   // Gestion Photos
   const [selectedFiles, setSelectedFiles] = useState([]); 
   const [previewUrls, setPreviewUrls] = useState([]);     

   // --- INITIALISATION ---
   useEffect(() => {
      if (isOpen) {
         if (playToEdit) {
            setDate(playToEdit.played_on.split('T')[0]);
            setHours(Math.floor(playToEdit.duration_minutes / 60));
            setMinutes(playToEdit.duration_minutes % 60);
            setIsVictory(playToEdit.is_victory);
            setNotes(playToEdit.notes || '');
            setPreviewUrls(playToEdit.image_urls || []);
            setSelectedFiles([]); 
         } else {
            setDate(new Date().toISOString().split('T')[0]);
            const defaultTime = game?.playing_time || 0;
            setHours(Math.floor(defaultTime / 60));
            setMinutes(defaultTime % 60);
            setIsVictory(null); 
            setNotes('');
            setPreviewUrls([]);
            setSelectedFiles([]);
         }
      }
   }, [isOpen, game, playToEdit]);

   // --- LOGIQUE METIER ---
   const handleHoursChange = (e) => {
      const val = parseInt(e.target.value);
      setHours(isNaN(val) || val < 0 ? 0 : val);
   };

   const handleMinutesChange = (e) => {
      const val = parseInt(e.target.value);
      if (isNaN(val)) setMinutes('');
      else if (val < 0) setMinutes(59);
      else if (val > 59) setMinutes(0);
      else setMinutes(val);
   };

   const handleFileSelect = (e) => {
      const files = Array.from(e.target.files);
      const totalSlotsUsed = previewUrls.length + files.length;

      if (totalSlotsUsed > 3) {
         if (showToast) showToast("Maximum 3 photos.", "error");
         return;
      }

      const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024);
      setSelectedFiles(prev => [...prev, ...validFiles]);
      const newPreviews = validFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviews]);
   };

   const removeImage = (indexToRemove) => {
      setPreviewUrls(prev => prev.filter((_, i) => i !== indexToRemove));
      if (indexToRemove >= (previewUrls.length - selectedFiles.length)) {
          setSelectedFiles(prev => {
              const newFiles = [...prev];
              newFiles.pop(); 
              return newFiles;
          });
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (isVictory === null) {
         if (showToast) showToast("Sélectionnez Victoire ou Défaite.", "error");
         return;
      }

      setLoading(true);

      try {
         const totalMinutes = (parseInt(hours || 0) * 60) + parseInt(minutes || 0);

         // Upload
         const uploadPromises = selectedFiles.map(async (file) => {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${game.bgg_id}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
            const { error: uploadError } = await supabase.storage.from('game-memories').upload(fileName, file);
            if (uploadError) throw uploadError;
            const { data } = supabase.storage.from('game-memories').getPublicUrl(fileName);
            return data.publicUrl;
         });

         const newUploadedUrls = await Promise.all(uploadPromises);
         const existingUrls = previewUrls.filter(url => url.startsWith('http'));
         const finalImageUrls = [...existingUrls, ...newUploadedUrls];

         const playData = {
            user_id: user.id,
            game_id: game.id,
            played_on: date,
            duration_minutes: totalMinutes,
            is_victory: isVictory,
            notes: notes.trim() || null,
            image_urls: finalImageUrls
         };

         if (playToEdit) {
            const { error } = await supabase.from('plays').update(playData).eq('id', playToEdit.id);
            if (error) throw error;
         } else {
            const { error } = await supabase.from('plays').insert(playData);
            if (error) throw error;
         }

         if (showToast) showToast(playToEdit ? "Récit mis à jour." : "Récit enregistré !", "success");
         if (onPlayAdded) onPlayAdded();
         onClose();

      } catch (error) {
         console.error("Erreur:", error);
         if (showToast) showToast("Erreur de sauvegarde.", "error");
      } finally {
         setLoading(false);
      }
   };

   if (!isOpen || !game) return null;

   return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4">
         <style>{`
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            input[type=number]::-webkit-inner-spin-button, 
            input[type=number]::-webkit-outer-spin-button { opacity: 1; }
         `}</style>

         {/* Backdrop */}
         <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

         {/* MODALE : Marges internes ajustées pour le mobile */}
         <div className="relative bg-[#FDFBF7] w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col shadow-2xl rounded-2xl ring-1 ring-white/10 max-h-[95vh]">

            {/* HEADER */}
            <div className="relative h-28 sm:h-32 shrink-0 bg-stone-900 overflow-hidden z-10 border-b border-stone-800">
               <img 
                  src={game.image_url || game.thumbnail_url} 
                  alt="" 
                  className="absolute inset-0 w-full h-full object-cover object-top opacity-40 blur-[1px]"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/60 to-transparent"></div>

               <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end">
                  <div className="flex items-center gap-3 mb-1">
                     <span className="font-serif text-amber-500 font-bold italic text-base tracking-wide drop-shadow-md truncate">
                        {game.name}
                     </span>
                     {targetProgress && (
                        <span className="text-[10px] text-stone-300 border border-stone-500/50 bg-black/20 px-2 py-0.5 rounded backdrop-blur-md uppercase tracking-wider font-medium shrink-0">
                           Partie {targetProgress} / 10
                        </span>
                     )}
                  </div>
                  <h3 className="font-serif font-bold text-2xl text-white tracking-wide drop-shadow-lg leading-none">
                     {playToEdit ? 'Modifier l\'Entrée' : 'Nouvelle Entrée'}
                  </h3>
               </div>

               <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>

            {/* FORMULAIRE : Padding réduit sur mobile (p-4) vs desktop (p-6) */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 pt-4 sm:pt-5 space-y-4 sm:space-y-5 relative z-10 overflow-y-auto no-scrollbar">

               {/* 1. RÉSULTAT */}
               <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <button
                     type="button"
                     onClick={() => setIsVictory(true)}
                     className={`relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 group shadow-sm
                        ${isVictory === true
                           ? 'bg-white border-amber-400 ring-2 ring-amber-100' 
                           : 'bg-white border-stone-200 hover:border-amber-300 hover:bg-amber-50/30'}`}
                  >
                     <span className={`text-2xl sm:text-3xl mb-2 drop-shadow-sm transition-transform duration-300 ${isVictory === true ? 'scale-110' : 'grayscale group-hover:grayscale-0'}`}>🏆</span>
                     <span className={`font-serif font-bold tracking-widest text-[10px] sm:text-xs uppercase ${isVictory === true ? 'text-amber-600' : 'text-stone-400 group-hover:text-amber-600'}`}>Victoire</span>
                  </button>

                  <button
                     type="button"
                     onClick={() => setIsVictory(false)}
                     className={`relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 group shadow-sm
                        ${isVictory === false
                           ? 'bg-stone-800 border-stone-900 ring-2 ring-stone-200' 
                           : 'bg-white border-stone-200 hover:border-stone-400 hover:bg-stone-50'}`}
                  >
                     <span className={`text-2xl sm:text-3xl mb-2 drop-shadow-sm transition-transform duration-300 ${isVictory === false ? 'scale-110' : 'grayscale group-hover:grayscale-0'}`}>💀</span>
                     <span className={`font-serif font-bold tracking-widest text-[10px] sm:text-xs uppercase ${isVictory === false ? 'text-white' : 'text-stone-400 group-hover:text-stone-600'}`}>Défaite</span>
                     {isVictory === false && (
                        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/20 rounded-full p-0.5">
                           <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        </div>
                     )}
                  </button>
               </div>

               {/* 2. DATE & DURÉE */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  <div className="space-y-1">
                     <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-1">Date</label>
                     <input 
                        type="date" required value={date} 
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-white border border-stone-200 text-stone-800 font-bold rounded-lg px-3 py-3 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all cursor-pointer shadow-sm text-sm"
                     />
                  </div>

                  <div className="space-y-1">
                     <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-1">Durée</label>
                     <div className="flex gap-2 sm:gap-3">
                        <div className="relative flex-1">
                           {/* Padding droit réduit pour éviter l'écrasement sur mobile */}
                           <input 
                              type="number" min="0" value={hours} 
                              onChange={handleHoursChange}
                              className="w-full bg-white border border-stone-200 text-stone-800 font-bold rounded-lg pl-3 pr-8 py-3 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all shadow-sm text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                           />
                           <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-stone-400 pointer-events-none bg-white pl-1">H</span>
                        </div>
                        <div className="relative flex-1">
                           <input 
                              type="number" min="0" max="59" value={minutes} 
                              onChange={handleMinutesChange}
                              className="w-full bg-white border border-stone-200 text-stone-800 font-bold rounded-lg pl-3 pr-10 py-3 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all shadow-sm text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                           />
                           <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-stone-400 pointer-events-none bg-white pl-1">MIN</span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* 3. PREUVE EN IMAGE */}
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-1">
                     Preuve en image(s) <span className="font-normal text-stone-300 ml-1 tracking-normal normal-case">(Max 3)</span>
                  </label>

                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                     {Array.from({ length: 3 }).map((_, index) => {
                        const hasImage = index < previewUrls.length;
                        const isNextAvailable = index === previewUrls.length;
                        
                        if (hasImage) {
                           return (
                              <div key={index} className="aspect-[4/3] rounded-lg border border-stone-200 bg-white p-1 relative group shadow-sm">
                                 <img src={previewUrls[index]} alt="Souvenir" className="w-full h-full object-cover rounded" />
                                 <button 
                                    type="button" onClick={() => removeImage(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md z-10"
                                 >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                 </button>
                              </div>
                           );
                        }

                        if (isNextAvailable) {
                           return (
                              <label key={index} className="aspect-[4/3] rounded-lg border-2 border-dashed border-stone-300 bg-stone-50 cursor-pointer hover:border-amber-400 hover:bg-amber-50/30 transition-all flex flex-col items-center justify-center group">
                                 <div className="text-stone-400 mb-1 group-hover:text-amber-500 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                       <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                       <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                 </div>
                                 <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest group-hover:text-amber-600">Ajouter</span>
                                 <input type="file" accept="image/*" multiple ref={fileInputRef} className="hidden" onChange={handleFileSelect} />
                              </label>
                           );
                        }

                        return (
                           <div key={index} className="aspect-[4/3] rounded-lg border-2 border-dashed border-stone-100 bg-stone-50/20 flex items-center justify-center opacity-60">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-stone-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                           </div>
                        );
                     })}
                  </div>
               </div>

               {/* 4. NOTES */}
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-1">Journal de bord</label>
                  <textarea
                     rows="2"
                     value={notes}
                     onChange={(e) => setNotes(e.target.value)}
                     placeholder="Faits marquants..."
                     className="w-full bg-white border border-stone-200 text-stone-700 text-sm rounded-lg px-3 py-3 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all resize-none leading-relaxed shadow-sm placeholder:text-stone-300"
                  ></textarea>
               </div>

               {/* FOOTER ACTIONS */}
               <div className="pt-2 flex gap-3 sm:gap-4">
                  <button
                     type="button"
                     onClick={onClose}
                     className="flex-1 px-4 sm:px-6 py-3 bg-white border-2 border-stone-100 text-stone-500 font-bold rounded-xl hover:bg-stone-50 hover:border-stone-200 hover:text-stone-700 transition-all text-xs uppercase tracking-widest"
                  >
                     Annuler
                  </button>
                  <button
                     type="submit"
                     disabled={loading || isVictory === null}
                     className={`
                        flex-[2] px-4 sm:px-6 py-3 bg-stone-900 text-amber-50 font-bold rounded-xl hover:bg-black shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2 group
                        ${isVictory === null && 'opacity-50 cursor-not-allowed'}
                     `}
                  >
                     {loading ? (
                        <>
                           <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                           <span>Sauvegarde...</span>
                        </>
                     ) : (
                        <>
                           <span>Enregistrer</span>
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </>
                     )}
                  </button>
               </div>

            </form>
         </div>
      </div>
   );
}