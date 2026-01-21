import { Outlet, Link } from "react-router-dom";

export default function App() {
   return (
      <div className="min-h-screen bg-gray-50 text-gray-900">
         {/* Navbar Temporaire */}
         <nav className="p-4 bg-white shadow-sm flex gap-4">
            <Link to="/" className="font-bold hover:text-blue-600">M&M</Link>
            <Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link>
            <Link to="/login" className="ml-auto text-sm text-gray-500 hover:text-blue-600">Login</Link>
         </nav>

         {/* Zone de contenu dynamique */}
         <main className="container mx-auto p-4">
            <Outlet />
         </main>
      </div>
   );
}
