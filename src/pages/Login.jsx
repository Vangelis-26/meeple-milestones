import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Login() {
  // --- HOOKS DE NAVIGATION ---
  const navigate = useNavigate();
  const location = useLocation();

  // --- GESTION DES ÉTATS (STATE) ---
  const [isSignUp, setIsSignUp] = useState(location.state?.mode === 'signup' || false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- SOUMISSION DU FORMULAIRE ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Nettoyage de l'email (minuscule + retrait des espaces invisibles)
    const cleanEmail = email.trim().toLowerCase();

    try {
      if (isSignUp) {
        // =========================================================
        // --- MODE INSCRIPTION (SIGN UP) ---
        // =========================================================
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
        });

        if (error) throw error;
        
        // Si l'inscription a marché (utilisateur ou session créé)
        if (data.user || data.session) {
            navigate('/dashboard'); 
        }

      } else {
        // =========================================================
        // --- MODE CONNEXION (SIGN IN) ---
        // =========================================================
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) throw error;

        // Si la connexion a marché (session créée)
        if (data.session) {
            navigate('/dashboard');
        }
      }

    } catch (err) {
      console.error(err);
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        
        {/* TITRE DYNAMIQUE */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meeple Milestones</h1>
          <p className="text-gray-500">
            {isSignUp 
              ? "Créez votre compte pour démarrer le défi" 
              : "Connectez-vous pour suivre votre progression"}
          </p>
        </div>

        {/* AFFICHAGE DES ERREURS */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-100">
            {error}
          </div>
        )}

        {/* FORMULAIRE */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading 
              ? "Chargement..." 
              : (isSignUp ? "S'inscrire et commencer" : "Se connecter")
            }
          </button>
        </form>

        {/* LIEN DE BASCULE (Toggle) EN BAS */}
        <div className="mt-6 text-center text-sm text-gray-600">
          {isSignUp ? "Déjà un compte ?" : "Pas encore de compte ?"}
          <button
            onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
            }}
            className="ml-2 text-blue-600 font-semibold hover:underline focus:outline-none"
          >
            {isSignUp ? "Se connecter" : "Créer un compte"}
          </button>
        </div>
      </div>
    </div>
  );
}