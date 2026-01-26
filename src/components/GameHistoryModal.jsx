import { useEffect, useState } from 'react';

const formatDate = (dateString) => {
   const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
   return new Date(dateString).toLocaleDateString('fr-FR', options);
};

export default function GameHistoryModal({ game, isOpen, onClose, onEditPlay, deletePlay, getHistory, showToast }) {
   const [history, setHistory] = useState([]);
   const [loading, setLoading] = useState(true);
   const [confirmDeleteId, setConfirmDeleteId] = useState(null);

   const loadData = async () => {
      setLoading(true);
      const data = await getHistory(game.id);
      setHistory(data);
      setLoading(false);
   };

   useEffect(() => {
      if (isOpen && game) {
         loadData();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isOpen, game]);

   const requestDelete = (playId) => setConfirmDeleteId(playId);
   const cancelDelete = () => setConfirmDeleteId(null);

   const confirmDelete = async () => {
      if (confirmDeleteId) {
         await deletePlay(confirmDeleteId, game.id);
         if (showToast) showToast("La chronologie a été modifiée.", "success");
         setConfirmDeleteId(null);
         await loadData();
      }
   };

   if (!isOpen || !game) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
         <style>{`
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
         `}</style>

         <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

         <div className="relative bg-stone-50 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh] border border-stone-200">

            {/* Header */}
            <div className="bg-white border-b border-stone-200 px-6 py-5 flex justify-between items-center shrink-0 z-10">
               <div>
                  <h3 className="font-serif font-bold text-xl text-stone-800 tracking-tight">Archives des Parties</h3>
                  <div className="flex items-center gap-2 mt-1">
                     <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {game.name}
                     </span>
                     <span className="text-xs text-stone-400 font-medium">
                        {history.length} {history.length > 1 ? 'sessions' : 'session'}
                     </span>
                  </div>
               </div>
               <button onClick={onClose} className="text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-full p-2 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
            </div>

            {/* Liste */}
            <div className="overflow-y-auto p-4 flex-1 custom-scrollbar space-y-3 no-scrollbar">
               {loading ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                     <div className="animate-spin h-8 w-8 border-4 border-stone-200 border-t-amber-600 rounded-full"></div>
                     <p className="text-xs text-stone-400 font-medium uppercase tracking-widest">Consultation des archives...</p>
                  </div>
               ) : history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center opacity-60">
                     <span className="text-4xl mb-2">📜</span>
                     <p className="text-stone-500 font-serif italic">Les pages de ce livre sont encore vierges.</p>
                  </div>
               ) : (
                  history.map((play) => (
                     <div key={play.id} className="transition-all duration-300">

                        {/* Zone de Danger (Rouge) */}
                        {confirmDeleteId === play.id ? (
                           <div className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-5 shadow-inner animate-in fade-in slide-in-from-left-2 duration-200">
                              <div className="flex items-start gap-4">
                                 <div className="p-2 bg-red-100 rounded-full shrink-0 text-red-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                 </div>
                                 <div className="flex-1">
                                    <h4 className="text-red-900 font-bold font-serif mb-1">Invoquer l'Oubli ?</h4>
                                    <p className="text-sm text-red-700/80 leading-relaxed mb-4">
                                       Cette action est irréversible. Le Meeple associé retournera dans l'ombre.
                                    </p>
                                    <div className="flex gap-3 justify-end">
                                       <button onClick={cancelDelete} className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-white hover:text-stone-900 rounded-lg transition-colors border border-transparent hover:border-stone-200">
                                          ANNULER
                                       </button>
                                       <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-2">
                                          CONFIRMER
                                       </button>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        ) : (

                           /* Carte Normale */
                           <div className={`group relative bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-stone-100 overflow-hidden ${play.is_victory ? 'border-l-4 border-l-amber-400' : 'border-l-4 border-l-stone-300'}`}>
                              <div className="flex items-start justify-between gap-4">
                                 <div className="flex items-start gap-4">
                                    {/* ICÔNES : COURONNE vs CRÂNE */}
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-2xl shadow-inner ${play.is_victory ? 'bg-amber-50 text-amber-600' : 'bg-stone-100 text-stone-500 grayscale'}`}>
                                       {play.is_victory ? '👑' : '💀'}
                                    </div>

                                    <div>
                                       <h4 className="font-bold text-stone-800 capitalize text-sm sm:text-base">
                                          {formatDate(play.played_on)}
                                       </h4>

                                       {/* Badges */}
                                       <div className="flex flex-wrap items-center gap-3 mt-2 text-stone-400">
                                          <span className="flex items-center gap-1.5 text-xs font-medium text-stone-500 bg-stone-50 px-2 py-0.5 rounded border border-stone-100">
                                             <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                             {Math.floor(play.duration_minutes / 60)}h{play.duration_minutes % 60 > 0 ? (play.duration_minutes % 60).toString().padStart(2, '0') : ''}
                                          </span>

                                          {play.notes && (
                                             <span className="flex items-center gap-1 text-xs text-indigo-400" title="Notes disponibles">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                                             </span>
                                          )}

                                          {play.image_urls && play.image_urls.length > 0 && (
                                             <span className="flex items-center gap-1 text-xs text-emerald-500" title={`${play.image_urls.length} photos`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                <span className="font-bold">{play.image_urls.length}</span>
                                             </span>
                                          )}
                                       </div>
                                    </div>
                                 </div>

                                 <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => { onEditPlay(play); onClose(); }} className="p-2 text-stone-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </button>
                                    <button onClick={() => requestDelete(play.id)} className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                 </div>
                              </div>
                           </div>
                        )}
                     </div>
                  ))
               )}
            </div>
         </div>
      </div>
   );
}
