import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit, UserPlus, Search } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Zeeshan Ali', email: 'zeeshan@example.com', status: 'Active' },
    { id: 2, name: 'Ibrahim Khan', email: 'ibrahim@example.com', status: 'Inactive' },
  ]);

  const deleteUser = (id) => setUsers(users.filter(u => u.id !== id));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-800 dark:text-white">Users</h1>
          <p className="text-emerald-600 font-medium">Manage your platform members</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-emerald-500/20"
        >
          <UserPlus size={20} /> Add New User
        </motion.button>
      </div>

      <div className="bg-white dark:bg-emerald-900/20 rounded-[2.5rem] shadow-2xl border border-emerald-50 dark:border-emerald-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-emerald-50 dark:bg-emerald-900/50">
            <tr>
              <th className="px-8 py-5 text-emerald-800 dark:text-emerald-300 font-black uppercase text-xs tracking-widest">User Details</th>
              <th className="px-8 py-5 text-emerald-800 dark:text-emerald-300 font-black uppercase text-xs tracking-widest">Status</th>
              <th className="px-8 py-5 text-emerald-800 dark:text-emerald-300 font-black uppercase text-xs tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50 dark:divide-emerald-800">
            <AnimatePresence>
              {users.map((u) => (
                <motion.tr 
                  key={u.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }}
                  className="hover:bg-emerald-50/30 dark:hover:bg-emerald-800/20 transition-colors"
                >
                  <td className="px-8 py-6">
                    <p className="font-black text-slate-800 dark:text-white">{u.name}</p>
                    <p className="text-slate-400 text-sm">{u.email}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase ${u.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right space-x-2">
                    <button className="p-3 text-emerald-600 bg-emerald-50 dark:bg-emerald-800 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"><Edit size={18} /></button>
                    <button onClick={() => deleteUser(u.id)} className="p-3 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18} /></button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Users;