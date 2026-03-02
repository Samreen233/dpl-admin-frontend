import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, User, Leaf, Loader2 } from "lucide-react";
import api from "../api/axios";

const Register = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { data } = await api.post("/auth/register", formData);

      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again",
      );
      console.error("registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50 dark:bg-slate-950 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-emerald-900/10 rounded-[3rem] shadow-2xl p-10 border border-emerald-100 dark:border-emerald-800/50 backdrop-blur-sm"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/30 mb-4">
            <Leaf size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter">
            Join Network
          </h2>
          <p className="text-emerald-600 font-bold text-xs uppercase tracking-widest mt-2 text-center">
            Charsadda Admin Panel
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-100 text-red-600 text-sm font-bold text-center border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="relative group">
            <User
              className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 group-focus-within:text-emerald-700 transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Full Name"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              className="w-full pl-12 p-4 rounded-2xl border-none bg-emerald-50 dark:bg-emerald-950 dark:text-white outline-none ring-2 ring-transparent focus:ring-emerald-500 transition-all"
              required
            />
          </div>

          <div className="relative group">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 group-focus-within:text-emerald-700 transition-colors"
              size={20}
            />
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full pl-12 p-4 rounded-2xl border-none bg-emerald-50 dark:bg-emerald-950 dark:text-white outline-none ring-2 ring-transparent focus:ring-emerald-500 transition-all"
              required
            />
          </div>

          <div className="relative group">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 group-focus-within:text-emerald-700 transition-colors"
              size={20}
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full pl-12 p-4 rounded-2xl border-none bg-emerald-50 dark:bg-emerald-950 dark:text-white outline-none ring-2 ring-transparent focus:ring-emerald-500 transition-all"
              required
            />
          </div>

          <motion.button
            disabled={isLoading} // Prevent double clicks
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-emerald-500/40 flex items-center justify-center gap-2 mt-4 ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <UserPlus size={20} />
            )}
            {isLoading ? "CREATING..." : "CREATE ACCOUNT"}
          </motion.button>
        </form>

        <div className="mt-8 pt-6 border-t border-emerald-50 dark:border-emerald-800 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Already have an account?
            <Link
              to="/"
              className="text-emerald-600 font-black ml-2 hover:underline"
            >
              LOGIN
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
