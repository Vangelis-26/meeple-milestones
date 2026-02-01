// =================================================================================
// COMPOSANT : GAME HISTORY MODAL
// Rôle : Affiche l'historique de toutes les parties pour un jeu spécifique.
//        Permet édition et suppression des entrées.
// =================================================================================

import { useEffect, useState } from 'react';

// =========================================================================
// HELPER : FORMATAGE DE DATE
// =========================================================================

// Formatte une date ISO en français avec majuscule (ex: "Samedi 1 février 2026")
const formatDate = (dateString) => {
   const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
   const date = new Date(dateString).toLocaleDateString('fr-FR', options);
   return date.charAt(0).toUpperCase() + date.slice(1);
};

export default function GameHistoryModal({ game, isOpen, onClose, onEditPlay, deletePlay, getHistory, showToast }) {
   // =========================================================================
   // 1. GESTION DES ÉTATS (STATE MANAGEMENT)
   // =========================================================================

   // Historique complet des parties du jeu
   const [history, setHistory] = useState([]);
   // État de chargement des données
   const [loading, setLoading] = useState(true);
   // ID de la partie en attente de confirmation de suppression
   const [confirmDeleteId, setConfirmDeleteId] = useState(null);

   // =========================================================================
   // 2. FONCTIONS DE CHARGEMENT ET GESTION
   // =========================================================================

   // Charge l'historique des parties depuis la base de données
   const loadData = async () => {
      setLoading(true);
      const data = await getHistory(game.id);
      setHistory(data);
      setLoading(false);
   };

   // Charger les données à l'ouverture de la modale
   useEffect(() => {
      if (isOpen && game) { loadData(); }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isOpen, game]);

   // Demander la confirmation avant suppression
   const requestDelete = (playId) => setConfirmDeleteId(playId);
   // Annuler la suppression
   const cancelDelete = () => setConfirmDeleteId(null);

   // Confirmer et exécuter la suppression
   const confirmDelete = async () => {
      if (confirmDeleteId) {
         await deletePlay(confirmDeleteId, game.id);
         if (showToast) showToast("Le sort est lancé. Le souvenir s'efface...", "success");
         setConfirmDeleteId(null);
         await loadData();
      }
   };

   // =========================================================================
   // 3. RENDU DU COMPOSANT
   // =========================================================================

   // Si la modale n'est pas ouverte ou qu'il n'y a pas de jeu, ne rien afficher
   if (!isOpen || !game) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
         {/* Styles inline pour scrollbars et masque de dégradé */}
         <style>{`
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            .mask-bottom { mask-image: linear-gradient(to bottom, black 85%, transparent 100%); }
         `}</style>

         {/* --- BACKDROP (Fond sombre avec effet de flou) --- */}
         <div className="absolute inset-0 bg-stone-900/70 backdrop-blur-md transition-opacity" onClick={onClose}></div>

         {/* --- CONTENEUR PRINCIPAL DE LA MODALE --- */}         <div className="relative bg-stone-100 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh] shadow-2xl rounded-2xl ring-1 ring-white/10">

            {/* --- HEADER (Image de fond + Titre + Compteur d'entrées) --- */}
            <div className="relative h-32 shrink-0 bg-stone-900 overflow-hidden">
               <img
                  src={game.image_url || game.thumbnail_url}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-60 blur-[2px] scale-105"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/60 to-transparent"></div>

               {/* Contenu textuel du header */}
               <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
                  <div className="flex justify-between items-end">
                     <div>
                        <h3 className="font-serif font-black text-3xl text-white tracking-tight leading-none mb-1 drop-shadow-md">
                           Archives
                        </h3>
                        <div className="flex items-center gap-2 text-stone-300">
                           <span className="font-serif text-sm font-bold text-amber-400 italic tracking-wide">
                              {game.name}
                           </span>
                           <span className="text-[10px] uppercase tracking-widest font-bold opacity-80 border-l border-stone-500 pl-2 ml-1">
                              {history.length} {history.length > 1 ? 'Entrées' : 'Entrée'}
                           </span>
                        </div>
                     </div>
                     <button
                        onClick={onClose}
                        className="group p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all text-white border border-white/10 mb-1"
                     >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                     </button>
                  </div>
               </div>
               {/* Ligne décorative dorée */}
               <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
            </div>

            {/* --- LISTE DES PARTIES (Avec états : Chargement / Vide / Données) --- */}
            <div className="overflow-y-auto p-4 sm:p-5 flex-1 space-y-3 no-scrollbar relative z-10 mask-bottom pb-10">

               {/* État : Chargement en cours */}
               {loading ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3 text-stone-400">
                     <div className="animate-spin h-6 w-6 border-2 border-stone-300 border-t-amber-600 rounded-full"></div>
                     <p className="text-xs font-serif italic">Consultation du grimoire...</p>
                  </div>
               ) : history.length === 0 ? (
                  /* État : Aucune partie enregistrée */
                  <div className="flex flex-col items-center justify-center py-16 text-center opacity-60">
                     <span className="text-4xl mb-3 grayscale opacity-50">📜</span>
                     <p className="text-stone-500 font-serif text-lg italic">Cette page est encore vierge.</p>
                  </div>
               ) : (
                  /* Liste des parties enregistrées */
                  history.map((play) => (
                     <div key={play.id} className="relative group">

                        {/* MODE CONFIRMATION DE SUPPRESSION */}
                        {confirmDeleteId === play.id ? (
                           <div className="bg-red-50 border border-red-100 rounded-xl p-4 animate-in fade-in zoom-in-95 duration-200 shadow-inner">
                              <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">

                                 {/* Icône et message d'avertissement */}
                                 <div className="flex items-center gap-3">
                                    <div className="text-2xl shrink-0">🔥</div>
                                    <div>
                                       <h4 className="text-red-900 font-bold font-serif text-lg leading-tight">Invoquer l'Oubli ?</h4>
                                       <p className="text-xs text-red-800/80 font-medium italic">
                                          Attention aventurier, ce sort est irréversible ! Ce récit sera perdu à jamais.
                                       </p>
                                    </div>
                                 </div>

                                 {/* Boutons de confirmation/annulation */}
                                 <div className="flex gap-2 self-end sm:self-auto mt-2 sm:mt-0">
                                    <button onClick={cancelDelete} className="px-3 py-1.5 text-xs font-bold text-stone-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-stone-200 uppercase tracking-wide">
                                       Garder
                                    </button>
                                    <button onClick={confirmDelete} className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors uppercase tracking-wide">
                                       Consumer
                                    </button>
                                 </div>
                              </div>
                           </div>
                        ) : (
                           /* MODE AFFICHAGE NORMAL : Carte de partie */
                           <div className="flex items-center gap-3 sm:gap-4 py-3 px-3 sm:px-4 bg-white border border-stone-200 rounded-xl shadow-sm hover:shadow-md hover:border-amber-300/50 transition-all group">

                              {/* Badge de résultat (Victoire/Défaite) */}
                              <div className={`shrink-0 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full text-lg shadow-md border-2  
                                 ${play.is_victory
                                    ? 'bg-amber-500 border-amber-400 text-white'
                                    : 'bg-stone-800 border-stone-700 text-stone-300'
                                 }`}>
                                 {play.is_victory ? '🏆' : '💀'}
                              </div>

                              {/* Informations de la partie (Date et Durée) */}
                              <div className="flex flex-col justify-center gap-0.5 flex-1 min-w-0">
                                 <h4 className="font-serif font-bold text-stone-800 text-sm sm:text-base capitalize leading-none truncate">
                                    {formatDate(play.played_on)}
                                 </h4>

                                 <div className="flex items-center gap-1.5 text-stone-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-[10px] font-bold uppercase tracking-widest font-sans">
                                       {Math.floor(play.duration_minutes / 60)}h{play.duration_minutes % 60 > 0 ? (play.duration_minutes % 60).toString().padStart(2, '0') : ''}
                                    </span>
                                 </div>
                              </div>

                              {/* Indicateurs supplémentaires et actions */}
                              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                                 {/* Badges : Nombre de photos et présence de notes */}
                                 {(play.notes || (play.image_urls && play.image_urls.length > 0)) && (
                                    <div className="hidden xs:flex items-center gap-2 bg-stone-50 px-2 py-1 rounded-md border border-stone-100">
                                       {play.image_urls && play.image_urls.length > 0 && (
                                          <div className="flex items-center gap-1 text-stone-400">
                                             <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
                                             <span className="text-[9px] font-bold">{play.image_urls.length}</span>
                                          </div>
                                       )}
                                       {play.notes && play.image_urls?.length > 0 && <div className="w-px h-3 bg-stone-200"></div>}
                                       {play.notes && (
                                          <div className="flex items-center gap-1 text-stone-400">
                                             <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" /></svg>
                                          </div>
                                       )}
                                    </div>
                                 )}

                                 {/* Boutons d'édition et suppression */}
                                 <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 sm:translate-x-1 sm:group-hover:translate-x-0 border-l border-stone-100 pl-2">
                                    <button onClick={() => { onEditPlay(play); onClose(); }} className="p-1.5 text-stone-300 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors">
                                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </button>
                                    <button onClick={() => requestDelete(play.id)} className="p-1.5 text-stone-300 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
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
