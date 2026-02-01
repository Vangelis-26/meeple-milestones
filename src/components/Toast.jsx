// =================================================================================
// COMPOSANT : TOAST
// Rôle : Notification éphémère (Auto-close 4s) pour feedback utilisateur.
// =================================================================================

import { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
   // Auto-fermeture
   useEffect(() => {
      const timer = setTimeout(() => {
         onClose();
      }, 4000);
      return () => clearTimeout(timer);
   }, [onClose]);

   // Configuration Visuelle
   const config = type === 'success'
      ? { style: "bg-stone-900 text-amber-50 border-amber-600/50", icon: "✨", title: "Succès" }
      : { style: "bg-red-900 text-white border-red-500/50", icon: "💀", title: "Erreur" };

   return (
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
         <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border ${config.style} backdrop-blur-md min-w-[300px] max-w-md`}>
            <span className="text-2xl">{config.icon}</span>
            <div className="flex-1">
               <p className="font-serif font-bold text-sm tracking-wide">{config.title}</p>
               <p className="text-sm opacity-90 font-medium">{message}</p>
            </div>
            <button onClick={onClose} className="opacity-50 hover:opacity-100 transition-opacity p-1">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
         </div>
      </div>
   );
}
