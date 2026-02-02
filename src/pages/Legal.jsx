// ==========================================
// PAGE : NOTES LÉGALES & REMERCIEMENTS
// Rôle : Protection IP, Anonymat & Crédits BGG
// ==========================================

import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function Legal() {
   const { hash } = useLocation();

   useEffect(() => {
      if (hash) {
         setTimeout(() => {
            const element = document.getElementById(hash.replace('#', ''));
            if (element) {
               element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
         }, 300);
      } else {
         window.scrollTo(0, 0);
      }
   }, [hash]);

   return (
      <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-20 font-sans px-4 md:px-12">
         <div className="max-w-3xl mx-auto bg-white rounded-[2.5rem] border border-stone-200 shadow-sm p-8 md:p-12 space-y-12 relative overflow-hidden">

            <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')] pointer-events-none"></div>

            {/* HEADER */}
            <div className="text-center space-y-4 border-b border-stone-100 pb-10 relative z-10">
               <h1 className="text-3xl font-serif font-black text-stone-900 tracking-tight uppercase italic">
                  Meeple <span className="text-amber-600">&</span> Milestones
               </h1>
               <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.4em]">Notes Légales • Éthique • Confidentialité</p>
            </div>

            {/* --- 01. L'ÉDITEUR --- */}
            <section className="space-y-3 relative z-10">
               <h2 className="text-xs font-black uppercase tracking-widest text-amber-700">Éditeur du Service</h2>
               <div className="text-sm text-stone-600 leading-relaxed border-l-2 border-stone-100 pl-6">
                  <p>
                     Ce service est un projet personnel indépendant géré sous le nom <strong>Meeple & Milestones</strong>.
                  </p>
               </div>
            </section>

            {/* --- 02. INFRASTRUCTURE --- */}
            <section className="space-y-3 relative z-10">
               <h2 className="text-xs font-black uppercase tracking-widest text-amber-700">Infrastructure</h2>
               <div className="text-sm text-stone-600 leading-relaxed border-l-2 border-amber-100">
                  <p><strong>Interface :</strong> Vercel Inc. (USA).</p>
                  <p><strong>Base de données :</strong> Supabase Inc. (Union Européenne).</p>
               </div>
            </section>

            {/* --- 03. PROTECTION & COPYRIGHT --- */}
            <section className="space-y-3 relative z-10">
               <h2 className="text-xs font-black uppercase tracking-widest text-amber-700">Propriété Intellectuelle</h2>
               <div className="text-sm text-stone-600 leading-relaxed border-l-2 border-amber-100 space-y-4">
                  <p className="font-bold text-stone-900 uppercase tracking-tight">© 2026 Meeple & Milestones. Tous droits réservés.</p>
                  <p>
                     L'architecture logicielle, le design de l'interface et les illustrations originales de progression (grades PNG) sont la propriété exclusive de l'éditeur. Toute reproduction ou tentative de "Reverse Engineering" est interdite.
                  </p>
               </div>
            </section>

            {/* --- 04. REMERCIEMENTS & SOURCES (BGG) --- */}
            <section className="space-y-4 relative z-10">
               <h2 className="text-xs font-black uppercase tracking-widest text-amber-700">Reconnaissance & Sources</h2>
               <div className="text-sm text-stone-600 leading-relaxed border-l-2 border-amber-100 space-y-4">
                  <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                     <p className="mb-3 font-medium text-stone-800">
                        Ce projet ne pourrait exister sans l'incroyable base de données de <strong>BoardGameGeek (BGG)</strong>.
                     </p>
                     <p className="text-xs leading-relaxed mb-4">
                        Nous tenons à exprimer notre profonde gratitude envers l'équipe de BGG et sa communauté mondiale. Toutes les métadonnées de jeux, descriptions et images de couvertures utilisées via leur API restent la propriété exclusive de BoardGameGeek et de leurs auteurs respectifs.
                     </p>
                     <a
                        href="https://boardgamegeek.com"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-700 hover:text-amber-900 transition-colors"
                     >
                        Visiter BoardGameGeek.com <span>↗</span>
                     </a>
                  </div>
                  <p className="text-[10px] text-stone-400 italic">
                     Note : Ce site est un projet de fan indépendant et n'est ni affilié à, ni approuvé par BoardGameGeek.
                  </p>
               </div>
            </section>

            {/* --- 05. CONFIDENTIALITÉ --- */}
            <section className="space-y-3 relative z-10">
               <h2 className="text-xs font-black uppercase tracking-widest text-amber-700">Confidentialité</h2>
               <div className="text-sm text-stone-600 leading-relaxed border-l-2 border-amber-100">
                  <p>L'accès est privé et s'effectue uniquement sur invitation.</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 marker:text-amber-500">
                     <li><strong>Email :</strong> Utilisé uniquement pour sécuriser votre accès.</li>
                     <li><strong>Données :</strong> Aucune cession à des tiers ou usage publicitaire.</li>
                     <li><strong>Maîtrise :</strong> Suppression totale de vos données possible à tout moment.</li>
                  </ul>
               </div>
            </section>

            <div className="pt-10 border-t border-stone-100 text-center relative z-10">
               <Link to="/" className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-300 hover:text-amber-700 transition-colors">
                  ← Retour au Sanctuaire
               </Link>
            </div>

         </div>
      </div>
   );
}
