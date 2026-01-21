import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState(null);

   const { signIn } = useAuth();
   const navigate = useNavigate();

   const handleSubmit = async (e) => {
      e.preventDefault();
      setError(null);

      try {
         const { error } = await signIn({ email, password });

         if (error) throw error;

         navigate("/dashboard");

      } catch (error) {
         setError("Erreur : " + error.message);
      }
   };

   return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
         <div className="bg-white p-8 rounded shadow-md w-full max-w-sm border">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Connexion</h2>

            {error && (
               <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                  {error}
               </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                     type="email"
                     required
                     className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                  />
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                  <input
                     type="password"
                     required
                     className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                  />
               </div>

               <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition"
               >
                  Se connecter
               </button>
            </form>
         </div>
      </div>
   );
}
