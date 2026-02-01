import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function Legal() {
   const { hash } = useLocation();

   useEffect(() => {
      // Si un ancrage est présent (#privacy, #cookies...), on scroll vers lui
      if (hash) {
         setTimeout(() => {
            const element = document.getElementById(hash.replace('#', ''));
            if (element) {
               element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
         }, 300); // Délai pour assurer le chargement du DOM
      } else {
         // Sinon, on remonte tout en haut
         window.scrollTo(0, 0);
      }
   }, [hash]);

   return (
      <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-20 font-sans px-4 md:px-12">
         <div className="max-w-4xl mx-auto bg-white rounded-[2rem] border border-stone-200 shadow-sm p-8 md:p-16 space-y-12">

            {/* EN-TÊTE */}
            <div className="text-center space-y-6 border-b border-stone-100 pb-10">
               <h1 className="text-3xl md:text-5xl font-serif font-black text-stone-900 tracking-tight">Mentions Légales</h1>
               <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">Mise à jour : Janvier 2026</p>
               <p className="text-xs text-stone-500 italic max-w-2xl mx-auto">
                  Conformément aux dispositions des Articles 6-III et 19 de la Loi n°2004-575 du 21 juin 2004 pour la Confiance dans l'Économie Numérique (LCEN).
               </p>
            </div>

            {/* --- 1. ÉDITEUR --- */}
            <section id="editor" className="space-y-4 scroll-mt-40">
               <h2 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-3">
                  <span className="text-amber-600">01.</span> Éditeur du Service
               </h2>
               <div className="text-sm text-stone-600 space-y-4 leading-relaxed pl-8 border-l-2 border-stone-100">
                  <p>Le présent site est édité à titre personnel par :</p>

                  <p className="font-bold text-stone-800 bg-stone-50 inline-block px-2 py-1 rounded border border-stone-200 text-xs">
                     [IDENTITÉ DE L'ÉDITEUR]
                  </p>

                  <p>
                     <strong>Contact :</strong> <span className="text-stone-400 italic">[Adresse E-mail de contact]</span>
                  </p>

                  <div className="bg-stone-50 p-4 rounded-lg border border-stone-100 mt-4 text-xs text-stone-500 text-justify">
                     <span className="font-bold text-stone-700">Clause d'Anonymat (LCEN) :</span>
                     <br />
                     Conformément à l'article 6, III, 2 de la loi 2004-575 du 21 juin 2004, l'éditeur (personne physique) a choisi de ne pas divulguer publiquement ses coordonnées personnelles. Ces éléments d'identification ont été communiqués de manière exacte et complète à l'hébergeur du service.
                  </div>
               </div>
            </section>

            {/* --- 2. HÉBERGEMENT --- */}
            <section id="hosting" className="space-y-4 scroll-mt-40">
               <h2 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-3">
                  <span className="text-amber-600">02.</span> Hébergement
               </h2>
               <div className="text-sm text-stone-600 space-y-2 leading-relaxed pl-8 border-l-2 border-stone-100">
                  <p>Le prestataire assurant le stockage direct et permanent est :</p>

                  <div className="font-medium text-stone-800 bg-stone-50 p-4 rounded border border-stone-200 text-xs">
                     <p className="font-bold text-stone-400 italic mb-2">[INFORMATIONS À COMPLÉTER LORS DU DÉPLOIEMENT]</p>
                     <p><strong>Nom de l'Hébergeur :</strong> (Ex: Vercel Inc.)</p>
                     <p><strong>Adresse :</strong> (Ex: 340 S Lemon Ave, Walnut, CA 91789)</p>
                     <p><strong>Site web :</strong> (Ex: https://vercel.com)</p>
                  </div>

                  <p className="mt-2 text-xs">Gestion des bases de données : <strong>Supabase</strong> (Hébergé en Union Européenne).</p>
               </div>
            </section>

            {/* --- 3. PROPRIÉTÉ INTELLECTUELLE --- */}
            <section id="ip" className="space-y-4 scroll-mt-40">
               <h2 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-3">
                  <span className="text-amber-600">03.</span> Propriété Intellectuelle
               </h2>
               <div className="text-sm text-stone-600 space-y-4 leading-relaxed pl-8 border-l-2 border-stone-100">
                  <p><strong>Création :</strong> L'architecture technique, le code source (React/Tailwind), et la charte graphique sont la propriété exclusive de l'éditeur.</p>
                  <div className="space-y-2">
                     <p className="font-bold text-stone-800">Données Tiers (BoardGameGeek) :</p>
                     <p>Ce service utilise l'API publique de BoardGameGeek. Les métadonnées textuelles des jeux restent la propriété de BoardGameGeek LLC et de ses contributeurs.</p>
                  </div>
               </div>
            </section>

            {/* --- 4. RGPD & DONNÉES --- */}
            <section id="privacy" className="space-y-4 scroll-mt-40">
               <h2 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-3">
                  <span className="text-amber-600">04.</span> Protection des Données (RGPD)
               </h2>
               <div className="text-sm text-stone-600 space-y-3 leading-relaxed pl-8 border-l-2 border-stone-100">
                  <p>Le site applique le principe de minimisation des données (Article 5 du RGPD).</p>
                  <ul className="list-disc pl-5 space-y-2 marker:text-amber-500">
                     <li><strong>Responsable du traitement :</strong> L'éditeur du site.</li>
                     <li><strong>Données collectées :</strong> Adresse E-mail (Identifiant), Mot de passe (Chiffré), Données de jeu.</li>
                     <li><strong>Finalité :</strong> Fonctionnement technique du "Tracker". Aucune utilisation commerciale.</li>
                     <li><strong>Droits :</strong> Droit d'accès, de rectification et d'effacement (via le Profil).</li>
                  </ul>
               </div>
            </section>

            {/* --- 5. COOKIES --- */}
            <section id="cookies" className="space-y-4 scroll-mt-40">
               <h2 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-3">
                  <span className="text-amber-600">05.</span> Cookies & Traceurs
               </h2>
               <div className="text-sm text-stone-600 space-y-2 leading-relaxed pl-8 border-l-2 border-stone-100">
                  <p>Ce site est <strong>exempté de bandeau cookie</strong> (Recommandation CNIL) car il n'utilise aucun traceur publicitaire.</p>
                  <p>Seuls des identifiants de session technique (Local Storage) sont utilisés.</p>
               </div>
            </section>

            <div className="pt-12 mt-12 border-t border-stone-100 text-center">
               <Link to="/" className="group inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors">
                  <span>←</span>
                  <span className="group-hover:underline decoration-amber-500 underline-offset-4">Retour au Sanctuaire</span>
               </Link>
            </div>

         </div>
      </div>
   );
}
