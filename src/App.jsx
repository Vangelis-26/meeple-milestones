import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

export default function App() {
   return (
      <div className="min-h-screen bg-paper-texture font-sans text-stone-800">
         <Navbar />
         <main>
            {/* C'est ici que le Router va injecter Home, Login ou Dashboard */}
            <Outlet />
         </main>
      </div>
   );
}
