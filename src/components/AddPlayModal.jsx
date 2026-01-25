import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';

export default function AddPlayModal({ game, isOpen, onClose, onPlayAdded, targetProgress, playToEdit = null }) {
   const { user } = useAuth();
   const [loading, setLoading] = useState(false);

   // --- ÉTATS DU FORMULAIRE ---
   const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
   const [durationHours, setDurationHours] = useState(0);
   const [durationMinutes, setDurationMinutes] = useState(game?.playing_time || 30);
   const [isVictory, setIsVictory] = useState(false);
   const [notes, setNotes] = useState('');

   // Gestion Images
   const [selectedFiles, setSelectedFiles] = useState([]);
   const [previewUrls, setPreviewUrls] = useState([]);

   // --- INITIALISATION (Reset ou Pré-remplissage) ---
   useEffect(() => {
      if (isOpen) {
         if (playToEdit) {
            // MODE ÉDITION : On remplit avec les données existantes
            setDate(playToEdit.played_on.split('T')[0]);
            setDurationHours(Math.floor(playToEdit.duration_minutes / 60));
            setDurationMinutes(playToEdit.duration_minutes % 60);
            setIsVictory(playToEdit.is_victory);
            setNotes(playToEdit.notes || '');

            // On affiche les images existantes
            setPreviewUrls(playToEdit.image_urls || []);
            setSelectedFiles([]);
         } else {
            // MODE CRÉATION : Reset standard
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

   // Gestion Minutes (Max 59)
   const handleMinutesChange = (e) => {
      let val = parseInt(e.target.value);
      if (isNaN(val)) val = 0;
      if (val > 59) val = 59;
      if (val < 0) val = 0;
      setDurationMinutes(val);
   };

   // Gestion Sélection Fichiers
   const handleFileSelect = (e) => {
      const files = Array.from(e.target.files);
      const currentCount = previewUrls.length; // Images existantes + déjà sélectionnées

      if (files.length + currentCount > 3) {
         alert("Maximum 3 photos autorisées au total !");
         return;
      }

      const newFiles = [...selectedFiles, ...files];
      setSelectedFiles(newFiles);

      // Générer les prévisualisations locales
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviews]);
   };

   // Supprimer une image (Visuellement seulement pour l'instant)
   const removeImage = (index) => {
      // Note : Une gestion parfaite suppression cloud/local demanderait plus de logique.
      // Ici on gère surtout le retrait des nouvelles images avant upload.
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

         // 1. Upload des NOUVELLES images
         const uploadPromises = selectedFiles.map(async (file) => {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${game.bgg_id}/${Date.now()}-${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
               .from('game-memories')
               .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
               .from('game-memories')
               .getPublicUrl(fileName);

            return publicUrl;
         });

         const newUploadedUrls = await Promise.all(uploadPromises);

         // Fusionner avec les anciennes images si mode édition (on garde celles qui étaient déjà là)
         // Note: previewUrls contient tout (vieux + nouveaux blob), mais on veut les URLs persistantes
         // Simplification : On prend les URLs existantes de playToEdit et on ajoute les nouvelles
         const finalImageUrls = playToEdit
            ? [...(playToEdit.image_urls || []), ...newUploadedUrls]
            : newUploadedUrls;

         if (playToEdit) {
            // --- UPDATE ---
            const { error } = await supabase
               .from('plays')
               .update({
                  played_on: date,
                  duration_minutes: totalMinutes,
                  is_victory: isVictory,
                  notes: notes,
                  image_urls: finalImageUrls
               })
               .eq('id', playToEdit.id);

            if (error) throw error;
         } else {
            // --- INSERT ---
            const { error } = await supabase
               .from('plays')
               .insert({
                  user_id: user.id,
                  game_id: game.id,
                  played_on: date,
                  duration_minutes: totalMinutes,
                  is_victory: isVictory,
                  notes: notes,
                  image_urls: finalImageUrls
               });

            if (error) throw error;
         }

         // --- MESSAGES ÉPIQUES ---
         const successMessages = [
            "Haut fait enregistré ! Les bardes chanteront vos louanges. 🎻",
            "Et c'est noté ! Une légende de plus dans les archives. 📜",
            "Victoire ou Défaite, l'important c'est l'XP ! (Sauvegardé). ✨",
            "Les dés sont jetés, et l'histoire est écrite. 🎲",
            "Votre épopée continue... Partie gravée ! ⚔️"
         ];
         const randomMsg = successMessages[Math.floor(Math.random() * successMessages.length)];
         alert(randomMsg);

         if (onPlayAdded) await onPlayAdded(game.bgg_id, targetProgress);
         onClose();

      } catch (error) {
         console.error("Erreur:", error);
         alert("Échec critique lors de la sauvegarde... (Erreur technique)");
      } finally {
         setLoading(false);
      }
   };

   if (!isOpen || !game) return null;

   return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
         <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose}></div>

         <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

            {/* Header Ambre */}
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

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">

               {/* 1. Date & Temps (Responsive : Stack sur mobile, Ligne sur Desktop) */}
               <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                     <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5 block">Date</label>
                     <input
                        type="date" required value={date} onChange={e => setDate(e.target.value)}
                        className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 outline-none font-bold text-stone-700 transition-all"
                     />
                  </div>

                  <div className="flex-1">
                     <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5 block">Durée</label>
                     <div className="flex items-center gap-2">
                        <div className="relative flex-1 flex items-center">
                           <input
                              type="number" min="0" value={durationHours} onChange={e => setDurationHours(e.target.value)}
                              className="w-full p-3 pr-8 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 outline-none font-bold text-stone-700 text-center"
                           />
                           <span className="absolute right-3 text-xs text-stone-400 font-bold pointer-events-none">H</span>
                        </div>
                        <span className="text-stone-300 font-bold">:</span>
                        <div className="relative flex-1 flex items-center">
                           <input
                              type="number" min="0" max="59" value={durationMinutes} onChange={handleMinutesChange}
                              className="w-full p-3 pr-10 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 outline-none font-bold text-stone-700 text-center"
                           />
                           <span className="absolute right-3 text-xs text-stone-400 font-bold pointer-events-none">Min</span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* 2. Résultat */}
               <div>
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5 block">Résultat</label>
                  <div className="flex bg-stone-100 p-1 rounded-xl">
                     <button
                        type="button"
                        onClick={() => setIsVictory(false)}
                        className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 
                           ${!isVictory
                              ? 'bg-stone-700 text-white shadow-md ring-1 ring-stone-800'
                              : 'text-stone-400 hover:text-stone-600 hover:bg-stone-200/50'
                           }`}
                     >
                        💀 Défaite
                     </button>
                     <button
                        type="button"
                        onClick={() => setIsVictory(true)}
                        className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 
                           ${isVictory
                              ? 'bg-amber-500 text-white shadow-md ring-1 ring-amber-600'
                              : 'text-stone-400 hover:text-amber-600 hover:bg-amber-50'
                           }`}
                     >
                        Victoire 🏆
                     </button>
                  </div>
               </div>

               {/* 3. Photos */}
               <div>
                  <div className="flex justify-between items-end mb-2">
                     <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">Souvenirs (Max 3)</label>
                     <span className="text-[10px] font-bold text-amber-600">{previewUrls.length}/3</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                     {previewUrls.map((url, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group border border-stone-200 shadow-sm">
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

                     {previewUrls.length < 3 && (
                        <label className="aspect-square rounded-lg border-2 border-dashed border-stone-300 hover:border-amber-400 hover:bg-amber-50 transition-all flex flex-col items-center justify-center cursor-pointer text-stone-400 hover:text-amber-600">
                           <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                           <span className="text-[9px] font-bold uppercase">Ajouter</span>
                           <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />
                        </label>
                     )}
                  </div>
               </div>

               {/* 4. Notes */}
               <div>
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5 block">Anecdote du MJ</label>
                  <textarea
                     rows="3"
                     placeholder="Un moment épique ? Un score légendaire ?"
                     value={notes}
                     onChange={e => setNotes(e.target.value)}
                     className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 outline-none text-sm resize-none"
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
                              {playToEdit ? "Corriger les Archives" : "Graver dans le Marbre"}
                           </span>
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
