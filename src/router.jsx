import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
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
            path: "profile",
            element: (
               <ProtectedRoute>
                  <Profile />
               </ProtectedRoute>
            ),
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
