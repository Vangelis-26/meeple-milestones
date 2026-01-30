/* eslint-disable react-hooks/static-components */
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Landing() {
   const { user } = useAuth();

   const Divider = () => (
      <div className="flex items-center justify-center gap-4 opacity-40 my-8">
         <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-600 to-transparent"></div>
         <span className="text-amber-800 text-[10px] font-serif">♦</span>
         <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-600 to-transparent"></div>
      </div>
   );

   return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col overflow-hidden -mt-16 md:-mt-20 font-sans text-stone-800">

         {/* --- 1. HERO CINÉMATIQUE (Taille ajustée pour l'élégance) --- */}
         <div className="relative h-[75vh] flex items-center justify-center bg-stone-950 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10">
            <img
               src="https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&q=80&w=2000"
               className="absolute inset-0 w-full h-full object-cover opacity-50 blur-[2px] saturate-[0.7] scale-105"
               alt="Atmosphere"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-transparent to-stone-950/95"></div>

            <div className="relative z-20 text-center px-4 max-w-6xl mt-20">
               {/* Titre réduit d'un cran pour plus de finesse */}
               <h1 className="font-serif font-black text-5xl md:text-7xl lg:text-8xl text-stone-100 tracking-tighter mb-8 drop-shadow-2xl">
                  MEEPLE <span className="text-transparent bg-clip-text bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 drop-shadow-sm">&</span> MILESTONES
               </h1>

               <Divider />

               <p className="text-amber-100/90 font-serif italic text-lg md:text-2xl mb-12 tracking-wide max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                  "Ne laissez plus vos victoires s'effacer.<br /> Gravez votre épopée ludique dans le marbre."
               </p>
            </div>
         </div>

         {/* --- 2. LE MANIFESTE 10x10 --- */}
         <div className="relative z-30 -mt-24 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto bg-[#FDFBF7] border-[3px] border-amber-900/10 rounded-[3rem] p-8 md:p-14 text-center shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden">

               <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')] pointer-events-none"></div>

               <div className="relative z-10">
                  <h2 className="font-serif font-black text-3xl md:text-5xl text-stone-900 mb-10 tracking-tight relative inline-block">
                     Le Challenge 10 <span className="text-amber-600 text-2xl md:text-4xl align-middle mx-1">✕</span> 10
                     <svg className="absolute -bottom-4 left-0 w-full h-3 text-amber-500/30" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" /></svg>
                  </h2>

                  <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-20 my-10">
                     <div className="flex flex-col items-center group">
                        <div className="text-6xl md:text-7xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-400 via-amber-600 to-stone-700 drop-shadow-lg">10</div>
                        <p className="font-bold uppercase tracking-[0.2em] text-[10px] text-stone-800">Jeux Élites</p>
                     </div>

                     <div className="hidden md:flex w-12 h-12 border border-amber-700/20 rotate-45 items-center justify-center opacity-40">
                        <div className="w-8 h-8 bg-amber-700/5 border border-amber-700/10"></div>
                     </div>

                     <div className="flex flex-col items-center group">
                        <div className="text-6xl md:text-7xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-400 via-amber-600 to-stone-700 drop-shadow-lg">10</div>
                        <p className="font-bold uppercase tracking-[0.2em] text-[10px] text-stone-800">Maîtrises</p>
                     </div>
                  </div>

                  <p className="text-stone-700 max-w-2xl mx-auto leading-loose font-serif text-base md:text-lg italic opacity-90 mb-12">
                     "Sortez de la consommation éphémère. Le challenge 10x10 n'est pas une liste de courses, c'est un engagement envers votre passion : <strong className="text-amber-700 font-black uppercase tracking-wide">jouer plus, jouer mieux, et ne rien oublier.</strong>
                  </p>

                  {/* --- CTA CENTRAL (MODE SIGNUP POUR LES GUESTS) --- */}
                  <div className="flex justify-center mt-12">
                     {user ? (
                        <Link to="/dashboard" className="group relative px-10 py-5 bg-stone-900 text-amber-50 font-black uppercase tracking-[0.3em] rounded-xl overflow-hidden shadow-2xl hover:shadow-black/20 hover:-translate-y-1 transition-all text-[10px]">
                           Accéder au Dashboard <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                     ) : (
                        <Link to="/login?mode=signup" className="group relative px-12 py-6 bg-gradient-to-br from-amber-500 to-amber-700 text-white font-black uppercase tracking-[0.3em] rounded-xl overflow-hidden shadow-2xl hover:shadow-amber-600/50 hover:-translate-y-1 transition-all text-xs">
                           <span className="relative z-10 flex items-center gap-4">Commencer la Quête <span className="group-hover:translate-x-1 transition-transform">→</span></span>
                        </Link>
                     )}
                  </div>
               </div>
            </div>
         </div>

         {/* --- 3. LES PILIERS --- */}
         <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 relative z-20">
            <FeatureCard icon="⚔️" title="Le Tableau de Bord" desc="Pilotez votre progression 10x10, gérez votre ludothèque et planifiez vos sessions." />
            <FeatureCard icon="📜" title="Les Chroniques" desc="Transformez des données en souvenirs. Chaque partie devient un récit illustré." />
            <FeatureCard icon="👑" title="Rangs de Légende" desc="Grimpez les échelons et débloquez des titres honorifiques prestigieux." />
         </div>
      </div>
   );
}

function FeatureCard({ icon, title, desc }) {
   return (
      <div className="group p-8 bg-white border border-stone-100 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col items-center text-center">
         <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner border border-stone-50 group-hover:bg-amber-50 transition-colors">
            {icon}
         </div>
         <h3 className="font-serif font-black text-sm text-stone-900 mb-3 uppercase tracking-tight">{title}</h3>
         <p className="text-stone-500 leading-relaxed italic text-xs">{desc}</p>
      </div>
   );
}
