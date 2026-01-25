import { useEffect, useState } from 'react';

// On reçoit deletePlay et getHistory en props depuis Dashboard
export default function GameHistoryModal({ game, isOpen, onClose, onEditPlay, deletePlay, getHistory }) {
   const [history, setHistory] = useState([]);
   const [loading, setLoading] = useState(true);
   const [confirmDeleteId, setConfirmDeleteId] = useState(null); // ID de la partie qu'on veut supprimer (pour afficher le confirm)

   useEffect(() => {
      if (isOpen && game) {
         loadData();
      }
   }, [isOpen, game]);

   const loadData = async () => {
      setLoading(true);
      // On utilise la fonction passée en prop (liée au Dashboard)
      const data = await getHistory(game.id);
      setHistory(data);
      setLoading(false);
   };

   // Déclenche la vue de confirmation
   const requestDelete = (playId) => {
      setConfirmDeleteId(playId);
   };

   // Annule la confirmation
   const cancelDelete = () => {
      setConfirmDeleteId(null);
   };

   // Confirme et supprime pour de bon
   const confirmDelete = async () => {
      if (confirmDeleteId) {
         setLoading(true); // Petit loading pour l'effet
         await deletePlay(confirmDeleteId, game.id);
         setConfirmDeleteId(null);
         await loadData(); // On recharge la liste (et le Dashboard se mettra à jour automatiquement)
      }
   };

   if (!isOpen || !game) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
         <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose}></div>

         <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">

            {/* Header */}
            <div className="bg-stone-100 border-b border-stone-200 px-6 py-4 flex justify-between items-center">
               <div>
                  <h3 className="font-serif font-bold text-lg text-stone-800">Historique des parties</h3>
                  <p className="text-xs text-stone-500 font-medium uppercase tracking-wider">{game.name}</p>
               </div>
               <button onClick={onClose} className="text-stone-400 hover:text-stone-800 transition-colors p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>

            {/* Liste */}
            <div className="overflow-y-auto p-4 flex-1 custom-scrollbar bg-stone-50/50">
               {loading ? (
                  <div className="flex justify-center py-8"><div className="animate-spin h-6 w-6 border-2 border-amber-500 border-t-transparent rounded-full"></div></div>
               ) : history.length === 0 ? (
                  <div className="text-center py-10 text-stone-400 italic">Aucune partie enregistrée.</div>
               ) : (
                  <div className="space-y-3">
                     {history.map((play) => (
                        <div key={play.id} className="relative">

                           {/* VUE DE CONFIRMATION DE SUPPRESSION (Si c'est l'ID sélectionné) */}
                           {confirmDeleteId === play.id ? (
                              <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm animate-in fade-in duration-200 flex flex-col gap-3">
                                 <div className="flex items-center gap-3 text-red-800">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    <span className="font-bold text-sm">Supprimer cette partie ?</span>
                                 </div>
                                 <div className="text-xs text-red-600 pl-9">
                                    Cette action retirera le meeple associé et est irréversible.
                                 </div>
                                 <div className="flex gap-2 pl-9 mt-1">
                                    <button
                                       onClick={cancelDelete}
                                       className="px-3 py-1.5 bg-white border border-red-200 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                                    >
                                       Annuler
                                    </button>
                                    <button
                                       onClick={confirmDelete}
                                       className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 shadow-sm transition-colors"
                                    >
                                       Confirmer la suppression
                                    </button>
                                 </div>
                              </div>
                           ) : (
                              /* VUE NORMALE DE LA LIGNE */
                              <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm flex items-center gap-4 transition-all hover:border-amber-300">

                                 <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${play.is_victory ? 'bg-amber-100 text-amber-600' : 'bg-stone-100 text-stone-400'}`}>
                                    {play.is_victory ? '🏆' : '💀'}
                                 </div>

                                 <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                       <span className="font-bold text-stone-700 text-sm">
                                          {new Date(play.played_on).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                       </span>
                                    </div>
                                    <div className="text-xs text-stone-500 flex items-center gap-2">
                                       <span>⏱️ {Math.floor(play.duration_minutes / 60)}h{play.duration_minutes % 60 > 0 ? (play.duration_minutes % 60).toString().padStart(2, '0') : ''}</span>
                                       {play.notes && <span>• 📝 Note</span>}
                                       {play.image_urls && play.image_urls.length > 0 && <span>• 📸 {play.image_urls.length}</span>}
                                    </div>
                                 </div>

                                 <div className="flex items-center gap-1">
                                    <button
                                       onClick={() => { onEditPlay(play); onClose(); }}
                                       className="p-2 text-stone-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                       title="Modifier"
                                    >
                                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </button>
                                    <button
                                       onClick={() => requestDelete(play.id)}
                                       className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                       title="Supprimer"
                                    >
                                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                 </div>
                              </div>
                           )}
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}
