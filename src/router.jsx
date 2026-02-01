import { createBrowserRouter } from 'react-router-dom';

// --- LAYOUT PRINCIPAL ---
import App from './App';
import ProtectedRoute from './components/ProtectedRoute';

// --- PAGES PUBLIQUES ---
import Landing from './pages/Landing';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Legal from './pages/Legal';

// --- PAGES PROTÉGÉES (Nécessitent Connexion) ---
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import GlobalStats from './pages/GlobalStats';
import GameStats from './pages/GameStats';

export const router = createBrowserRouter([
   {
      path: "/",
      element: <App />, // Layout global (Navbar + Footer)
      children: [
         // 1. Routes Publiques
         {
            index: true,
            element: <Landing />
         },
         {
            path: "login",
            element: <Login />
         },
         {
            path: "forgot-password",
            element: <ForgotPassword />
         },
         {
            path: "legal",
            element: <Legal />
         },

         // 2. Routes Sécurisées (Wrapped in ProtectedRoute)
         {
            path: "dashboard",
            element: (
               <ProtectedRoute>
                  <Dashboard />
               </ProtectedRoute>
            ),
         },
         {
            path: "profile",
            element: (
               <ProtectedRoute>
                  <Profile />
               </ProtectedRoute>
            ),
         },
         {
            path: "stats",
            element: (
               <ProtectedRoute>
                  <GlobalStats />
               </ProtectedRoute>
            ),
         },
         {
            path: "game/:id",
            element: (
               <ProtectedRoute>
                  <GameStats />
               </ProtectedRoute>
            ),
         },
      ],
   },
]);
