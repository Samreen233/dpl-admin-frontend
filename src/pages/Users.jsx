import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  X,
  Trash2,
  Mail,
  User,
  Lock,
  Loader2,
  AlertCircle,
  Edit2,
  ShieldCheck,
  UserCircle,
} from "lucide-react";
import api from "../api/axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [status, setStatus] = useState({
    loading: false,
    fetching: true,
    error: "",
  });

  // --- API Calls ---
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users/");
      setUsers(res.data);
    } catch (err) {
      setStatus((prev) => ({
        ...prev,
        error: err.response?.data?.message || "Failed to fetch users",
      }));
    } finally {
      setStatus((prev) => ({ ...prev, fetching: false }));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus((prev) => ({ ...prev, loading: true, error: "" }));

    try {
      if (editingUser) {
        const res = await api.put(`/users/${editingUser.id}`, formData);
        setUsers((prev) =>
          prev.map((u) => (u.user_id === editingUser.id ? res.data : u)),
        );
      } else {
        const res = await api.post("/users/", formData);
        setUsers((prev) => [...prev, res.data]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setStatus((prev) => ({
        ...prev,
        error: err.response?.data?.message || "Operation failed",
      }));
    } finally {
      setStatus((prev) => ({ ...prev, loading: false }));
    }
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    setStatus((prev) => ({ ...prev, loading: true }));
    try {
      await api.delete(`/users/${userToDelete.id}`);
      setUsers((prev) => prev.filter((u) => u.user_id !== userToDelete.id));
      setIsDeleteModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    } finally {
      setStatus((prev) => ({ ...prev, loading: false }));
    }
  };

  // --- Modal Helpers ---
  const openAddModal = () => {
    setEditingUser(null);
    setFormData({ full_name: "", email: "", password: "", role: "user" });
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      full_name: user.full_name,
      email: user.email,
      password: "",
      role: user.role_id,
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  return (
    <motion.div
      className="p-6 md:p-10 max-w-7xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tight">
            Users
          </h1>
          <p className="text-emerald-600 dark:text-emerald-400 font-medium">
            Manage platform members and permissions
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openAddModal}
          className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
        >
          <UserPlus size={20} /> Add New User
        </motion.button>
      </div>

      {/* --- Users Table --- */}
      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-5 text-slate-500 dark:text-slate-400 font-bold uppercase text-xs tracking-widest">
                  User Details
                </th>
                <th className="px-6 py-5 text-slate-500 dark:text-slate-400 font-bold uppercase text-xs tracking-widest">
                  Role
                </th>
                <th className="px-6 py-5 text-slate-500 dark:text-slate-400 font-bold uppercase text-xs tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {status.fetching ? (
                <tr>
                  <td
                    colSpan="3"
                    className="px-8 py-20 text-center text-emerald-500"
                  >
                    <Loader2 className="animate-spin mx-auto" size={40} />
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((u) => (
                  <tr
                    key={u.user_id}
                    className="group hover:bg-slate-50/50 dark:hover:bg-emerald-900/10 transition-colors"
                  >
                    <td className="px-6 py-6 flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold text-lg">
                        {u.full_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100">
                          {u.full_name}
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                          {u.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-tighter ${
                          u.role === "admin" || u.role === "super-admin"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(u)}
                          className="p-3 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(u)}
                          className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="px-8 py-20 text-center text-slate-400"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Add/Edit User Modal --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 w-full max-w-lg shadow-2xl border border-white dark:border-slate-800"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-slate-800 dark:text-white">
                  {editingUser ? "Update User" : "Add User"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  />
                </div>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  />
                </div>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="password"
                    placeholder={
                      editingUser
                        ? "Keep blank to remain unchanged"
                        : "Password"
                    }
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-bold text-xs uppercase tracking-widest text-slate-400">
                    User Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full py-4 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="super-admin">Super Admin</option>
                  </select>
                </div>

                {status.error && (
                  <div className="flex items-center gap-2 text-red-500 text-sm font-bold p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                    <AlertCircle size={16} /> {status.error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status.loading}
                  className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                >
                  {status.loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : editingUser ? (
                    "SAVE CHANGES"
                  ) : (
                    "CREATE ACCOUNT"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- Delete Confirmation Pop-up --- */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white dark:bg-slate-900 rounded-[2rem] p-8 w-full max-w-sm text-center shadow-2xl border border-white dark:border-slate-800"
            >
              <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">
                Are you sure?
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8">
                You are about to delete{" "}
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  {userToDelete?.full_name}
                </span>
                . This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-4 font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white font-black rounded-2xl shadow-lg shadow-red-500/20 transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Users;
