import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Landing from './pages/Landing'; // 1. On importe la nouvelle page
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import GameStats from './pages/GameStats';
import GlobalStats from './pages/GlobalStats';
import ProtectedRoute from './components/ProtectedRoute';

export const router = createBrowserRouter([
   {
      path: "/",
      element: <App />,
      children: [
         {
            index: true,
            // 2. On remplace Home par Landing pour tester le rendu
            element: <Landing />
         },
         {
            path: "login",
            element: <Login />
         },
         {
            path: "dashboard",
            element: (
               <ProtectedRoute>
                  <Dashboard />
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
