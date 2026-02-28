import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  ChevronLeft,
  Save,
  Eye,
  Edit3,
  Trash2,
  LayoutDashboard,
  ShoppingBasket,
  Users as UsersIcon,
  TrendingUp,
  Lock,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const EditRights = () => {
  const navigate = useNavigate();
  // In a real app, you'd fetch the admin name/ID from the URL params
  const { id } = useParams();

  // Mock initial state for the admin's permissions
  const [permissions, setPermissions] = useState({
    dashboard: { view: true },
    products: { view: true, create: true, edit: true, delete: false },
    dailyPrices: { view: true, update: true },
    users: { view: true, delete: false },
    admins: { view: false, manage_rights: false },
  });

  const togglePermission = (module, action) => {
    setPermissions((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: !prev[module][action],
      },
    }));
  };

  const PermissionRow = ({ icon: Icon, title, module, actions }) => (
    <div className="bg-white dark:bg-emerald-900/10 border border-emerald-50 dark:border-emerald-800 p-6 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-lg transition-all group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
          <Icon size={24} />
        </div>
        <div>
          <h4 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">
            {title}
          </h4>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Access Control
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {Object.keys(actions).map((action) => (
          <button
            key={action}
            onClick={() => togglePermission(module, action)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter flex items-center gap-2 transition-all ${
              actions[action]
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                : "bg-slate-100 dark:bg-emerald-950 text-slate-400 opacity-60"
            }`}
          >
            {actions[action] ? <ShieldCheck size={14} /> : <Lock size={14} />}
            {action.replace("_", " ")}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-10 max-w-5xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div className="flex items-center gap-6">
          <motion.button
            whileHover={{ x: -5 }}
            onClick={() => navigate("/admins")}
            className="p-4 bg-white dark:bg-emerald-900/20 rounded-2xl shadow-sm text-slate-600 dark:text-emerald-400 hover:text-emerald-600"
          >
            <ChevronLeft />
          </motion.button>
          <div>
            <h1 className="text-4xl font-black text-slate-800 dark:text-white">
              Edit Privileges
            </h1>
            <p className="text-emerald-600 font-bold uppercase text-xs tracking-[0.2em] mt-1">
              Configuring: District Editor
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-xl shadow-emerald-500/40"
        >
          <Save size={20} /> PUSH UPDATES
        </motion.button>
      </div>

      {/* Permission Matrix */}
      <div className="space-y-6">
        <PermissionRow
          icon={LayoutDashboard}
          title="Overview Dashboard"
          module="dashboard"
          actions={permissions.dashboard}
        />
        <PermissionRow
          icon={ShoppingBasket}
          title="Product Inventory"
          module="products"
          actions={permissions.products}
        />
        <PermissionRow
          icon={Edit3}
          title="Nirkh Nama (Daily Prices)"
          module="dailyPrices"
          actions={permissions.dailyPrices}
        />
        <PermissionRow
          icon={UsersIcon}
          title="User Management"
          module="users"
          actions={permissions.users}
        />
        <PermissionRow
          icon={Lock}
          title="Admin Security Settings"
          module="admins"
          actions={permissions.admins}
        />
      </div>

      {/* Warning Footer */}
      <div className="mt-12 p-8 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-[3rem] flex items-start gap-4">
        <div className="p-3 bg-red-100 dark:bg-red-900 text-red-600 rounded-2xl">
          <Trash2 size={24} />
        </div>
        <div>
          <h5 className="font-black text-red-800 dark:text-red-400 uppercase text-sm">
            Critical Warning
          </h5>
          <p className="text-red-700/60 dark:text-red-400/60 text-xs font-medium mt-1">
            Modifying admin rights can result in session termination for the
            affected user. Ensure you have the authorization to change access
            levels for district-level personnel.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default EditRights;
