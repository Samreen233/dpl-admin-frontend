import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    login({ name: 'Admin', role: 'super-admin' }, 'secret_token');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950 dark:to-slate-900 p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/80 dark:bg-emerald-900/30 backdrop-blur-xl border border-white dark:border-emerald-800 p-10 rounded-[3rem] shadow-2xl shadow-emerald-200/50 dark:shadow-none"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <ShieldAlert className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white">Welcome Back</h2>
          <p className="text-emerald-600 dark:text-emerald-400 font-medium italic">Secure Gateway</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <input type="email" placeholder="Email Address" className="w-full p-5 rounded-2xl bg-white dark:bg-emerald-800 border-none shadow-inner outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all" />
          <input type="password" placeholder="Password" className="w-full p-5 rounded-2xl bg-white dark:bg-emerald-800 border-none shadow-inner outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white transition-all" />
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/30">
            SIGN IN
          </motion.button>
        </form>
        <p className="mt-8 text-center text-slate-400 font-medium">New here? <Link to="/register" className="text-emerald-600 underline">Join us</Link></p>
      </motion.div>
    </div>
  );
};
export default Login;