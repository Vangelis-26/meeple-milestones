// src/pages/Profile.jsx

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../services/supabase';

// --- DÉCORATION ---
const DecorativeMeeple = ({ color, className }) => (
   <svg viewBox="0 0 512 512" className={`absolute opacity-[0.03] pointer-events-none z-0 ${className}`} style={{ fill: color }}>
      <path d="M256 54.99c-27 0-46.418 14.287-57.633 32.23-10.03 16.047-14.203 34.66-15.017 50.962-30.608 15.135-64.515 30.394-91.815 45.994-14.32 8.183-26.805 16.414-36.203 25.26C45.934 218.28 39 228.24 39 239.99c0 5 2.44 9.075 5.19 12.065 2.754 2.99 6.054 5.312 9.812 7.48 7.515 4.336 16.99 7.95 27.412 11.076 15.483 4.646 32.823 8.1 47.9 9.577-14.996 25.84-34.953 49.574-52.447 72.315C56.65 378.785 39 403.99 39 431.99c0 4-.044 7.123.31 10.26.355 3.137 1.256 7.053 4.41 10.156 3.155 3.104 7.017 3.938 10.163 4.28 3.146.345 6.315.304 10.38.304h111.542c8.097 0 14.026.492 20.125-3.43 6.1-3.92 8.324-9.275 12.67-17.275l.088-.16.08-.166s9.723-19.77 21.324-39.388c5.8-9.808 12.097-19.576 17.574-26.498 2.74-3.46 5.304-6.204 7.15-7.754.564-.472.82-.56 1.184-.76.363.2.62.288 1.184.76 1.846 1.55 4.41 4.294 7.15 7.754 5.477 6.922 11.774 16.69 17.574 26.498 11.6 19.618 21.324 39.387 21.324 39.387l.08.165.088.16c4.346 8 6.55 13.323 12.61 17.254 6.058 3.93 11.974 3.45 19.957 3.45H448c4 0 7.12.043 10.244-.304 3.123-.347 6.998-1.21 10.12-4.332 3.12-3.122 3.984-6.997 4.33-10.12.348-3.122.306-6.244.306-10.244 0-28-17.65-53.205-37.867-79.488-17.493-22.74-37.45-46.474-52.447-72.315 15.077-1.478 32.417-4.93 47.9-9.576 10.422-3.125 19.897-6.74 27.412-11.075 3.758-2.168 7.058-4.49 9.81-7.48 2.753-2.99 5.192-7.065 5.192-12.065 0-11.75-6.934-21.71-16.332-30.554-9.398-8.846-21.883-17.077-36.203-25.26-27.3-15.6-61.207-30.86-91.815-45.994-.814-16.3-4.988-34.915-15.017-50.96C302.418 69.276 283 54.99 256 54.99z" />
   </svg>
);

