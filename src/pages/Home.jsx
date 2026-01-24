import { Link } from 'react-router-dom';

// Composant SVG Meeple décoratif
const DecorativeMeeple = ({ color, className }) => (
   <svg viewBox="0 0 512 512" className={`absolute opacity-[0.08] pointer-events-none z-0 ${className}`} style={{ fill: color }}>
      <path d="M256 54.99c-27 0-46.418 14.287-57.633 32.23-10.03 16.047-14.203 34.66-15.017 50.962-30.608 15.135-64.515 30.394-91.815 45.994-14.32 8.183-26.805 16.414-36.203 25.26C45.934 218.28 39 228.24 39 239.99c0 5 2.44 9.075 5.19 12.065 2.754 2.99 6.054 5.312 9.812 7.48 7.515 4.336 16.99 7.95 27.412 11.076 15.483 4.646 32.823 8.1 47.9 9.577-14.996 25.84-34.953 49.574-52.447 72.315C56.65 378.785 39 403.99 39 431.99c0 4-.044 7.123.31 10.26.355 3.137 1.256 7.053 4.41 10.156 3.155 3.104 7.017 3.938 10.163 4.28 3.146.345 6.315.304 10.38.304h111.542c8.097 0 14.026.492 20.125-3.43 6.1-3.92 8.324-9.275 12.67-17.275l.088-.16.08-.166s9.723-19.77 21.324-39.388c5.8-9.808 12.097-19.576 17.574-26.498 2.74-3.46 5.304-6.204 7.15-7.754.564-.472.82-.56 1.184-.76.363.2.62.288 1.184.76 1.846 1.55 4.41 4.294 7.15 7.754 5.477 6.922 11.774 16.69 17.574 26.498 11.6 19.618 21.324 39.387 21.324 39.387l.08.165.088.16c4.346 8 6.55 13.323 12.61 17.254 6.058 3.93 11.974 3.45 19.957 3.45H448c4 0 7.12.043 10.244-.304 3.123-.347 6.998-1.21 10.12-4.332 3.12-3.122 3.984-6.997 4.33-10.12.348-3.122.306-6.244.306-10.244 0-28-17.65-53.205-37.867-79.488-17.493-22.74-37.45-46.474-52.447-72.315 15.077-1.478 32.417-4.93 47.9-9.576 10.422-3.125 19.897-6.74 27.412-11.075 3.758-2.168 7.058-4.49 9.81-7.48 2.753-2.99 5.192-7.065 5.192-12.065 0-11.75-6.934-21.71-16.332-30.554-9.398-8.846-21.883-17.077-36.203-25.26-27.3-15.6-61.207-30.86-91.815-45.994-.814-16.3-4.988-34.915-15.017-50.96C302.418 69.276 283 54.99 256 54.99z" />
   </svg>
);

