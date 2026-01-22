// Note : On a enlevé les imports useState, useEffect et supabase car ils ne servent plus ici !

export default function ChallengeGrid({ items, loading, onAddClick }) {

   if (loading) return <div className="text-center py-12 text-gray-500">Chargement...</div>;

   if (items.length === 0) {
      return (
         <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-blue-500">
               <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Ton challenge est vide</h3>
            <p className="text-gray-500 max-w-sm mb-8">Ajoute ton premier jeu pour commencer !</p>

            <button
               onClick={onAddClick}
               className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
               Ajouter un jeu maintenant
            </button>
         </div>
      );
   }

   return (
      <div className="mt-8">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
               <div key={item.game_id} className="bg-white p-4 rounded-lg shadow border flex items-center gap-4">

                  <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center overflow-hidden shrink-0 border border-gray-100">
                     {item.game.thumbnail_url ? (
                        <img src={item.game.thumbnail_url} alt={item.game.name} className="w-full h-full object-cover" />
                     ) : (
                        <span className="text-xs font-bold text-gray-400">IMG</span>
                     )}
                  </div>

                  <div className="flex-1 min-w-0">
                     <h3 className="font-bold text-gray-900 truncate">{item.game.name}</h3>
                     <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                           <span>Progression</span>
                           <span>{item.progress} / {item.target}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                           <div
                              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                              style={{ width: `${(item.progress / item.target) * 100}%` }}
                           ></div>
                        </div>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
}
