import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RequireAuth from './components/RequireAuth';

export const router = createBrowserRouter([
   {
      path: "/",
      element: <App />,
      children: [
         {
            index: true,
            element: <Home />,
         },
         {
            path: "login",
            element: <Login />,
         },
         {
            path: "dashboard",
            element: (
               <RequireAuth>
                  <Dashboard />
               </RequireAuth>
            ),
         },
      ],
   },
]);
