import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // Simulate API call and token storage
    const mockToken = "abc_123_registered_token";
    localStorage.setItem('token', mockToken);
    navigate('/'); // Send to login after registration
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 border border-slate-200 dark:border-slate-800">
        <h2 className="text-3xl font-bold dark:text-white mb-2">Create Account</h2>
        <p className="text-slate-500 mb-8">Join the Charsadda Admin Network</p>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <input 
            type="text" placeholder="Full Name" 
            className="w-full p-4 rounded-xl border dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            required 
          />
          <input 
            type="email" placeholder="Email" 
            className="w-full p-4 rounded-xl border dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            required 
          />
          <input 
            type="password" placeholder="Password" 
            className="w-full p-4 rounded-xl border dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            required 
          />
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/30">
            Sign Up
          </button>
        </form>
        <p className="text-center mt-6 text-slate-500">
          Already have an account? <Link to="/" className="text-blue-500 font-semibold">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
