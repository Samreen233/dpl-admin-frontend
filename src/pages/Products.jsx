import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ShoppingBasket, Trash2 } from "lucide-react";

const Products = () => {
  // 1. Main State for Products
  const [products, setProducts] = useState([
    { id: 1, name: "Potato (Red)", category: "Vegetables", price: "60" },
    { id: 2, name: "Onion (Fresh)", category: "Vegetables", price: "85" },
  ]);

  // 2. State for Form Inputs
  const [formData, setFormData] = useState({
    name: "",
    category: "Vegetables",
    price: "",
  });

  // 3. Add Product Logic
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    const newProduct = {
      id: Date.now(), // Unique ID based on timestamp
      name: formData.name,
      category: formData.category,
      price: formData.price,
    };

    setProducts([newProduct, ...products]); // Add to start of list
    setFormData({ name: "", category: "Vegetables", price: "" }); // Reset Form
  };

  // 4. Delete Product Logic
  const handleDelete = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div className="p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Form Section */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-4 bg-white dark:bg-emerald-900/20 p-8 rounded-[3rem] border border-emerald-50 dark:border-emerald-800 shadow-2xl h-fit sticky top-10"
      >
        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-8 flex items-center gap-3">
          <Plus className="text-emerald-600" /> New Product
        </h2>
        <form className="space-y-5" onSubmit={handleAddProduct}>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-emerald-700 tracking-widest ml-2">
              Item Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950 border-none outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
              placeholder="e.g. Green Chili"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-emerald-700 tracking-widest ml-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950 border-none outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white appearance-none"
            >
              <option>Vegetables</option>
              <option>Fruits</option>
              <option>Spices</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-emerald-700 tracking-widest ml-2">
              Base Price (Rs.)
            </label>
            <input
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950 border-none outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
              placeholder="0.00"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/30"
          >
            ADD TO INVENTORY
          </motion.button>
        </form>
      </motion.div>

      {/* List Section */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-8 bg-white dark:bg-emerald-900/20 rounded-[3rem] border border-emerald-50 dark:border-emerald-800 shadow-2xl overflow-hidden"
      >
        <div className="p-8 bg-emerald-50/50 dark:bg-emerald-900/50 flex items-center justify-between border-b border-emerald-100 dark:border-emerald-800">
          <h3 className="font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-widest">
            Active Inventory ({products.length})
          </h3>
          <ShoppingBasket className="text-emerald-600" />
        </div>
        <div className="p-4 overflow-y-auto max-h-[600px] min-h-[400px]">
          {products.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400 italic">
               <Package size={48} className="mb-2 opacity-20" />
               <p>No products in inventory</p>
            </div>
          )}
          <AnimatePresence mode="popLayout">
            {products.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.9 }}
                className="flex items-center justify-between p-6 m-2 bg-white dark:bg-emerald-800/20 rounded-3xl border border-emerald-50 dark:border-emerald-700 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl flex items-center justify-center text-emerald-600 font-black">
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 dark:text-white">
                      {p.name}
                    </h4>
                    <p className="text-xs text-slate-400 font-bold uppercase">
                      {p.category}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-xs font-black text-emerald-600 uppercase">
                      Rate
                    </p>
                    <p className="font-black text-xl dark:text-white">
                      Rs. {p.price}
                    </p>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.2, color: "#ef4444" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(p.id)}
                    className="text-red-400 p-2 transition-colors"
                  >
                    <Trash2 size={20} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Products;