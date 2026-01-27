import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Composant décoratif local (Meeple de fond)
const DecorativeMeeple = ({ color, className }) => (
   <svg viewBox="0 0 512 512" className={`absolute opacity-[0.08] pointer-events-none z-0 ${className}`} style={{ fill: color }}>
      <path d="M256 54.99c-27 0-46.418 14.287-57.633 32.23-10.03 16.047-14.203 34.66-15.017 50.962-30.608 15.135-64.515 30.394-91.815 45.994-14.32 8.183-26.805 16.414-36.203 25.26C45.934 218.28 39 228.24 39 239.99c0 5 2.44 9.075 5.19 12.065 2.754 2.99 6.054 5.312 9.812 7.48 7.515 4.336 16.99 7.95 27.412 11.076 15.483 4.646 32.823 8.1 47.9 9.577-14.996 25.84-34.953 49.574-52.447 72.315C56.65 378.785 39 403.99 39 431.99c0 4-.044 7.123.31 10.26.355 3.137 1.256 7.053 4.41 10.156 3.155 3.104 7.017 3.938 10.163 4.28 3.146.345 6.315.304 10.38.304h111.542c8.097 0 14.026.492 20.125-3.43 6.1-3.92 8.324-9.275 12.67-17.275l.088-.16.08-.166s9.723-19.77 21.324-39.388c5.8-9.808 12.097-19.576 17.574-26.498 2.74-3.46 5.304-6.204 7.15-7.754.564-.472.82-.56 1.184-.76.363.2.62.288 1.184.76 1.846 1.55 4.41 4.294 7.15 7.754 5.477 6.922 11.774 16.69 17.574 26.498 11.6 19.618 21.324 39.387 21.324 39.387l.08.165.088.16c4.346 8 6.55 13.323 12.61 17.254 6.058 3.93 11.974 3.45 19.957 3.45H448c4 0 7.12.043 10.244-.304 3.123-.347 6.998-1.21 10.12-4.332 3.12-3.122 3.984-6.997 4.33-10.12.348-3.122.306-6.244.306-10.244 0-28-17.65-53.205-37.867-79.488-17.493-22.74-37.45-46.474-52.447-72.315 15.077-1.478 32.417-4.93 47.9-9.576 10.422-3.125 19.897-6.74 27.412-11.075 3.758-2.168 7.058-4.49 9.81-7.48 2.753-2.99 5.192-7.065 5.192-12.065 0-11.75-6.934-21.71-16.332-30.554-9.398-8.846-21.883-17.077-36.203-25.26-27.3-15.6-61.207-30.86-91.815-45.994-.814-16.3-4.988-34.915-15.017-50.96C302.418 69.276 283 54.99 256 54.99z" />
   </svg>
);

