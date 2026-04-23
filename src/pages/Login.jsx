import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AlertCircle, Loader2, ShieldAlert, Eye, EyeOff } from "lucide-react";
import api, { setAuthToken } from "../api/axios";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });
      if (response.data?.accessToken && response.data?.user) {
        const userRole = response.data.user.role;
        if (userRole === "admin" || userRole === "superadmin") {
          // Add role_name for consistency across the app
          const userData = {
            ...response.data.user,
            role_name: response.data.user.role,
          };
          // Store access token in localStorage
          localStorage.setItem("token", response.data.accessToken);
          // Refresh token is already stored in HTTP-only cookie by backend
          login(userData, response.data.accessToken);
          setAuthToken(response.data.accessToken);
          navigate("/dashboard", { replace: true });
        } else {
          setError("Access denied. Only admin and superadmin are allowed.");
        }
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Invalid email or password";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-950 dark:to-slate-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/90 dark:bg-emerald-900/30 backdrop-blur-xl border border-white/30 dark:border-emerald-800 p-10 rounded-[3rem] shadow-2xl shadow-emerald-200/30 dark:shadow-none"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <ShieldAlert className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white">
            Welcome Back
          </h2>
          <p className="text-emerald-600 dark:text-emerald-400 font-medium italic">
            Secure Gateway
          </p>
        </div>

        {/* Error Message */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-bold"
            >
              <AlertCircle size={18} className="shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Input */}
          <input
            type="email"
            required
            placeholder="Email Address"
            className="w-full p-5 rounded-2xl bg-white dark:bg-emerald-800 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white border-none shadow-inner disabled:opacity-50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Password"
              className="w-full p-5 rounded-2xl bg-white dark:bg-emerald-800 outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white border-none shadow-inner disabled:opacity-50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-200"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Forgot Password */}
          {/* <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Forgot Password?
            </Link>
          </div> */}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 disabled:bg-emerald-400"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "SIGN IN"
            )}
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-8 text-center text-slate-400 font-medium">
          New here?{" "}
          <Link
            to="/register"
            className="text-emerald-600 dark:text-emerald-400 underline"
          >
            Join us
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
