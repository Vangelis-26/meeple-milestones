import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute'; // Maintenant il existe !
import Footer from './components/Footer';

function App() {
   return (
      <div className="min-h-screen flex flex-col font-sans bg-paper-texture text-stone-800">
         {/* Navbar visible partout */}
         <Navbar />

         {/* Le contenu principal prend tout l'espace restant */}
         <div className="flex-1 flex flex-col">
            <Routes>
               <Route path="/" element={<Home />} />
               <Route path="/login" element={<Login />} />
               <Route
                  path="/dashboard"
                  element={
                     <ProtectedRoute>
                        <Dashboard />
                     </ProtectedRoute>
                  }
               />
            </Routes>
         </div>

         {/* Footer visible partout, collé en bas */}
         <Footer />
      </div>
   );
}

export default App;
