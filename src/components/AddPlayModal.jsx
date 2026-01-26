import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';

export default function AddPlayModal({ game, isOpen, onClose, onPlayAdded, targetProgress, playToEdit = null, showToast }) {
   const { user } = useAuth();
   const [loading, setLoading] = useState(false);

   // --- ÉTATS ---
   const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
   const [durationHours, setDurationHours] = useState(0);
   const [durationMinutes, setDurationMinutes] = useState(game?.playing_time || 30);
   const [isVictory, setIsVictory] = useState(false);
   const [notes, setNotes] = useState('');

   const [selectedFiles, setSelectedFiles] = useState([]);
   const [previewUrls, setPreviewUrls] = useState([]);

   // --- INITIALISATION ---
   useEffect(() => {
      if (isOpen) {
         if (playToEdit) {
            setDate(playToEdit.played_on.split('T')[0]);
            setDurationHours(Math.floor(playToEdit.duration_minutes / 60));
            setDurationMinutes(playToEdit.duration_minutes % 60);
            setIsVictory(playToEdit.is_victory);
            setNotes(playToEdit.notes || '');
            setPreviewUrls(playToEdit.image_urls || []);
            setSelectedFiles([]);
         } else {
            setDate(new Date().toISOString().split('T')[0]);
            setDurationHours(0);
            setDurationMinutes(game?.playing_time > 59 ? 59 : game?.playing_time || 30);
            setPreviewUrls([]);
            setSelectedFiles([]);
            setNotes('');
            setIsVictory(false);
         }
      }
   }, [isOpen, game, playToEdit]);

   const handleMinutesChange = (e) => {
      let val = parseInt(e.target.value);
      if (isNaN(val)) val = 0;
      if (val > 59) val = 59;
      if (val < 0) val = 0;
      setDurationMinutes(val);
   };

   // --- GESTION FICHIERS ---
   const handleFileSelect = (e) => {
      const files = Array.from(e.target.files);
      const currentCount = previewUrls.length;

      // Bloquer si > 3 fichiers
      if (files.length + currentCount > 3) {
         if (showToast) showToast("Maximum 3 photos autorisées.", "error");
         return;
      }

      // Vérification taille (5Mo)
      const MAX_SIZE = 5 * 1024 * 1024;
      const validFiles = [];

      for (const file of files) {
         if (file.size > MAX_SIZE) {
            if (showToast) showToast(`"${file.name}" est trop lourd (> 5Mo).`, "error");
            return;
         }
         validFiles.push(file);
      }

      const newFiles = [...selectedFiles, ...validFiles];
      setSelectedFiles(newFiles);
      const newPreviews = validFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviews]);
   };

   const removeImage = (index) => {
      const newFiles = selectedFiles.filter((_, i) => i !== index);
      const newPreviews = previewUrls.filter((_, i) => i !== index);
      setSelectedFiles(newFiles);
      setPreviewUrls(newPreviews);
   };

   // --- SOUMISSION ---
   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
         const totalMinutes = (parseInt(durationHours) * 60) + parseInt(durationMinutes);

         // Upload Images
         const uploadPromises = selectedFiles.map(async (file) => {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${game.bgg_id}/${Date.now()}-${Math.random()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage.from('game-memories').upload(fileName, file);
            if (uploadError) throw uploadError;
            const { data: { publicUrl } } = supabase.storage.from('game-memories').getPublicUrl(fileName);
            return publicUrl;
         });

         const newUploadedUrls = await Promise.all(uploadPromises);
         const finalImageUrls = playToEdit
            ? [...(playToEdit.image_urls || []), ...newUploadedUrls]
            : newUploadedUrls;

         const playData = {
            user_id: user.id,
            game_id: game.id,
            played_on: date,
            duration_minutes: totalMinutes,
            is_victory: isVictory,
            notes: notes,
            image_urls: finalImageUrls
         };

         if (playToEdit) {
            const { error } = await supabase.from('plays').update(playData).eq('id', playToEdit.id);
            if (error) throw error;
         } else {
            const { error } = await supabase.from('plays').insert(playData);
            if (error) throw error;
         }

         const successMessages = [
            "Haut fait enregistré ! 🎻",
            "C'est noté dans les archives. 📜",
            "Victoire ou Défaite, l'important c'est l'XP ! ✨",
            "Les dés sont jetés, l'histoire est écrite. 🎲"
         ];
         const randomMsg = successMessages[Math.floor(Math.random() * successMessages.length)];

         if (showToast) showToast(randomMsg, "success");
         if (onPlayAdded) await onPlayAdded(game.bgg_id, targetProgress);
         onClose();

      } catch (error) {
         console.error("Erreur:", error);
         if (showToast) showToast("Échec critique lors de la sauvegarde...", "error");
      } finally {
         setLoading(false);
      }
   };

   if (!isOpen || !game) return null;

   return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
         <style>{`
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
         `}</style>

         <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose}></div>

         <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-5 flex justify-between items-center shrink-0">
               <div>
                  <h3 className="font-serif font-bold text-xl text-white tracking-wide">
                     {playToEdit ? "Modifier le Récit" : "Nouvelle Aventure"}
                  </h3>
                  <p className="text-amber-100 text-xs font-medium uppercase tracking-wider mt-0.5">{game.name}</p>
               </div>
               <button onClick={onClose} className="text-amber-200 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6 overflow-y-auto no-scrollbar">

               {/* 1. Date & Temps */}
               <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                     <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5 block">Date</label>
                     <input
                        type="date" required value={date} onChange={e => setDate(e.target.value)}
                        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 outline-none font-bold text-stone-700 transition-all shadow-sm"
                     />
                  </div>
                  <div className="flex-1">
                     <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5 block">Durée</label>
                     <div className="flex items-center gap-2">
                        <div className="relative flex-1 flex items-center">
                           <input
                              type="number" min="0" value={durationHours} onChange={e => setDurationHours(e.target.value)}
                              className="w-full p-3 pr-8 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 outline-none font-bold text-stone-700 text-center shadow-sm"
                           />
                           <span className="absolute right-3 text-xs text-stone-400 font-bold pointer-events-none">H</span>
                        </div>
                        <span className="text-stone-300 font-bold">:</span>
                        <div className="relative flex-1 flex items-center">
                           <input
                              type="number" min="0" max="59" value={durationMinutes} onChange={handleMinutesChange}
                              className="w-full p-3 pr-10 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 outline-none font-bold text-stone-700 text-center shadow-sm"
                           />
                           <span className="absolute right-3 text-xs text-stone-400 font-bold pointer-events-none">Min</span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* 2. Résultat (Victoire / Défaite) */}
               <div>
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5 block">Résultat</label>
                  <div className="flex bg-stone-100 p-1 rounded-xl shadow-inner">
                     <button
                        type="button"
                        onClick={() => setIsVictory(false)}
                        className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 
                           ${!isVictory
                              ? 'bg-stone-700 text-white shadow-md ring-1 ring-stone-800 scale-105 z-10'
                              : 'text-stone-400 hover:text-stone-600'
                           }`}
                     >
                        💀 Défaite
                     </button>
                     <button
                        type="button"
                        onClick={() => setIsVictory(true)}
                        className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 
                           ${isVictory
                              ? 'bg-amber-500 text-white shadow-md ring-1 ring-amber-600 scale-105 z-10'
                              : 'text-stone-400 hover:text-amber-600'
                           }`}
                     >
                        Victoire 🏆
                     </button>
                  </div>
               </div>

               {/* 3. Photos */}
               <div>
                  <div className="flex justify-between items-end mb-2">
                     <div>
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">
                           Photos Souvenirs <span className="text-stone-300 font-normal ml-1 normal-case tracking-normal">JPG, PNG • Max 5Mo</span>
                        </label>
                     </div>
                     <span className="text-[10px] font-bold text-amber-600">{previewUrls.length}/3</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">

                     {/* A. Photos Ajoutées */}
                     {previewUrls.map((url, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group border border-stone-200 shadow-sm bg-stone-100">
                           <img src={url} alt="Souvenir" className="w-full h-full object-cover" />
                           <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                           >
                              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                           </button>
                        </div>
                     ))}

                     {/* B. Bouton Ajouter */}
                     {previewUrls.length < 3 && (
                        <label className="aspect-square rounded-lg border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/30 hover:bg-amber-50 transition-all flex flex-col items-center justify-center cursor-pointer text-amber-600/80 hover:text-amber-700 gap-1 group">
                           <div className="bg-white border border-amber-200 group-hover:border-amber-400 p-2 rounded-full transition-colors shadow-sm">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                           </div>
                           <span className="text-[9px] font-bold uppercase tracking-wide">Ajouter</span>

                           <input type="file" accept=".jpg,.jpeg,.png,.webp" multiple className="hidden" onChange={handleFileSelect} />
                        </label>
                     )}

                     {/* C. GHOSTS */}
                     {Array.from({ length: 3 - previewUrls.length - (previewUrls.length < 3 ? 1 : 0) }).map((_, i) => (
                        <div key={`ghost-${i}`} className="aspect-square rounded-lg border-2 border-dashed border-stone-200 bg-stone-50/50 flex items-center justify-center">
                           <svg className="w-8 h-8 text-stone-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                     ))}
                  </div>
               </div>

               {/* 4. Notes */}
               <div>
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5 block">
                     Récit de la partie
                  </label>
                  <textarea
                     rows="3"
                     placeholder="Un moment épique ? Un score légendaire ?"
                     value={notes}
                     onChange={e => setNotes(e.target.value)}
                     className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 outline-none text-sm resize-none shadow-sm"
                  />
               </div>

               {/* Footer Action */}
               <div className="pt-2 border-t border-stone-100 mt-2">
                  <button
                     type="submit"
                     disabled={loading}
                     className="w-full bg-stone-900 hover:bg-amber-700 text-amber-50 font-serif font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 flex justify-center items-center gap-3 group"
                  >
                     {loading ? (
                        <div className="animate-spin h-5 w-5 border-2 border-amber-500 border-t-transparent rounded-full"></div>
                     ) : (
                        <>
                           <span className="tracking-wider text-lg">
                              {playToEdit ? "Mettre à jour le Registre" : "Inscrire au Registre"}
                           </span>
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                           </svg>
                        </>
                     )}
                  </button>
               </div>

            </form>
         </div>
      </div>
   );
}
