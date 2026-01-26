import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Composant décoratif local
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

   // Gestion du mode via le state de navigation
   const location = useLocation();
   const navigate = useNavigate();
   const [isSignUp, setIsSignUp] = useState(false);

   // Mise à jour automatique si on vient de "Créer un compte"
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
      <div className="flex-1 w-full flex flex-col items-center justify-center p-4 relative overflow-hidden">

         {/* --- DÉCOR --- */}
         <div className="fixed inset-0 pointer-events-none">
            <DecorativeMeeple color="#d97706" className="w-96 h-96 -top-20 -left-24 rotate-12" />
            <DecorativeMeeple color="#1e40af" className="w-80 h-80 bottom-0 -right-20 -rotate-12" />
         </div>

         <main className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-100 overflow-hidden animate-in zoom-in-95 duration-300 relative z-10">

            {/* HEADER AMBRÉ (Plus de noir ici !) */}
            <div className="bg-gradient-to-br from-amber-700 to-amber-900 p-8 flex flex-col items-center text-center relative overflow-hidden">

               {/* Texture bois subtile */}
               <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/wood-pattern.png')" }}></div>

               {/* Logo */}
               <div className="w-20 h-20 rounded-full border-4 border-white/20 shadow-lg overflow-hidden bg-white mb-4 relative z-10">
                  <img src="/logo.webp" alt="Logo" className="w-full h-full object-cover" />
               </div>

               <h2 className="text-2xl font-serif font-bold text-amber-50 tracking-wide relative z-10 drop-shadow-md">
                  {isSignUp ? "Rejoignez la Guilde" : "Bon retour, Voyageur"}
               </h2>
               <p className="text-amber-200/80 text-xs font-medium uppercase tracking-widest mt-1 relative z-10">
                  {isSignUp ? "Créez votre profil d'aventurier" : "Accédez à votre ludothèque"}
               </p>
            </div>

            {/* Formulaire */}
            <div className="p-8">
               <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                  {error && (
                     <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                        {error}
                     </div>
                  )}

                  <div>
                     <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5 block ml-1">Email</label>
                     <input
                        type="email"
                        required
                        className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 outline-none font-medium text-stone-700 transition-all"
                        placeholder="exemple@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                     />
                  </div>

                  <div>
                     <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5 block ml-1">Mot de passe</label>
                     <input
                        type="password"
                        required
                        className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500/50 outline-none font-medium text-stone-700 transition-all"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                     />
                  </div>

                  <button
                     type="submit"
                     disabled={loading}
                     className="w-full bg-stone-900 hover:bg-amber-800 text-amber-50 font-serif font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all mt-2 flex justify-center items-center gap-2 group"
                  >
                     {loading ? (
                        <div className="animate-spin h-5 w-5 border-2 border-amber-500 border-t-transparent rounded-full"></div>
                     ) : (
                        <>
                           <span>{isSignUp ? "Commencer le Challenge" : "Ouvrir le Grimoire"}</span>
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                           </svg>
                        </>
                     )}
                  </button>

               </form>

               {/* Toggle Login/Signup */}
               <div className="mt-6 pt-6 border-t border-stone-100 text-center">
                  <p className="text-stone-500 text-sm">
                     {isSignUp ? "Déjà membre ?" : "Nouveau par ici ?"}
                     <button
                        type="button"
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="ml-2 font-serif font-bold text-amber-700 hover:text-amber-900 hover:underline underline-offset-2 transition-colors cursor-pointer"
                     >
                        {isSignUp ? "Se connecter" : "Créer un compte"}
                     </button>
                  </p>
               </div>

            </div>
         </main>
      </div>
   );
}
