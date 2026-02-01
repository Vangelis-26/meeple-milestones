import { createClient } from '@supabase/supabase-js';

// Récupération des clés depuis .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Vérification de sécurité pour le développement
if (!supabaseUrl || !supabaseAnonKey) {
   throw new Error('Les variables d\'environnement Supabase (VITE_SUPABASE_...) sont manquantes.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