export default function Login() {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);

   const location = useLocation();
   const navigate = useNavigate();
   const [isSignUp, setIsSignUp] = useState(false);

   useEffect(() => {
      if (location.state?.mode === 'signup') {
         setIsSignUp(true);
      } else {
         setIsSignUp(false);
      }
   }, [location.state]);

   const { signIn, signUp } = useAuth();

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      try {
         if (isSignUp) {
            const { error } = await signUp(email, password);
            if (error) throw error;
            navigate('/dashboard');
         } else {
            const { error } = await signIn(email, password);
            if (error) throw error;
            navigate('/dashboard');
         }
      } catch (error) {
         setError(error.message);
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="flex-1 w-full flex flex-col items-center justify-center p-4 relative overflow-hidden -mt-16">

         {/* --- DÉCOR --- */}
         <div className="fixed inset-0 pointer-events-none">
            <DecorativeMeeple color="#d97706" className="w-96 h-96 -top-20 -left-24 rotate-12 opacity-[0.05]" />
            <DecorativeMeeple color="#1e40af" className="w-80 h-80 bottom-0 -right-20 -rotate-12 opacity-[0.05]" />
         </div>

         {/* CARTE PRINCIPALE */}
         <main className="w-full max-w-md bg-[#FDFBF7] rounded-[2rem] shadow-2xl border border-stone-200/60 overflow-hidden animate-in zoom-in-95 duration-500 relative z-10 group">

            {/* HEADER STONE (Style Grimoire) */}
            <div className="relative bg-stone-900 p-10 flex flex-col items-center text-center overflow-hidden">
               {/* Effet de lueur d'ambiance */}
               <div className="absolute inset-0 bg-gradient-to-b from-stone-800/50 to-stone-900 pointer-events-none"></div>
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

               {/* Logo Cerclé Premium */}
               <div className="w-20 h-20 rounded-full border-2 border-amber-500/30 shadow-2xl overflow-hidden bg-stone-800 mb-6 relative z-10 group-hover:scale-105 transition-transform duration-500 ring-4 ring-stone-900">
                  <img src="/logo.webp" alt="Logo" className="w-full h-full object-cover opacity-90" />
               </div>

               <h2 className="text-3xl font-serif font-bold text-amber-50 tracking-tight relative z-10 drop-shadow-sm mb-2">
                  {isSignUp ? "Rejoignez la Guilde" : "Bon retour, Voyageur"}
               </h2>

               <div className="h-1 w-12 bg-amber-700/50 rounded-full mb-3 relative z-10"></div>

               <p className="text-stone-400 text-[10px] font-bold uppercase tracking-[0.25em] relative z-10">
                  {isSignUp ? "Débutez votre épopée" : "Accédez à votre grimoire"}
               </p>
            </div>

            {/* FORMULAIRE */}
            <div className="p-8 sm:p-10">
               <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                  {error && (
                     <div className="bg-red-50 border border-red-100 text-red-800 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wide flex items-center gap-3 shadow-sm">
                        <span className="text-lg">⚠️</span>
                        {error}
                     </div>
                  )}

                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-1">Email</label>
                     <input
                        type="email"
                        required
                        className="w-full p-4 bg-white border border-stone-200 text-stone-800 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none font-serif font-bold tracking-wide transition-all placeholder:font-sans placeholder:text-stone-300 placeholder:font-normal"
                        placeholder="votre@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                     />
                  </div>

                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-1">Mot de passe</label>
                     <input
                        type="password"
                        required
                        className="w-full p-4 bg-white border border-stone-200 text-stone-800 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none font-serif font-bold tracking-wide transition-all placeholder:font-sans placeholder:text-stone-300 placeholder:font-normal placeholder:tracking-normal"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                     />
                  </div>

                  <button
                     type="submit"
                     disabled={loading}
                     className="w-full bg-stone-900 hover:bg-black text-amber-50 font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all mt-4 flex justify-center items-center gap-3 group/btn uppercase tracking-widest text-xs"
                  >
                     {loading ? (
                        <div className="animate-spin h-4 w-4 border-2 border-stone-500 border-t-amber-500 rounded-full"></div>
                     ) : (
                        <>
                           <span>{isSignUp ? "Commencer l'Aventure" : "Ouvrir le Grimoire"}</span>
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                           </svg>
                        </>
                     )}
                  </button>

               </form>

               {/* Toggle Login/Signup */}
               <div className="mt-8 pt-8 border-t border-stone-100 flex flex-col items-center gap-2">
                  <p className="text-stone-400 text-xs font-medium">
                     {isSignUp ? "Vous avez déjà un compte ?" : "Première visite ?"}
                  </p>
                  <button
                     type="button"
                     onClick={() => setIsSignUp(!isSignUp)}
                     className="text-amber-700 hover:text-amber-900 font-serif font-bold text-sm tracking-wide border-b-2 border-amber-100 hover:border-amber-300 transition-all pb-0.5"
                  >
                     {isSignUp ? "Se connecter au compte" : "Créer un nouveau profil"}
                  </button>
               </div>

            </div>
         </main>
      </div>
   );
}
