// ============================================================
// COMPOSANT : LOGIN
// L'Antre des Légendes - Version Master Validée
// ============================================================
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// --- DÉCORATION : MEEPLE D'AMBIANCE ---
const DecorativeMeeple = ({ color, className }) => (
   <svg viewBox="0 0 512 512" className={`absolute opacity-[0.05] pointer-events-none z-0 ${className}`} style={{ fill: color }}>
      <path d="M256 54.99c-27 0-46.418 14.287-57.633 32.23-10.03 16.047-14.203 34.66-15.017 50.962-30.608 15.135-64.515 30.394-91.815 45.994-14.32 8.183-26.805 16.414-36.203 25.26C45.934 218.28 39 228.24 39 239.99c0 5 2.44 9.075 5.19 12.065 2.754 2.99 6.054 5.312 9.812 7.48 7.515 4.336 16.99 7.95 27.412 11.076 15.483 4.646 32.823 8.1 47.9 9.577-14.996 25.84-34.953 49.574-52.447 72.315C56.65 378.785 39 403.99 39 431.99c0 4-.044 7.123.31 10.26.355 3.137 1.256 7.053 4.41 10.156 3.155 3.104 7.017 3.938 10.163 4.28 3.146.345 6.315.304 10.38.304h111.542c8.097 0 14.026.492 20.125-3.43 6.1-3.92 8.324-9.275 12.67-17.275l.088-.16.08-.166s9.723-19.77 21.324-39.388c5.8-9.808 12.097-19.576 17.574-26.498 2.74-3.46 5.304-6.204 7.15-7.754.564-.472.82-.56 1.184-.76.363.2.62.288 1.184.76 1.846 1.55 4.41 4.294 7.15 7.754 5.477 6.922 11.774 16.69 17.574 26.498 11.6 19.618 21.324 39.387 21.324 39.387l.08.165.088.16c4.346 8 6.55 13.323 12.61 17.254 6.058 3.93 11.974 3.45 19.957 3.45H448c4 0 7.12.043 10.244-.304 3.123-.347 6.998-1.21 10.12-4.332 3.12-3.122 3.984-6.997 4.33-10.12.348-3.122.306-6.244.306-10.244 0-28-17.65-53.205-37.867-79.488-17.493-22.74-37.45-46.474-52.447-72.315 15.077-1.478 32.417-4.93 47.9-9.576 10.422-3.125 19.897-6.74 27.412-11.075 3.758-2.168 7.058-4.49 9.81-7.48 2.753-2.99 5.192-7.065 5.192-12.065 0-11.75-6.934-21.71-16.332-30.554-9.398-8.846-21.883-17.077-36.203-25.26-27.3-15.6-61.207-30.86-91.815-45.994-.814-16.3-4.988-34.915-15.017-50.96C302.418 69.276 283 54.99 256 54.99z" />
   </svg>
);

