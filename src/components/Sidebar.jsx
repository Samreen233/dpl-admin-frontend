import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  ShieldAlert,
  Tag,
  LogOut,
  Sun,
  Moon,
  TrendingUp,
  // ShieldCheck,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { darkMode, setDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/dashboard",
    },
    { name: "Products", icon: <ShoppingCart size={20} />, path: "/products" },
    { name: "Users", icon: <Users size={20} />, path: "/users" },
    {
      name: "Admins",
      icon: <ShieldAlert size={20} />,
      path: "/admins",
    },
    // {
    //   name: "Permissions",
    //   icon: <ShieldCheck size={20} />,
    //   path: "/admins/edit-rights/default",
    //   superOnlyAccess: true,
    // },
    // { name: "Update Price", icon: <Tag size={20} />, path: "/update-price" },
    { name: "Nirkh Nama", icon: <Tag size={20} />, path: "/daily-prices" },
    { name: "Analytics", icon: <TrendingUp size={20} />, path: "/price-graph" },
  ];

  return (
    <motion.div
      initial={{ x: -200 }}
      animate={{ x: 0 }}
      className="w-72 h-screen bg-white dark:bg-emerald-950 border-r border-emerald-100 dark:border-emerald-900 flex flex-col transition-colors duration-500"
    >
      <div className="p-8">
        <h1 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter">
          FRESH ADMIN
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isSuperAdmin = user?.role_name === "superadmin";
          const isRestricted = item.superOnlyAccess && !isSuperAdmin;
          const active = location.pathname === item.path;

          return (
            <div key={item.path}>
              {isRestricted ? (
                <div className="flex items-center gap-4 p-4 rounded-2xl text-slate-300 dark:text-slate-600 cursor-not-allowed">
                  {item.icon}
                  <span className="font-semibold text-sm uppercase tracking-wider">
                    {item.name}
                  </span>
                </div>
              ) : (
                <Link to={item.path}>
                  <motion.div
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${active ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200 dark:shadow-none" : "text-slate-500 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/40"}`}
                  >
                    {item.icon}{" "}
                    <span className="font-semibold text-sm uppercase tracking-wider">
                      {item.name}
                    </span>
                  </motion.div>
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-6 m-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl space-y-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center justify-between w-full p-2 text-emerald-700 dark:text-emerald-300 font-medium"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          <span className="text-xs uppercase tracking-widest">
            {darkMode ? "Light" : "Dark"}
          </span>
        </button>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full p-3 bg-white dark:bg-emerald-800 text-red-500 rounded-xl shadow-sm hover:shadow-md transition-all"
        >
          <LogOut size={18} />{" "}
          <span className="font-bold text-xs uppercase">Logout</span>
        </button>
      </div>
    </motion.div>
  );
};
export default Sidebar;
