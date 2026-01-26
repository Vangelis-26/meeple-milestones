import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Footer from '../components/Footer';

const DecorativeMeeple = ({ color, className }) => (
   <svg viewBox="0 0 512 512" className={`absolute opacity-[0.08] pointer-events-none z-0 ${className}`} style={{ fill: color }}>
      <path d="M256 54.99c-27 0-46.418 14.287-57.633 32.23-10.03 16.047-14.203 34.66-15.017 50.962-30.608 15.135-64.515 30.394-91.815 45.994-14.32 8.183-26.805 16.414-36.203 25.26C45.934 218.28 39 228.24 39 239.99c0 5 2.44 9.075 5.19 12.065 2.754 2.99 6.054 5.312 9.812 7.48 7.515 4.336 16.99 7.95 27.412 11.076 15.483 4.646 32.823 8.1 47.9 9.577-14.996 25.84-34.953 49.574-52.447 72.315C56.65 378.785 39 403.99 39 431.99c0 4-.044 7.123.31 10.26.355 3.137 1.256 7.053 4.41 10.156 3.155 3.104 7.017 3.938 10.163 4.28 3.146.345 6.315.304 10.38.304h111.542c8.097 0 14.026.492 20.125-3.43 6.1-3.92 8.324-9.275 12.67-17.275l.088-.16.08-.166s9.723-19.77 21.324-39.388c5.8-9.808 12.097-19.576 17.574-26.498 2.74-3.46 5.304-6.204 7.15-7.754.564-.472.82-.56 1.184-.76.363.2.62.288 1.184.76 1.846 1.55 4.41 4.294 7.15 7.754 5.477 6.922 11.774 16.69 17.574 26.498 11.6 19.618 21.324 39.387 21.324 39.387l.08.165.088.16c4.346 8 6.55 13.323 12.61 17.254 6.058 3.93 11.974 3.45 19.957 3.45H448c4 0 7.12.043 10.244-.304 3.123-.347 6.998-1.21 10.12-4.332 3.12-3.122 3.984-6.997 4.33-10.12.348-3.122.306-6.244.306-10.244 0-28-17.65-53.205-37.867-79.488-17.493-22.74-37.45-46.474-52.447-72.315 15.077-1.478 32.417-4.93 47.9-9.576 10.422-3.125 19.897-6.74 27.412-11.075 3.758-2.168 7.058-4.49 9.81-7.48 2.753-2.99 5.192-7.065 5.192-12.065 0-11.75-6.934-21.71-16.332-30.554-9.398-8.846-21.883-17.077-36.203-25.26-27.3-15.6-61.207-30.86-91.815-45.994-.814-16.3-4.988-34.915-15.017-50.96C302.418 69.276 283 54.99 256 54.99z" />
   </svg>
);

