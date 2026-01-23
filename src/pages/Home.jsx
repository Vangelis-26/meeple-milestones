import { Link } from 'react-router-dom';

export default function Home() {
   return (
      <div className="min-h-[calc(100vh-64px)] bg-paper-texture flex flex-col font-sans text-stone-800">

         <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-12">

            {/* IMAGE TITRE : Placeholder en attendant la nouvelle image */}
            <div className="mb-8 relative z-10 max-w-3xl w-full">
               <img
                  src="/title.webp"
                  alt="Meeple & Milestones"
                  className="w-full h-auto drop-shadow-xl hover:scale-105 transition duration-700 ease-in-out mx-auto"
                  style={{ maxWidth: '600px' }}
               />
            </div>

            {/* CARTE CENTRALE */}
            <div className="card-board max-w-xl w-full p-8 md:p-10 relative z-10 flex flex-col items-center">

               {/* Logo Meeple */}
               <div className="-mt-16 mb-4 w-24 h-24 rounded-full border-4 border-[#fcfaf5] shadow-lg overflow-hidden bg-stone-200">
                  <img src="/meeple.webp" alt="Meeple" className="w-full h-full object-cover" />
               </div>

               {/* TITRE PRINCIPAL */}
               <h2 className="text-4xl font-extrabold text-amber-900 mb-8 font-serif tracking-tight">
                  Challenge 10x10
               </h2>

               {/* SOUS-TITRE : STYLE "WIDGET DASHBOARD" (Version aérée validée) */}
               <div className="mb-10 flex justify-center">
                  <div className="bg-white border border-stone-200 rounded-xl shadow-sm px-2 py-2 flex items-center gap-2">

                     {/* Cartouche 1 : Les Jeux (Gris doux) */}
                     <div className="bg-stone-100 text-stone-700 px-5 py-3 rounded-lg flex flex-col md:flex-row items-baseline gap-2">
                        <span className="text-2xl font-bold font-serif">10</span>
                        <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Jeux différents</span>
                     </div>

                     {/* Séparateur */}
                     <span className="text-stone-300 font-light text-2xl px-1">&times;</span>

                     {/* Cartouche 2 : Les Parties (Ambre doux) */}
                     <div className="bg-amber-50 text-amber-800 px-5 py-3 rounded-lg flex flex-col md:flex-row items-baseline gap-2 border border-amber-100">
                        <span className="text-2xl font-bold font-serif">10</span>
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Parties chacun</span>
                     </div>

                  </div>
               </div>

               <p className="text-lg text-stone-700 mb-8 leading-relaxed">
                  Redécouvrez votre ludothèque. Fixez-vous un objectif simple pour 2026 et suivez votre progression.
               </p>

               <Link
                  to="/login"
                  state={{ mode: 'signup' }}
                  className="w-full bg-amber-600 text-amber-50 text-lg px-8 py-4 rounded-xl font-bold shadow-md border-b-4 border-amber-800 hover:bg-amber-500 hover:border-amber-700 active:border-b-0 active:translate-y-1 transition-all"
               >
                  Commencer l'aventure
               </Link>

            </div>

            {/* Lueur d'ambiance */}
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-100 blur-[150px] opacity-15 rounded-full pointer-events-none -z-0"></div>

         </main>

         <footer className="py-8 text-center text-stone-500 text-sm font-medium font-serif italic">
            © 2026 Meeple & Milestones. Fait avec passion.
         </footer>
      </div>
   );
}
