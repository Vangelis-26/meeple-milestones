import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

// Styles globaux
import './index.css';

// Configuration
import { router } from './router';
import { AuthProvider } from './hooks/useAuth';

ReactDOM.createRoot(document.getElementById('root')).render(
   <React.StrictMode>
      {/* 1. AuthProvider : Gère l'état de connexion utilisateur (Session Supabase) */}
      <AuthProvider>
         {/* 2. RouterProvider : Gère la navigation et les URLs */}
         <RouterProvider router={router} />
      </AuthProvider>
   </React.StrictMode>,
);
