import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Leaf,
  Loader2,
  AlertCircle,
} from "lucide-react";
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
      // Using your axios instance
      const { data } = await api.post("/auth/register", formData);

      // Store token and redirect
      localStorage.setItem("token", data.token);
      navigate("/verify-otp", { state: { email: formData.email } });
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950 dark:to-slate-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/80 dark:bg-emerald-900/30 backdrop-blur-xl border border-white dark:border-emerald-800 p-10 rounded-[3rem] shadow-2xl shadow-emerald-200/50 dark:shadow-none"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <Leaf className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white">
            Create Account
          </h2>
          <p className="text-emerald-600 dark:text-emerald-400 font-medium italic">
            Join the Network
          </p>
        </div>

        {/* Error Feedback */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-bold"
            >
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name Input */}
          <div className="relative">
            <User
              className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600/50"
              size={20}
            />
            <input
              type="text"
              required
              placeholder="Full Name"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              className="w-full p-5 pl-14 rounded-2xl bg-white dark:bg-emerald-800 border-none shadow-inner outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all disabled:opacity-50"
              disabled={isLoading}
            />
          </div>

          {/* Email Input */}
          <div className="relative">
            <Mail
              className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600/50"
              size={20}
            />
            <input
              type="email"
              required
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full p-5 pl-14 rounded-2xl bg-white dark:bg-emerald-800 border-none shadow-inner outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all disabled:opacity-50"
              disabled={isLoading}
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock
              className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600/50"
              size={20}
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full p-5 pl-14 rounded-2xl bg-white dark:bg-emerald-800 border-none shadow-inner outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all disabled:opacity-50"
              disabled={isLoading}
            />
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 disabled:bg-emerald-400 mt-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                CREATING ACCOUNT...
              </>
            ) : (
              <>
                <UserPlus size={20} />
                SIGN UP
              </>
            )}
          </motion.button>
        </form>

        <p className="mt-8 text-center text-slate-400 font-medium">
          Already have an account?{" "}
          <Link to="/" className="text-emerald-600 underline font-bold">
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
