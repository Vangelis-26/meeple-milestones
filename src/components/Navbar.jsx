// =================================================================================
// COMPOSANT : NAVBAR
// Rôle : Navigation principale, responsive, avec menu "Archives" dynamique.
// =================================================================================

import { useEffect, useLayoutEffect, useState, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
   // --- HOOKS & ÉTATS ---
   const location = useLocation();
   const { user, signOut } = useAuth();

   const [games, setGames] = useState([]); // Liste des jeux pour le dropdown
   const [isOpen, setIsOpen] = useState(false); // Menu Desktop
   const [isMobileOpen, setIsMobileOpen] = useState(false); // Menu Mobile

   const menuRef = useRef(null); // Pour détecter le clic en dehors

   // --- EFFETS ---

   // 1. Fermeture au clic en dehors
   useEffect(() => {
      const handleClickOutside = (event) => {
         if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsOpen(false);
            setIsMobileOpen(false);
         }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
   }, []);

   // 2. Fermeture au changement de page
   useLayoutEffect(() => {
      setIsOpen(false);
      setIsMobileOpen(false);
   }, [location.pathname]);

   // 3. Récupération des jeux (Pour le menu Archives)
   const fetchUserGames = useCallback(async () => {
      if (!user) return;
      try {
         // On récupère le challenge actif
         const { data: challengeData } = await supabase
            .from('challenges').select('id').eq('user_id', user.id).maybeSingle();

         if (!challengeData) return;

         // On récupère les jeux liés
         const { data: itemsData } = await supabase
            .from('challenge_items')
            .select(`game_id, progress, games ( id, name, thumbnail_url )`)
            .eq('challenge_id', challengeData.id);

         if (!itemsData) return;

         // Formatage
         const formattedGames = itemsData
            .filter(item => item.games)
            .map(item => ({
               id: item.games.id,
               name: item.games.name,
               thumb: item.games.thumbnail_url,
               playCount: item.progress || 0
            }));

         setGames(formattedGames.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {
         console.error("Erreur chargement navbar:", error);
      }
   }, [user]);

   // 4. Abonnement aux mises à jour globales (Déclenché par useChallenge)
   useEffect(() => {
      let isMounted = true;

      // Chargement initial
      fetchUserGames().catch(err => { if (isMounted) console.error(err); });

      // Écouteur d'événement custom
      const handleUpdate = () => { fetchUserGames().catch(console.error); };
      window.addEventListener('challengeUpdated', handleUpdate);

      return () => {
         isMounted = false;
         window.removeEventListener('challengeUpdated', handleUpdate);
      };
   }, [fetchUserGames]);

   // --- RENDU ---
   return (
      <nav ref={menuRef} className="fixed top-0 left-0 w-full z-[100] bg-[#FDFBF7]/95 backdrop-blur-xl border-b border-stone-200/60 shadow-sm transition-all duration-300 font-sans">

         <div className="max-w-[90rem] mx-auto px-4 md:px-12 py-3 sm:py-4 grid grid-cols-[48px_1fr_48px] lg:flex lg:items-center lg:justify-between items-center">

            {/* Spacer Mobile Gauche (Équilibre visuel) */}
            <div className="lg:hidden" aria-hidden="true"></div>

            {/* 1. LOGO & IDENTITÉ */}
            <div className="flex justify-center lg:justify-start relative z-[120]">
               <Link to="/" className="flex flex-col items-center lg:items-start lg:flex-row lg:gap-5 group">
                  <div className="relative w-11 h-11 lg:w-16 lg:h-16 transition-transform duration-500 group-hover:scale-105">
                     <img src="/logo.png" alt="Sceau" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex flex-col items-center lg:items-start mt-1.5 lg:mt-0
