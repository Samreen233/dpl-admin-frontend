import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  ShoppingBasket,
  Trash2,
  PackageSearch,
  Ghost,
  Edit3,
  X,
  Check,
} from "lucide-react";

const Products = () => {
  const [products, setProducts] = useState([
    { id: 1, name: "Potato (Red)", category: "Vegetables", price: "60" },
    { id: 2, name: "Onion (Fresh)", category: "Vegetables", price: "85" },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    category: "Vegetables",
    price: "",
  });

  // State to track the product currently being edited
  const [editingProduct, setEditingProduct] = useState(null);

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;
    const newProduct = { id: Date.now(), ...formData };
    setProducts([newProduct, ...products]);
    setFormData({ name: "", category: "Vegetables", price: "" });
  };

  const handleDelete = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  // Logic to save the edited product
  const handleSaveEdit = (e) => {
    e.preventDefault();
    setProducts(
      products.map((p) => (p.id === editingProduct.id ? editingProduct : p)),
    );
    setEditingProduct(null);
  };

  return (
    <div className="p-10 grid grid-cols-1 lg:grid-cols-12 gap-10 min-h-[80vh]">
      {/* Form Section */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-4 bg-white dark:bg-emerald-900/20 p-8 rounded-[3rem] border border-emerald-50 dark:border-emerald-800 shadow-2xl h-fit lg:sticky lg:top-10"
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
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
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
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950 border-none outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white appearance-none"
            >
              <option>Vegetables</option>
              <option>Fruits</option>
              <option>Meat</option>
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
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950 border-none outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
              placeholder="0.00"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
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
        className="lg:col-span-8 bg-white dark:bg-emerald-900/20 rounded-[3rem] border border-emerald-50 dark:border-emerald-800 shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="p-8 bg-emerald-50/50 dark:bg-emerald-900/50 flex items-center justify-between border-b border-emerald-100 dark:border-emerald-800">
          <h3 className="font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-widest">
            Active Inventory ({products.length})
          </h3>
          <ShoppingBasket className="text-emerald-600" />
        </div>

        <div className="p-4 flex-1 overflow-y-auto min-h-[400px]">
          <AnimatePresence mode="popLayout">
            {products.length > 0 ? (
              products.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -50 }}
                  className="flex items-center justify-between p-6 m-2 bg-white dark:bg-emerald-800/20 rounded-3xl border border-emerald-50 dark:border-emerald-700 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-black">
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
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs font-black text-emerald-600 uppercase">
                        Rate
                      </p>
                      <p className="font-black text-xl dark:text-white font-mono">
                        Rs.{p.price}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setEditingProduct(p)}
                        className="text-emerald-600 hover:text-emerald-400 transition-colors p-1"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-400 hover:text-red-600 transition-colors p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full py-20 text-center"
              >
                <div className="relative mb-6">
                  <PackageSearch
                    size={80}
                    className="text-emerald-100 dark:text-emerald-900"
                  />
                  <Ghost
                    size={30}
                    className="absolute bottom-0 right-0 text-emerald-400 animate-bounce"
                  />
                </div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white">
                  Inventory Empty
                </h3>
                <p className="text-slate-400 dark:text-emerald-600 font-medium">
                  Add some fresh products to see them here.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* --- Edit Product Modal --- */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingProduct(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative w-full max-w-md bg-white dark:bg-emerald-950 p-8 rounded-[3rem] shadow-2xl border border-emerald-50 dark:border-emerald-800"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-slate-800 dark:text-white">
                  Edit Product
                </h3>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-emerald-700 ml-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        name: e.target.value,
                      })
                    }
                    className="w-full p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900 border-none outline-none ring-2 ring-transparent focus:ring-emerald-500 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-emerald-700 ml-2">
                    Category
                  </label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        category: e.target.value,
                      })
                    }
                    className="w-full p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900 border-none outline-none ring-2 ring-transparent focus:ring-emerald-500 dark:text-white"
                  >
                    <option>Vegetables</option>
                    <option>Fruits</option>
                    <option>Meat</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-emerald-700 ml-2">
                    Price (Rs.)
                  </label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: e.target.value,
                      })
                    }
                    className="w-full p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900 border-none outline-none ring-2 ring-transparent focus:ring-emerald-500 dark:text-white"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-2"
                >
                  <Check size={20} /> SAVE CHANGES
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Products;
