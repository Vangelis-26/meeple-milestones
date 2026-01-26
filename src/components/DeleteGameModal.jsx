export default function DeleteGameModal({ isOpen, game, onClose, onConfirm }) {
   if (!isOpen || !game) return null;

   return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
         <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

         <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 p-6 flex flex-col items-center text-center border border-stone-200">

            {/* Icône Danger Thématique */}
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 border-2 border-red-100 shadow-inner">
               <span className="text-3xl">🔥</span>
            </div>

            <h3 className="text-2xl font-serif font-extrabold text-stone-900 mb-2">
               Brûler ce parchemin ?
            </h3>

            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 text-left shadow-sm">
               <p className="text-sm text-red-900 font-bold mb-2 font-serif">
                  ⚠️ Une décision irrévocable
               </p>
               <p className="text-xs text-red-800/80 leading-relaxed">
                  Voyageur, en retirant <span className="font-bold text-red-900">"{game.name}"</span> de votre quête, vous condamnerez toutes les parties et souvenirs associés à l'oubli éternel.
                  <br /><br />
                  <span className="italic">Les archives seront détruites et ne pourront être restaurées.</span>
               </p>
            </div>

            <div className="flex gap-3 w-full">
               <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 font-bold rounded-xl transition-colors text-sm uppercase tracking-wide"
               >
                  Garder le jeu
               </button>
               <button
                  onClick={onConfirm}
                  className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-sm uppercase tracking-wide flex items-center justify-center gap-2 group"
               >
                  <span>Invoquer l'oubli</span>
               </button>
            </div>
         </div>
      </div>
   );
}
