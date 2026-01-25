import { useEffect } from 'react';

export default function DeleteGameModal({ game, isOpen, onClose, onConfirm }) {
   // Bloque le scroll arrière-plan
   useEffect(() => {
      if (isOpen) {
         document.body.style.overflow = 'hidden';
      }
      return () => {
         document.body.style.overflow = 'unset';
      };
   }, [isOpen]);

   if (!isOpen || !game) return null;

   return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
         {/* Backdrop */}
         <div
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity"
            onClick={onClose}
         ></div>

         {/* Card */}
         <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm relative z-10 animate-in zoom-in-95 duration-200 border border-stone-100">

            <div className="flex flex-col items-center text-center">
               {/* Icone Danger */}
               <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                     <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
               </div>

               <h3 className="text-lg font-bold text-stone-800 mb-2">
                  Supprimer ce jeu ?
               </h3>

               <p className="text-stone-500 text-sm mb-6">
                  Vous êtes sur le point de retirer <span className="font-bold text-stone-700">"{game.name}"</span> de votre challenge. Cette action est irréversible.
               </p>

               <div className="flex gap-3 w-full">
                  <button
                     onClick={onClose}
                     className="flex-1 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold rounded-xl transition-colors"
                  >
                     Annuler
                  </button>
                  <button
                     onClick={() => onConfirm(game.id)}
                     className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
                  >
                     Supprimer
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}
