import { Outlet } from "react-router-dom";
// On n'importe plus useAuth ici car c'est Navbar qui s'en occupe
import Navbar from "./components/Navbar"; // <--- Import du nouveau composant

export default function App() {
   // Plus besoin de logique auth ici !

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
