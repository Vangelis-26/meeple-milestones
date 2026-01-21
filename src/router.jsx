import { createBrowserRouter } from 'react-router-dom';
import App from './App'; // Ce sera notre Layout principal (Root)
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export const router = createBrowserRouter([
   {
      path: "/",
      element: <App />, // App contient le Layout (Navbar + Outlet)
      // ErrorElement gérera les plantages (404, erreurs API) globalement
      // errorElement: <ErrorPage />, 
      children: [
         {
            index: true, // Correspond au path "/" exact
            element: <Home />,
         },
         {
            path: "login",
            element: <Login />,
         },
         {
            path: "dashboard",
            element: <Dashboard />,
         },
      ],
   },
]);
