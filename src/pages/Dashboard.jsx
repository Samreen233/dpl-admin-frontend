import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Shield,
  Loader2,
  AlertCircle,
} from "lucide-react";
import api from "../api/axios";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalAdmins: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch products and users in parallel
      const [productsRes, usersRes] = await Promise.allSettled([
        api.get("/products"),
        api.get("/users/"),
      ]);

      const products =
        productsRes.status === "fulfilled" ? productsRes.value.data : [];
      const users = usersRes.status === "fulfilled" ? usersRes.value.data : [];

      // Filter only regular users
      const regularUsers = users.filter((u) => u.role_name === "user");

      // Count admins and superadmins
      const adminsAndSuperAdmins = users.filter(
        (u) => u.role_name === "admin" || u.role_name === "superadmin",
      );

      setStats({
        totalProducts: products.length,
        totalUsers: regularUsers.length,
        totalOrders: 0, // Will update when orders API is available
        totalAdmins: adminsAndSuperAdmins.length,
      });
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Total Products",
      val: stats.totalProducts.toLocaleString(),
      icon: <ShoppingBag />,
      color: "bg-emerald-500",
    },
    {
      title: "Active Users",
      val: stats.totalUsers.toLocaleString(),
      icon: <Users />,
      color: "bg-green-500",
    },
    {
      title: "New Orders",
      val: stats.totalOrders.toLocaleString(),
      icon: <ShoppingBag />,
      color: "bg-teal-500",
    },
    {
      title: "Admins",
      val: stats.totalAdmins.toLocaleString(),
      icon: <Shield />,
      color: "bg-lime-500",
    },
  ];

  return (
    <div className="p-10 space-y-10">
      <div className="flex justify-between items-end">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-black text-slate-800 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-emerald-600 font-medium">
            Real-time inventory and user stats
          </p>
        </motion.div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={48} className="text-emerald-600 animate-spin" />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-red-200 dark:border-red-900">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <p className="text-slate-500 font-medium">{error}</p>
          <button
            onClick={fetchDashboardStats}
            className="mt-4 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-500 transition-all"
          >
            Retry
          </button>
        </div>
      )}

      {/* Stats Cards */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-white dark:bg-emerald-900/40 rounded-[2.5rem] border border-emerald-50 dark:border-emerald-800 shadow-xl shadow-emerald-100/20"
            >
              <div
                className={`w-12 h-12 ${card.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg`}
              >
                {card.icon}
              </div>
              <p className="text-slate-400 dark:text-emerald-300 font-bold uppercase text-xs tracking-widest">
                {card.title}
              </p>
              <h3 className="text-3xl font-black mt-2 dark:text-white tracking-tight">
                {card.val}
              </h3>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
