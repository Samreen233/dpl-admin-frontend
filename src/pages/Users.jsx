import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, X } from 'lucide-react';
import api from '../api/axios'; 

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ full_name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users'); // fetch existing users
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // call fetchUsers on mount
  React.useEffect(() => { fetchUsers(); }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // POST request to backend to create user
      const res = await api.post('/users', newUser); 
      setUsers([...users, res.data]); // add returned user to state
      setNewUser({ full_name: '', email: '', password: '' });
      setIsModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="p-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-800 dark:text-white">Users</h1>
          <p className="text-emerald-600 font-medium">Manage platform members</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-emerald-500/20"
        >
          <UserPlus size={20} /> Add New User
        </motion.button>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-emerald-900/20 rounded-[2.5rem] shadow-2xl border border-emerald-50 dark:border-emerald-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-emerald-50 dark:bg-emerald-900/50">
            <tr>
              <th className="px-8 py-5 text-emerald-800 dark:text-emerald-300 font-black uppercase text-xs tracking-widest">User Details</th>
              <th className="px-8 py-5 text-emerald-800 dark:text-emerald-300 font-black uppercase text-xs tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="hover:bg-emerald-50/30 dark:hover:bg-emerald-800/20 transition-colors">
                <td className="px-8 py-6">
                  <p className="font-black text-slate-800 dark:text-white">{u.full_name}</p>
                  <p className="text-slate-400 text-sm">{u.email}</p>
                </td>
                <td className="px-8 py-6 text-right">
                  {/* Actions like delete/edit */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
              className="bg-white dark:bg-emerald-900/80 rounded-2xl p-10 w-full max-w-lg shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-slate-800 dark:text-white">Add New User</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-red-500 dark:text-red-400 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20 transition-all">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddUser} className="space-y-4">
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={newUser.full_name}
                  onChange={e => setNewUser({ ...newUser, full_name: e.target.value })}
                  className="w-full p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-emerald-800 text-slate-800 dark:text-white"
                />
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-emerald-800 text-slate-800 dark:text-white"
                />
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={newUser.password}
                  onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-emerald-800 text-slate-800 dark:text-white"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" disabled={loading} className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg hover:bg-emerald-700 transition-all">
                  {loading ? 'Creating...' : 'Create User'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Users;