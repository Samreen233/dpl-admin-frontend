import React from 'react';
import { motion } from 'framer-motion';

const UpdatePrice = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto p-10"
    >
      <div className="bg-white dark:bg-emerald-900/20 p-12 rounded-[3.5rem] shadow-2xl border border-emerald-100 dark:border-emerald-800">
        <div className="flex justify-between items-center mb-12 border-b-4 border-emerald-600 pb-8">
            <div className="text-left">
                <p className="text-emerald-600 font-black text-xl">DISTRICT CHARSADDA</p>
                <p className="text-slate-400 font-bold">Food Department Office</p>
            </div>
            <h1 className="text-4xl font-black text-right dark:text-white" dir="rtl">نرخنامہ برائے فریش سبزی</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {[1, 2].map((col) => (
                <div key={col} className="space-y-4">
                    <div className="grid grid-cols-4 font-black text-xs text-emerald-700 dark:text-emerald-400 uppercase text-center bg-emerald-50 dark:bg-emerald-900/50 p-4 rounded-2xl">
                        <span>Rate G-2</span>
                        <span>Rate G-1</span>
                        <span className="col-span-2 text-right">Item Name</span>
                    </div>
                    {[1,2,3,4,5].map((i) => (
                        <motion.div whileHover={{ scale: 1.02 }} key={i} className="grid grid-cols-4 items-center bg-white dark:bg-emerald-800/40 p-3 rounded-2xl border border-emerald-50 dark:border-emerald-700 shadow-sm">
                            <input type="text" className="w-16 bg-emerald-50 dark:bg-emerald-950 p-2 rounded-xl text-center font-bold" placeholder="00" />
                            <input type="text" className="w-16 bg-emerald-50 dark:bg-emerald-950 p-2 rounded-xl text-center font-bold" placeholder="00" />
                            <span className="col-span-2 text-right font-black text-slate-700 dark:text-emerald-100 pr-4">آلو سفید (Potato)</span>
                        </motion.div>
                    ))}
                </div>
            ))}
        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="w-full mt-12 py-6 bg-emerald-600 text-white font-black text-2xl rounded-[2rem] shadow-2xl shadow-emerald-500/40 tracking-tight"
        >
          PUBLISH OFFICIAL PRICE LIST
        </motion.button>
      </div>
    </motion.div>
  );
};
export default UpdatePrice;