export default function Profile() {
   const { user, signOut, signIn } = useAuth();

   // --- ÉTATS ---
   const [loading, setLoading] = useState(false);
   const [currentPassword, setCurrentPassword] = useState('');
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [message, setMessage] = useState({ type: '', text: '' });
   const [isDeleteConfirming, setIsDeleteConfirming] = useState(false);

   const joinDate = user?.created_at
      ? new Date(user.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
      : 'Date inconnue';

   // --- LOGIQUE MOT DE PASSE ---
   const handleUpdatePassword = async (e) => {
      e.preventDefault();
      setMessage({ type: '', text: '' });

      if (password !== confirmPassword) {
         setMessage({ type: 'error', text: "Les nouveaux sceaux ne correspondent pas." });
         return;
      }
      if (password.length < 6) {
         setMessage({ type: 'error', text: "Le sceau doit contenir au moins 6 caractères." });
         return;
      }

      setLoading(true);
      try {
         const { error: verifyError } = await signIn(user.email, currentPassword);
         if (verifyError) throw new Error("Le sceau actuel est incorrect.");

         const { error } = await supabase.auth.updateUser({ password: password });
         if (error) throw error;

         setMessage({ type: 'success', text: "Votre sceau de sécurité a été reforgé avec succès." });
         setCurrentPassword('');
         setPassword('');
         setConfirmPassword('');
      } catch (err) {
         setMessage({ type: 'error', text: err.message });
      } finally {
         setLoading(false);
      }
   };

   // --- LOGIQUE SUPPRESSION ---
   const handleDeleteAccount = async () => {
      setLoading(true);
      try {
         alert("La procédure de dissolution a été enclenchée (Nécessite Backend Admin).");
         await signOut();
      } catch (error) {
         console.error(error);
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="min-h-screen bg-[#FDFBF7] font-sans selection:bg-amber-100 pb-20 pt-28 md:pt-36 relative overflow-hidden">

         {/* FOND AMBIANCE */}
         <div className="fixed inset-0 pointer-events-none">
            <DecorativeMeeple color="#d97706" className="w-[40rem] h-[40rem] -top-20 -left-20 rotate-12" />
            <DecorativeMeeple color="#1c1917" className="w-[35rem] h-[35rem] top-40 -right-40 -rotate-12 opacity-[0.02]" />
            <div className="absolute inset-0 opacity-[0.06] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
         </div>

         <div className="max-w-4xl mx-auto px-4 md:px-12 space-y-8 relative z-10">

            {/* --- 1. CARTE D'IDENTITÉ --- */}
            <section className="bg-white/90 backdrop-blur-sm rounded-[2rem] border border-stone-200/60 shadow-xl overflow-hidden p-8 md:p-10 relative group hover:border-amber-200/50 transition-colors duration-500">
               <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-100/50 to-transparent rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
               <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
                  <div className="w-20 h-20 rounded-2xl bg-stone-900 text-amber-50 flex items-center justify-center shadow-lg transform rotate-3 group-hover:rotate-6 transition-transform duration-500">
                     <span className="font-serif font-black text-3xl uppercase">{user?.email?.charAt(0) || 'M'}</span>
                  </div>
                  <div className="flex-1">
                     <h2 className="text-2xl font-serif font-bold text-stone-900">Initié du Sanctuaire</h2>
                     <p className="text-stone-500 font-medium mt-1 font-serif tracking-wide">{user?.email}</p>
                     <div className="flex items-center gap-2 mt-4 text-[10px] font-black uppercase tracking-widest text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg w-fit border border-amber-100 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                        <span>Membre depuis le {joinDate}</span>
                     </div>
                  </div>
               </div>
            </section>

            {/* --- 2. SÉCURITÉ --- */}
            <section className="bg-white/90 backdrop-blur-sm rounded-[2rem] border border-stone-200/60 shadow-xl p-8 md:p-10">
               <h3 className="text-lg font-serif font-bold text-stone-900 mb-8 flex items-center gap-3">
                  <span className="flex h-3 w-3 relative">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  Reforger le Sceau
               </h3>

               <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-2xl">
                  {message.text && (
                     <div className={`p-4 rounded-xl text-xs font-bold uppercase tracking-wide flex items-center gap-3 animate-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-red-50 text-red-800 border border-red-100'
                        }`}>
                        <span>{message.type === 'success' ? '✨' : '🛡️'}</span>
                        {message.text}
                     </div>
                  )}

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-2">Sceau Actuel</label>
                     <input
                        type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Confirmez votre identité..."
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none font-serif font-bold transition-all"
                        required
                     />
                  </div>
                  <div className="h-px w-full bg-stone-100 my-4"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-2">Nouveau Sceau</label>
                        <input
                           type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                           placeholder="Nouveau secret..."
                           className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none font-serif font-bold transition-all"
                           required
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-2">Confirmer le Sceau</label>
                        <input
                           type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                           placeholder="Répétez le secret..."
                           className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-stone-900 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none font-serif font-bold transition-all"
                           required
                        />
                     </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                     {/* COULEUR NOIR PROFOND POUR L'ACTION */}
                     <button
                        type="submit"
                        disabled={loading || !password || !currentPassword}
                        className="px-8 py-3 bg-black text-amber-50 rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 hover:shadow-xl"
                     >
                        {loading ? "Forgeage..." : "Sceller le nouveau mot de passe"}
                     </button>
                  </div>
               </form>
            </section>

            {/* --- 3. ZONE DE DANGER (Hover Agressif & Premium) --- */}
            <section className={`group transition-all duration-300 rounded-[2rem] border overflow-hidden relative 
           ${isDeleteConfirming
                  ? 'bg-red-50 border-red-500 shadow-2xl shadow-red-500/20 scale-[1.01]' // Mode Confirm
                  : 'bg-white border-stone-200 shadow-sm hover:border-red-400 hover:bg-red-50/30 hover:shadow-[0_0_30px_-5px_rgba(239,68,68,0.15)]' // Mode Repos + Hover Alerte
               }`}
            >
               <div className="p-8 md:p-10 relative z-10">
                  <h3 className={`text-lg font-serif font-bold mb-2 flex items-center gap-3 transition-colors ${isDeleteConfirming || 'group-hover:text-red-600'} ${isDeleteConfirming ? 'text-red-900' : 'text-stone-400'}`}>
                     {isDeleteConfirming ? <span className="text-xl">🔥</span> : <span className="text-xl grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">🔒</span>}
                     Zone de Danger
                  </h3>

                  <p className={`text-sm max-w-2xl leading-relaxed font-medium transition-colors ${isDeleteConfirming || 'group-hover:text-stone-600'} ${isDeleteConfirming ? 'text-red-900/80' : 'text-stone-400/60'}`}>
                     La dissolution de votre lien avec le sanctuaire est irréversible. Toutes vos archives, statistiques et trophées seront perdus à jamais.
                  </p>

                  <div className="flex justify-end mt-8">
                     {isDeleteConfirming ? (
                        <div className="flex items-center gap-4 animate-in slide-in-from-right-4 fade-in duration-300">
                           <button
                              onClick={() => setIsDeleteConfirming(false)}
                              className="px-6 py-3 text-stone-500 text-xs font-bold uppercase hover:text-stone-800 transition-colors tracking-widest"
                           >
                              Annuler
                           </button>
                           <button
                              onClick={handleDeleteAccount}
                              disabled={loading}
                              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-red-900/20 hover:shadow-red-500/30 transition-all transform active:scale-95"
                           >
                              {loading ? "Dissolution..." : "Confirmer la dissolution"}
                           </button>
                        </div>
                     ) : (
                        <button
                           onClick={() => setIsDeleteConfirming(true)}
                           className="px-6 py-3 bg-white border border-stone-200 text-stone-400 hover:text-red-600 hover:border-red-200 group-hover:border-red-200 group-hover:text-red-500 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm hover:shadow-md"
                        >
                           Supprimer mon compte
                        </button>
                     )}
                  </div>
               </div>
            </section>

         </div>
      </div>
   );
}