export default function Login() {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);

   // --- LOGIQUE DE NAVIGATION ---
   const [searchParams, setSearchParams] = useSearchParams();
   const navigate = useNavigate();
   const { signIn, signUp } = useAuth();

   // Dérive le mode directement de l'URL (?mode=signup)
   const isSignUp = searchParams.get('mode') === 'signup';

   // Fonction pour changer de mode proprement
   const handleToggleMode = (e) => {
      e.preventDefault();
      setSearchParams(isSignUp ? {} : { mode: 'signup' });
      setError(null);
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      try {
         const { error: authError } = isSignUp
            ? await signUp(email, password)
            : await signIn(email, password);

         if (authError) throw authError;
         navigate('/dashboard');
      } catch (err) {
         setError(err.message);
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#D6D1C3] relative overflow-hidden font-sans">

         {/* --- 1. ATMOSPHÈRE "ANTRE" --- */}
         <div className="fixed inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(28,25,23,0.35)_100%)]"></div>
            <DecorativeMeeple color="#d97706" className="w-[38rem] h-[38rem] -top-32 -left-40 rotate-12" />
            <DecorativeMeeple color="#1e40af" className="w-[30rem] h-[30rem] bottom-0 -right-24 -rotate-12 opacity-[0.03]" />
         </div>
         <div className="absolute inset-0 opacity-[0.08] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

         <div className="relative z-10 w-full max-w-md px-6 animate-in fade-in zoom-in-95 duration-1000">

            {/* --- 2. HEADER : LOGO & TITRE --- */}
            <div className="text-center mb-8 flex flex-col items-center gap-6">
               <div className="relative w-32 h-32 transition-transform duration-700 hover:scale-110 drop-shadow-[0_25px_25px_rgba(0,0,0,0.35)]">
                  <img src="/logo.png" alt="Sceau" className="w-full h-full object-contain" />
               </div>

               <div className="flex items-center gap-4">
                  <div className="h-[1px] w-12 bg-stone-500/20"></div>
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-600/80">
                     {isSignUp ? "Nouvel Initié" : "Authentification"}
                  </p>
                  <div className="h-[1px] w-12 bg-stone-500/20"></div>
               </div>

               <h1 className="flex flex-col items-center font-serif uppercase tracking-tighter leading-[0.85]">
                  <span className="font-light opacity-50 italic text-3xl md:text-4xl text-stone-900">L'Antre</span>
                  <span className="font-black text-4xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-br from-amber-600 via-amber-800 to-stone-900 whitespace-nowrap mt-2">
                     des Légendes
                  </span>
               </h1>
            </div>

            {/* --- 3. CARTE DE FORMULAIRE --- */}
            <div className="bg-white/95 backdrop-blur-sm rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden border border-stone-200/50">
               {/* Grain interne */}
               <div className="absolute inset-0 opacity-[0.25]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")` }}></div>

               <form onSubmit={handleSubmit} className="relative z-10 space-y-7">
                  {error && (
                     <div className="bg-red-50 border border-red-100 text-red-800 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-3">
                        <span className="text-base">⚠️</span> {error}
                     </div>
                  )}

                  {/* IDENTIFIANT */}
                  <div className="space-y-2 text-left">
                     <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest ml-4 block">Grimoire (Email)</label>
                     <input
                        type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@grimoire.com"
                        className="w-full bg-stone-100/50 border border-stone-300 rounded-2xl px-6 py-4 text-stone-900 focus:ring-4 focus:ring-amber-600/10 focus:border-amber-600/50 outline-none font-serif font-bold text-lg transition-all"
                        required
                     />
                  </div>

                  {/* SECRET */}
                  <div className="space-y-2 text-left">
                     <div className="flex justify-between items-center px-4">
                        <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Sceau (Password)</label>
                        {!isSignUp && (
                           <Link
                              to="/forgot-password"
                              className="text-[9px] font-bold text-amber-700 uppercase opacity-60 hover:opacity-100 transition-opacity"
                           >
                              Perdu ?
                           </Link>
                        )}
                     </div>
                     <input
                        type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-stone-100/50 border border-stone-300 rounded-2xl px-6 py-4 text-stone-900 focus:ring-4 focus:ring-amber-600/10 focus:border-amber-600/50 outline-none font-serif font-bold text-lg transition-all"
                        required
                     />
                  </div>

                  {/* BOUTON ACTION */}
                  <button
                     type="submit" disabled={loading}
                     className="w-full bg-stone-900 hover:bg-black text-amber-50 rounded-2xl py-5 font-serif font-black uppercase tracking-[0.25em] shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all group relative overflow-hidden"
                  >
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                     <div className="flex items-center justify-center">
                        {loading ? (
                           <div className="animate-spin h-4 w-4 border-2 border-stone-600 border-t-amber-500 rounded-full"></div>
                        ) : (
                           <span>{isSignUp ? "Lancer l'aventure" : "Ouvrir le Grimoire"}</span>
                        )}
                     </div>
                  </button>
               </form>

               {/* BASCULE DE MODE */}
               <div className="mt-10 pt-8 border-t border-stone-100 flex flex-col items-center gap-3 relative z-20">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest opacity-60 text-center">
                     {isSignUp ? "Déjà membre ?" : "Nouveau voyageur ?"}
                  </p>
                  <button
                     type="button"
                     onClick={handleToggleMode}
                     className="text-[11px] font-serif font-black text-amber-800 uppercase tracking-widest hover:text-amber-600 transition-colors border-b-2 border-amber-100 hover:border-amber-600 pb-0.5 cursor-pointer"
                  >
                     {isSignUp ? "Se connecter" : "Créer un profil"}
                  </button>
               </div>
            </div>

            {/* SIGNATURE BAS DE PAGE */}
            <div className="mt-12 text-center opacity-30 tracking-[0.8em]">
               <div className="text-[12px] font-serif font-black text-stone-800 uppercase">
                  CHALLENGE 10<span className="mx-2">X</span>10
               </div>
            </div>
         </div>
      </div>
   );
}
