import React, { useState } from "react";
import { motion } from "framer-motion";
import { Save, Calendar, ShieldCheck } from "lucide-react";

const DailyPrices = () => {
  const [prices, setPrices] = useState([
    { id: 1, urdu: "آلو سفید", name: "Potato", g1: "60", g2: "55" },
    { id: 2, urdu: "پیاز", name: "Onion", g1: "120", g2: "110" },
    { id: 3, urdu: "ٹماٹر", name: "Tomato", g1: "150", g2: "130" },
    { id: 4, urdu: "ادرک", name: "Ginger", g1: "400", g2: "380" },
  ]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-10 max-w-5xl mx-auto"
    >
      <div className="bg-white dark:bg-emerald-900/20 rounded-[3rem] shadow-2xl border border-emerald-100 dark:border-emerald-800 p-10">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-10 border-b-4 border-emerald-600 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
              OFFICIAL NIRKH NAMA
            </h1>
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
              <Calendar size={14} /> {new Date().toLocaleDateString()}
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-black dark:text-white" dir="rtl">
              ضلع چارسدہ نرخنامہ
            </h2>
            <p className="text-[10px] text-emerald-600 font-bold">
              FOOD DEPARTMENT CONTROL PANEL
            </p>
          </div>
        </div>

        {/* Table Headings */}
        <div className="grid grid-cols-4 gap-4 mb-4 px-6 text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-500 tracking-tighter">
          <span className="text-center">Rate Grade 2</span>
          <span className="text-center">Rate Grade 1</span>
          <span className="col-span-2 text-right pr-4">Item Name (اردو)</span>
        </div>

        {/* Price Inputs */}
        <div className="space-y-3">
          {prices.map((item, i) => (
            <motion.div
              key={item.id}
              whileHover={{ x: 10 }}
              className="grid grid-cols-4 gap-4 items-center bg-emerald-50/50 dark:bg-emerald-950/40 p-4 rounded-2xl border border-transparent hover:border-emerald-200 transition-all"
            >
              <input
                type="number"
                defaultValue={item.g2}
                className="w-full bg-white dark:bg-emerald-900 p-3 rounded-xl text-center font-bold text-emerald-600 outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="number"
                defaultValue={item.g1}
                className="w-full bg-white dark:bg-emerald-900 p-3 rounded-xl text-center font-bold text-emerald-600 outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <div className="col-span-2 text-right pr-4">
                <p className="font-black text-slate-800 dark:text-white text-lg">
                  {item.urdu}
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  {item.name}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-10 py-6 bg-emerald-600 text-white font-black text-xl rounded-3xl shadow-xl shadow-emerald-500/40 flex items-center justify-center gap-3"
        >
          <Save size={24} /> UPDATE DAILY PRICE LIST
        </motion.button>
      </div>
    </motion.div>
  );
};
export default DailyPrices;
