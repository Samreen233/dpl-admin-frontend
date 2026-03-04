import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AlertCircle, Loader2, ShieldAlert } from "lucide-react";
import api, { setAuthToken } from "../api/axios"; // axios instance

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // login request
      const response = await api.post("/auth/login", { email, password });
      const data = response.data;
      // console.log("login response: ", data);

      // store user and access token in context/localStorage
      login(data.user, data.accessToken || data.token);
      setAuthToken(data.accessToken || data.token); // attach Bearer token

      // redirect
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
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
            <ShieldAlert className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white">
            Welcome Back
          </h2>
          <p className="text-emerald-600 dark:text-emerald-400 font-medium italic">
            Secure Gateway
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

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="w-full p-5 rounded-2xl bg-white dark:bg-emerald-800 border-none shadow-inner outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all disabled:opacity-50"
            disabled={isLoading}
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-5 rounded-2xl bg-white dark:bg-emerald-800 border-none shadow-inner outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all disabled:opacity-50"
            disabled={isLoading}
          />

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 disabled:bg-emerald-400"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                AUTHENTICATING...
              </>
            ) : (
              "SIGN IN"
            )}
          </motion.button>
        </form>

        <p className="mt-8 text-center text-slate-400 font-medium">
          New here?{" "}
          <Link to="/register" className="text-emerald-600 underline">
            Join us
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
