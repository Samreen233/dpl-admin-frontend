import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ShoppingBag, Users, Coins } from 'lucide-react';

const Dashboard = () => {
  const cards = [
    { title: "Today's Revenue", val: "Rs. 45,200", icon: <Coins />, color: "bg-emerald-500" },
    { title: "Active Users", val: "1,204", icon: <Users />, color: "bg-green-500" },
    { title: "New Orders", val: "89", icon: <ShoppingBag />, color: "bg-teal-500" },
    { title: "Growth", val: "+14.5%", icon: <TrendingUp />, color: "bg-lime-500" },
  ];

  return (
    <div className="p-10 space-y-10">
      <div className="flex justify-between items-end">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-black text-slate-800 dark:text-white">Dashboard Overview</h1>
          <p className="text-emerald-600 font-medium"></p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((card, i) => (
          <motion.div 
            key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="p-8 bg-white dark:bg-emerald-900/40 rounded-[2.5rem] border border-emerald-50 dark:border-emerald-800 shadow-xl shadow-emerald-100/20"
          >
            <div className={`w-12 h-12 ${card.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg`}>
              {card.icon}
            </div>
            <p className="text-slate-400 dark:text-emerald-300 font-bold uppercase text-xs tracking-widest">{card.title}</p>
            <h3 className="text-3xl font-black mt-2 dark:text-white tracking-tight">{card.val}</h3>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
export default Dashboard;