import { useState } from 'react';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';

export default function SetPassword() {
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [loading, setLoading] = useState(false);
   const [message, setMessage] = useState({ type: '', text: '' });
   const navigate = useNavigate();

   const handleSetPassword = async (e) => {
      e.preventDefault();

      if (password !== confirmPassword) {
         return setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas.' });
      }

      if (password.length < 6) {
         return setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères.' });
      }

      setLoading(true);
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
         setMessage({ type: 'error', text: error.message });
         setLoading(false);
      } else {
         setMessage({ type: 'success', text: 'Accès scellé ! Redirection vers votre sanctuaire...' });
         setTimeout(() => navigate('/dashboard'), 2000);
      }
   };

   return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 font-sans">
         {/* Texture de fond */}
         <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')] pointer-events-none"></div>

         <div className="max-w-md w-full bg-white rounded-[2.5rem] border border-stone-200 shadow-xl p-8 md:p-12 relative z-10">
            <div className="text-center space-y-4 mb-10">
               <div className="w-16 h-16 bg-stone-900 rounded-2xl border border-stone-800 shadow-lg p-3 mx-auto flex items-center justify-center mb-6">
                  <img src="/logo.png" alt="Sceau" className="w-full h-full object-contain" />
               </div>
               <h1 className="text-3xl font-serif font-black text-stone-900 italic tracking-tight">
                  Sceller votre <span className="text-amber-600">Accès</span>
               </h1>
               <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.2em]">Finalisation du compte invité</p>
            </div>

            <form onSubmit={handleSetPassword} className="space-y-6">
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">Nouveau mot de passe</label>
                  <input
                     type="password"
                     required
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-stone-900 placeholder:text-stone-300"
                     placeholder="••••••••"
                  />
               </div>

               <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">Confirmer le mot de passe</label>
                  <input
                     type="password"
                     required
                     value={confirmPassword}
                     onChange={(e) => setConfirmPassword(e.target.value)}
                     className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all text-stone-900 placeholder:text-stone-300"
                     placeholder="••••••••"
                  />
               </div>

               {message.text && (
                  <div className={`p-4 rounded-xl text-xs font-bold text-center ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                     {message.text}
                  </div>
               )}

               <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-4 rounded-2xl shadow-lg shadow-stone-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 uppercase text-[11px] tracking-[0.2em]"
               >
                  {loading ? 'Inscription au grimoire...' : 'Valider mon accès'}
               </button>
            </form>

            <p className="mt-10 text-center text-[10px] text-stone-300 uppercase tracking-widest leading-relaxed">
               Meeple & Milestones • Accès Privé
            </p>
         </div>
      </div>
   );
}
