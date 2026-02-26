import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Key, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // 1. Import Navigate

const Admins = () => {
  const navigate = useNavigate(); // 2. Initialize hook

  const admins = [
    { id: 1, name: 'Super Admin', email: 'root@charsadda.gov', level: 'Super' },
    { id: 2, name: 'District Editor', email: 'editor1@charsadda.gov', level: 'Editor' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-10">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">Admin Personnel</h1>
        <div className="mt-2 flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-900/30 w-fit px-4 py-1 rounded-full text-xs uppercase tracking-tighter">
          <ShieldCheck size={14} /> Restricted Area
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {admins.map((admin, i) => (
          <motion.div 
            key={admin.id} 
            whileHover={{ y: -10 }}
            className="bg-white dark:bg-emerald-900/40 p-8 rounded-[3rem] border border-emerald-100 dark:border-emerald-800 shadow-xl shadow-emerald-200/20 flex flex-col"
          >
            <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-500/40">
              {admin.level === 'Super' ? <Key size={24} /> : <ShieldAlert size={24} />}
            </div>
            
            <h3 className="text-xl font-black dark:text-white">{admin.name}</h3>
            <p className="text-slate-400 text-sm mb-6">{admin.email}</p>
            
            <div className="flex gap-2 mt-auto">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                // 3. Navigate to the edit rights page with the specific admin ID
                onClick={() => navigate(`/admins/edit-rights/${admin.id}`)}
                className="flex-1 py-3 bg-emerald-50 dark:bg-emerald-800/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase rounded-xl hover:bg-emerald-600 hover:text-white transition-all tracking-widest border border-emerald-100 dark:border-emerald-700"
              >
                Edit Rights
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-100 dark:border-red-900/30"
              >
                <Trash2 size={18} />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Admins;