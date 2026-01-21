import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
   throw new Error('Les variables d\'environnement Supabase (VITE_SUPABASE_...) sont manquantes dans le fichier .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