export default function Home() {
   return (
      <div className="h-[calc(100vh-64px)] w-full bg-paper-texture flex flex-col font-sans text-stone-800 relative overflow-hidden justify-center items-center cursor-default selection:bg-amber-200 selection:text-amber-900">

         {/* --- MEEPLES DÉCORATIFS --- */}
         <DecorativeMeeple color="#d97706" className="w-96 h-96 -top-20 -left-24 rotate-12" />
         <DecorativeMeeple color="#1e40af" className="w-80 h-80 bottom-0 -right-20 -rotate-12" />
         <DecorativeMeeple color="#b91c1c" className="w-48 h-48 top-20 right-10 rotate-45 opacity-[0.05]" />
         <DecorativeMeeple color="#15803d" className="w-64 h-64 -bottom-10 left-20 -rotate-6 opacity-[0.05]" />

         <main className="flex-1 w-full flex flex-col items-center justify-center p-4 relative z-10">

            {/* --- LE MONOBLOC --- */}
            <div className="w-full max-w-xl shadow-2xl rounded-3xl overflow-hidden flex flex-col bg-white relative">

               {/* 1. BANNIÈRE IMAGE */}
               <div className="w-full h-60 md:h-72 bg-stone-800 relative">
                  <img
                     src="/title.webp"
                     alt="Meeple & Milestones"
                     className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent"></div>
               </div>

               {/* 2. LE LOGO */}
               <div className="absolute top-44 md:top-56 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="w-32 h-32 rounded-full border-[1px] border-white shadow-lg overflow-hidden bg-white">
                     <img
                        src="/logo.webp"
                        alt="Logo"
                        className="w-full h-full object-cover"
                     />
                  </div>
               </div>

               {/* 3. LE CONTENU BLANC */}
               <div className="bg-white px-8 pt-20 pb-10 flex flex-col items-center text-center">

                  {/* Titres */}
                  <h2 className="text-3xl font-extrabold text-amber-900 font-serif tracking-tight mb-2">
                     Le Challenge 10x10
                  </h2>
                  <p className="text-stone-500 font-medium uppercase tracking-widest text-xs mb-8">
                     Objectif 2026
                  </p>

                  {/* WIDGET STATISTIQUE */}
                  <div className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-4 flex flex-col gap-4 mb-8 shadow-inner relative overflow-hidden">

                     {/* LIGNE DES CHIFFRES */}
                     <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col items-center w-1/3 z-10">
                           <span className="text-3xl font-black text-stone-800 leading-none">10</span>
                           <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mt-1">Jeux</span>
                           <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest">Différents</span>
                        </div>
                        <div className="relative z-20 flex-shrink-0 mx-2">
                           <img
                              src="/token_x.webp"
                              alt="X Token"
                              className="w-16 h-16 object-contain drop-shadow-sm"
                           />
                        </div>
                        <div className="flex flex-col items-center w-1/3 z-10">
                           <span className="text-3xl font-black text-amber-600 leading-none">10</span>
                           <span className="text-[10px] font-bold text-amber-700/60 uppercase tracking-widest mt-1">Parties</span>
                           <span className="text-[8px] font-bold text-amber-700/40 uppercase tracking-widest">Chacun</span>
                        </div>
                     </div>

                     {/* BARRE DE PROGRESSION (Style "Barre de Vie" + Couleurs Validées) */}
                     <div className="w-full mt-2">
                        <div className="h-4 w-full bg-stone-200/80 rounded-full overflow-hidden relative shadow-inner border border-stone-300/50">
                           {/* MODIF COULEUR : Brique (red-700) -> Ambre (amber-500) -> Forêt (green-700) */}
                           <div className="h-full w-[80%] bg-gradient-to-r from-red-700 via-amber-500 to-green-700 relative">
                              {/* Effet de brillance */}
                              <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20"></div>
                           </div>
                           {/* Séparateurs */}
                           <div className="absolute inset-0 flex justify-evenly pointer-events-none">
                              {[...Array(9)].map((_, i) => (
                                 <div key={i} className="w-[1px] h-full bg-white/70"></div>
                              ))}
                           </div>
                        </div>
                        {/* Texte descriptif */}
                        <div className="flex justify-between text-[9px] text-stone-400 font-bold uppercase tracking-wider mt-1 px-1">
                           <span>0%</span>
                           <span className="text-green-700/80">Objectif 100 Parties</span>
                        </div>
                     </div>

                  </div>

                  <p className="text-stone-600 mb-8 leading-relaxed text-base max-w-sm mx-auto">
                     Redonnez vie à votre ludothèque.<br />
                     Un objectif simple, une année de jeu.
                  </p>

                  {/* BOUTON CTA */}
                  <Link
                     to="/login"
                     state={{ mode: 'signup' }}
                     className="w-full bg-amber-600 hover:bg-amber-700 text-white text-lg font-bold py-4 px-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm transition-all duration-200 flex items-center justify-center gap-3"
                  >
                     <span>Commencer l'aventure</span>
                  </Link>

               </div>
            </div>

         </main>

         <footer className="absolute bottom-4 w-full text-center text-stone-400 text-xs font-medium font-serif italic z-10">
            © 2026 Meeple & Milestones.
         </footer>
      </div>
   );
}