export default function Home() {
   const { user } = useAuth();

   return (
      <div className="min-h-[calc(100vh-64px)] w-full bg-paper-texture flex flex-col font-sans text-stone-800 relative overflow-y-auto selection:bg-amber-200 selection:text-amber-900">

         {/* --- DÉCOR --- */}
         <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <DecorativeMeeple color="#d97706" className="w-96 h-96 -top-20 -left-24 rotate-12" />
            <DecorativeMeeple color="#1e40af" className="w-80 h-80 bottom-0 -right-20 -rotate-12" />
            <DecorativeMeeple color="#b91c1c" className="w-48 h-48 top-20 right-10 rotate-45 opacity-[0.05]" />
            <DecorativeMeeple color="#15803d" className="w-64 h-64 -bottom-10 left-20 -rotate-6 opacity-[0.05]" />
         </div>

         {/* --- CONTENU --- */}
         <main className="flex-1 w-full flex flex-col items-center justify-center p-4 md:p-8 relative z-10">

            <div className="w-full max-w-xl shadow-2xl rounded-3xl overflow-hidden flex flex-col bg-white relative animate-in zoom-in-95 duration-500 border border-stone-100">

               {/* 1. BANNIÈRE IMAGE (Fix du survol) */}
               <div className="w-full h-48 md:h-64 bg-stone-800 relative group overflow-hidden">
                  <img
                     src="/title.webp"
                     alt="Meeple & Milestones"
                     // Modification ici : Suppression de 'scale' et ajout de 'group-hover:brightness-110'
                     className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:brightness-110"
                  />
                  {/* Le dégradé reste parfaitement fixe au-dessus */}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
               </div>

               {/* 2. LOGO */}
               <div className="absolute top-32 md:top-48 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
                     <img src="/logo.webp" alt="Logo" className="w-full h-full object-cover" />
                  </div>
               </div>

               {/* 3. CONTENU */}
               <div className="bg-white px-8 pt-20 pb-10 flex flex-col items-center text-center">

                  <h2 className="text-4xl font-extrabold text-amber-900 font-serif tracking-tight mb-2">
                     Challenge 10x10
                  </h2>
                  <p className="text-stone-400 font-bold uppercase tracking-[0.2em] text-xs mb-8">
                     Objectif 2026
                  </p>

                  {/* WIDGET STATISTIQUE */}
                  <div className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-5 flex flex-col gap-5 mb-8 shadow-inner relative overflow-hidden group hover:border-amber-200 transition-colors">

                     <div className="flex items-center justify-between w-full px-2">
                        <div className="flex flex-col items-center z-10">
                           <span className="text-3xl font-black text-stone-800 leading-none">10</span>
                           <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mt-1">Jeux Uniques</span>
                        </div>

                        <div className="relative z-20 shrink-0 mx-2 transform group-hover:rotate-12 transition-transform duration-300">
                           <img src="/token_x.webp" alt="X Token" className="w-14 h-14 object-contain drop-shadow-sm" />
                        </div>

                        <div className="flex flex-col items-center z-10">
                           <span className="text-3xl font-black text-amber-600 leading-none">10</span>
                           <span className="text-[9px] font-bold text-amber-700/60 uppercase tracking-widest mt-1">Parties Chacun</span>
                        </div>
                     </div>

                     {/* Progress Bar (Exemple 42%) */}
                     <div className="w-full relative">
                        <div className="h-4 w-full bg-stone-200/80 rounded-full overflow-hidden relative border border-stone-300/50">
                           <div className="h-full bg-gradient-to-r from-amber-500 to-amber-600 relative animate-pulse" style={{ width: '42%' }}>
                              <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20"></div>
                           </div>
                           <div className="absolute inset-0 flex justify-evenly pointer-events-none">
                              {[...Array(9)].map((_, i) => (
                                 <div key={i} className="w-[1px] h-full bg-white/60"></div>
                              ))}
                           </div>
                        </div>

                        <div className="flex justify-between text-[9px] text-stone-400 font-bold uppercase tracking-wider mt-1.5 px-1">
                           <span>Début de l'aventure</span>
                           <span className="text-amber-700/80">Cible : 100 Parties</span>
                        </div>
                     </div>
                  </div>

                  {/* NOUVELLE PHRASE D'ACCROCHE (Option A - Pile de la honte / Défi) */}
                  <p className="text-stone-600 mb-8 leading-relaxed font-serif text-lg italic max-w-sm mx-auto">
                     "Plus qu'une collection, une épopée.<br />
                     Sortez vos jeux de l'ombre, relevez le défi."
                  </p>

                  {/* BOUTON CTA */}
                  <Link
                     to={user ? "/dashboard" : "/login"}
                     state={user ? null : { mode: 'signup' }}
                     className="w-full bg-stone-900 hover:bg-amber-700 text-amber-50 text-lg font-serif font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0 active:shadow-sm transition-all duration-300 flex items-center justify-center gap-3 group"
                  >
                     <span>{user ? "Ouvrir mon Tableau de Bord" : "Commencer l'Aventure"}</span>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                     </svg>
                  </Link>

               </div>
            </div>
         </main>
      </div>
   );
}
