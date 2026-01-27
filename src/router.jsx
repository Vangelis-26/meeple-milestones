import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import GameStats from './pages/GameStats';
import ProtectedRoute from './components/ProtectedRoute';

export const router = createBrowserRouter([
   {
      path: "/",
      element: <App />, // App contient maintenant la Navbar et l'Outlet
      children: [
         {
            index: true,
            element: <Home />
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
