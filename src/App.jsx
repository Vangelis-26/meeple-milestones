import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

export default function App() {

   return (
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">

         {/* ========================================================= */}
         {/* --- BARRE DE NAVIGATION GLOBALE --- */}
         {/* ========================================================= */}
         <Navbar />

         {/* ========================================================= */}
         {/* --- CONTENU DES PAGES (Via le Router) --- */}
         {/* ========================================================= */}
         <main>
            {/* Outlet affiche le composant de la page actuelle (Home, Dashboard, Login...) */}
            <Outlet />
         </main>

      </div>
   );
}
