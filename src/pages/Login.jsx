import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

export default function Login() {
   const [status, setStatus] = useState('Initialisation...');

   useEffect(() => {
      if (supabase.supabaseUrl) {
         setStatus('✅ Client Supabase initialisé avec succès !');
         console.log('Instance Supabase :', supabase);
      } else {
         setStatus('❌ Problème d\'initialisation.');
      }
   }, []);

   return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
         <h2 className="text-2xl font-bold text-gray-800">Connexion</h2>

         <div className={`p-4 rounded border ${status.includes('✅') ? 'bg-green-100 border-green-400 text-green-800' : 'bg-red-100 border-red-400 text-red-800'}`}>
            {status}
         </div>

         <p className="text-sm text-gray-500">
            (Ouvre la console développeur F12 pour voir l'objet)
         </p>
      </div>
   );
}
