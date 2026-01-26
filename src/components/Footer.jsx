export default function Footer() {
   return (
      <footer className="w-full text-center py-8 mt-auto border-t border-stone-200/50">
         <div className="flex flex-col items-center gap-2">
            <p className="text-stone-400 text-xs font-serif italic">
               © 2026 Meeple & Milestones.
            </p>
            <p className="text-[10px] text-stone-400 font-medium uppercase tracking-widest">
               Conçu & Développé par{' '}
               <a
                  href="https://github.com/Vangelis-26"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-600 hover:text-amber-800 transition-colors font-bold"
               >
                  Vangelis26
               </a>
            </p>
         </div>
      </footer>
   );
}
