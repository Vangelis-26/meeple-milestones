import { ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function TrendChart({ plays }) {
   const chronologicalPlays = [...plays].reverse();
   const data = chronologicalPlays.map((play, index) => {
      const playsSoFar = chronologicalPlays.slice(0, index + 1);
      const winsSoFar = playsSoFar.filter(p => p.is_victory).length;
      return { winRate: Math.round((winsSoFar / playsSoFar.length) * 100) };
   });


   return (
      <div className="w-full h-8 mt-4 opacity-70" style={{ minWidth: '0px', minHeight: '32px' }}>
         <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
               <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#d97706" stopOpacity={0.2} />
                     <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                  </linearGradient>
               </defs>
               <Area
                  type="monotone"
                  dataKey="winRate"
                  stroke="#d97706"
                  strokeWidth={2}
                  fill="url(#goldGradient)"
                  animationDuration={1500}
               />
            </AreaChart>
         </ResponsiveContainer>
      </div>
   );
}
