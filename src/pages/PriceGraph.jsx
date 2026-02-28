import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

const data = [
  { day: 'Mon', potato: 55, tomato: 120 },
  { day: 'Tue', potato: 58, tomato: 140 },
  { day: 'Wed', potato: 62, tomato: 135 },
  { day: 'Thu', potato: 60, tomato: 150 },
  { day: 'Fri', potato: 65, tomato: 160 },
  { day: 'Sat', potato: 70, tomato: 155 },
  { day: 'Sun', potato: 68, tomato: 170 },
];

const PriceGraph = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-10">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-800 dark:text-white">Price Analytics</h1>
          <p className="text-emerald-600 font-bold flex items-center gap-1 uppercase text-xs tracking-widest mt-2">
            <TrendingUp size={14} /> Market Trends Weekly
          </p>
        </div>
        <div className="bg-emerald-100 dark:bg-emerald-900/40 px-6 py-3 rounded-2xl border border-emerald-200">
           <p className="text-[10px] font-black text-emerald-700 uppercase">Average Hike</p>
           <h4 className="text-xl font-black dark:text-white flex items-center gap-1">+8.4% <ArrowUpRight size={18} className="text-emerald-500" /></h4>
        </div>
      </div>

      <div className="bg-white dark:bg-emerald-900/20 p-8 rounded-[3rem] shadow-2xl border border-emerald-50 dark:border-emerald-800 h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#10b98120" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 'bold'}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 'bold'}} />
            <Tooltip 
              contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: '#fff' }}
              itemStyle={{ fontWeight: '900', color: '#059669' }}
            />
            <Area type="monotone" dataKey="tomato" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorPrice)" />
            <Area type="monotone" dataKey="potato" stroke="#34d399" strokeWidth={4} strokeDasharray="5 5" fill="transparent" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-8">
         <div className="p-6 bg-white dark:bg-emerald-900/20 rounded-3xl border border-emerald-50 dark:border-emerald-800">
            <p className="text-xs font-black text-slate-400 uppercase">Highest Peak</p>
            <h3 className="text-2xl font-black text-emerald-600">Sunday (Rs. 170)</h3>
         </div>
         <div className="p-6 bg-white dark:bg-emerald-900/20 rounded-3xl border border-emerald-50 dark:border-emerald-800">
            <p className="text-xs font-black text-slate-400 uppercase">Stable Item</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">Potato (±Rs. 5)</h3>
         </div>
      </div>
    </motion.div>
  );
};
export default PriceGraph;