import { Link } from 'react-router-dom';
import { useAuth } from '../src/hooks/useAuth';

export default function Home() {
   const { user } = useAuth();

   return (
      <div className="w-full flex flex-col items-center justify-center p-4 md:p-8">
         <main className="w-full max-w-xl shadow-2xl rounded-3xl overflow-hidden flex flex-col bg-white relative animate-in zoom-in-95 duration-500 border border-stone-100">

            {/* BANNIÈRE IMAGE : Nette et sans flou */}
            <div className="w-full h-48 md:h-64 bg-stone-800 relative group overflow-hidden">
               <img
                  src="/title.webp"
                  alt="Meeple & Milestones"
                  className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:brightness-110"
               />
               {/* Dégradé réduit pour éviter l'effet de voile sur le contenu */}
               <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
            </div>

            {/* LOGO */}
            <div className="absolute top-32 md:top-48 left-1/2 transform -translate-x-1/2 z-20">
               <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
                  <img src="/logo.webp" alt="Logo" className="w-full h-full object-cover" />
               </div>
            </div>

            {/* CONTENU */}
            <div className="bg-white px-8 pt-20 pb-10 flex flex-col items-center text-center">
               <h2 className="text-4xl font-extrabold text-amber-900 font-serif tracking-tight mb-2">Challenge 10x10</h2>
               <p className="text-stone-400 font-bold uppercase tracking-[0.2em] text-xs mb-8">Objectif 2026</p>

               {/* WIDGET STATISTIQUE ... code inchangé ... */}

               <p className="text-stone-600 mb-8 leading-relaxed font-serif text-lg italic max-w-sm mx-auto">
                  "Plus qu'une collection, une épopée.<br />
                  Sortez vos jeux de l'ombre, relevez le défi."
               </p>

               <Link
                  to={user ? "/dashboard" : "/login"}
                  className="w-full bg-stone-900 hover:bg-amber-700 text-amber-50 text-lg font-serif font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-3 group"
               >
                  <span>{user ? "Ouvrir mon Tableau de Bord" : "Commencer l'Aventure"}</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
               </Link>
            </div>
         </main>
      </div>
   );
}
