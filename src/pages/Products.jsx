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
  ImagePlus,
  ImageIcon,
  Tag,
  Boxes,
  Eye,
  EyeOff,
  Scale,
} from "lucide-react";

const Products = () => {
  // Initial State with KG and New Fields
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Potato (Red)",
      category: "Vegetables",
      price: "100",
      discountPrice: "85",
      stock: 50.5,
      description: "Organic red potatoes sourced from local farms.",
      isActive: true,
      image: null,
    },
    {
      id: 2,
      name: "Onion (Fresh)",
      category: "Vegetables",
      price: "120",
      discountPrice: null,
      stock: 12.0,
      description: "Crispy and fresh pink onions.",
      isActive: true,
      image: null,
    },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const initialFormState = {
    name: "",
    category: "Vegetables",
    price: "",
    discountPrice: "",
    stock: "",
    description: "",
    isActive: true,
    image: null,
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleFileChange = (e, isEditing = false) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEditing) {
          setEditingProduct({ ...editingProduct, image: reader.result });
        } else {
          setFormData({ ...formData, image: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const newProduct = { id: Date.now(), ...formData };
    setProducts([newProduct, ...products]);
    setFormData(initialFormState);
    setIsAddModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setProducts(
      products.map((p) => (p.id === editingProduct.id ? editingProduct : p)),
    );
    setEditingProduct(null);
  };

  return (
    <div className="p-6 md:p-10 bg-slate-50 dark:bg-slate-950 min-h-screen font-sans">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 dark:text-white flex items-center gap-3">
            <ShoppingBasket className="text-emerald-600 w-10 h-10" />
            Products
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Track stock in{" "}
            <span className="text-emerald-600 font-bold">KGs</span>, manage
            discounts, and toggle visibility.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-emerald-500/20 hover:bg-emerald-500 transition-all"
        >
          <Plus size={20} /> ADD NEW PRODUCT
        </motion.button>
      </div>

      {/* Grid Section */}
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="popLayout">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`bg-white dark:bg-slate-900 rounded-[2.5rem] border ${!p.isActive ? "opacity-60 grayscale" : "border-emerald-50 dark:border-slate-800"} overflow-hidden shadow-sm hover:shadow-2xl transition-all group relative`}
                >
                  {/* Image/Preview Area */}
                  <div className="relative h-48 bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center overflow-hidden">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-emerald-200">
                        <ImageIcon size={48} />
                        <span className="text-[10px] font-black mt-2">
                          NO IMAGE
                        </span>
                      </div>
                    )}

                    {/* Status Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {p.discountPrice && (
                        <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg shadow-red-500/20">
                          <Tag size={10} /> SALE
                        </span>
                      )}
                      {!p.isActive && (
                        <span className="bg-slate-800 text-white text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1">
                          <EyeOff size={10} /> HIDDEN
                        </span>
                      )}
                    </div>

                    {/* Action Overlay */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-14 group-hover:translate-x-0 transition-transform duration-300">
                      <button
                        onClick={() => setEditingProduct(p)}
                        className="p-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl text-emerald-600 shadow-lg hover:bg-emerald-600 hover:text-white transition-all"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl text-red-500 shadow-lg hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-md">
                        {p.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-white leading-tight truncate">
                      {p.name}
                    </h3>
                    <p className="text-slate-400 text-xs mt-1 line-clamp-2 h-8 leading-relaxed">
                      {p.description || "No description provided."}
                    </p>

                    <div className="mt-6 flex items-end justify-between border-t border-slate-50 dark:border-slate-800 pt-4">
                      <div>
                        {p.discountPrice ? (
                          <div className="flex flex-col">
                            <span className="text-slate-400 line-through text-[10px] font-bold italic">
                              Was Rs.{p.price}
                            </span>
                            <span className="text-2xl font-black text-emerald-600 font-mono">
                              Rs.{p.discountPrice}
                              <span className="text-xs ml-1 opacity-60">
                                /kg
                              </span>
                            </span>
                          </div>
                        ) : (
                          <span className="text-2xl font-black text-slate-800 dark:text-white font-mono">
                            Rs.{p.price}
                            <span className="text-xs ml-1 opacity-60">/kg</span>
                          </span>
                        )}
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">
                          Stock Level
                        </p>
                        <div
                          className={`flex items-center gap-1 font-mono font-black ${p.stock < 10 ? "text-red-500" : "text-slate-700 dark:text-emerald-400"}`}
                        >
                          <Scale size={14} />
                          <span className="text-lg">{p.stock}</span>
                          <span className="text-xs">KG</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-40 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-emerald-100 dark:border-slate-800"
            >
              <div className="relative mb-6">
                <PackageSearch size={80} className="text-emerald-50" />
                <Ghost
                  size={30}
                  className="absolute bottom-0 right-0 text-emerald-400 animate-bounce"
                />
              </div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white">
                Warehouse Empty
              </h3>
              <p className="text-slate-400 font-medium">
                Add products to see them in your inventory.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Unified Modal (Add/Edit) */}
      <AnimatePresence>
        {(isAddModalOpen || editingProduct) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingProduct(null);
              }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8 border-b border-slate-50 dark:border-slate-800 pb-6">
                <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                  {editingProduct ? (
                    <Edit3 className="text-emerald-600" />
                  ) : (
                    <Plus className="text-emerald-600" />
                  )}
                  {editingProduct
                    ? "Edit Product Details"
                    : "New Inventory Entry"}
                </h2>
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                onSubmit={editingProduct ? handleSaveEdit : handleAddProduct}
              >
                {/* Image Section */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase text-emerald-700 ml-2 tracking-widest">
                    Product Image
                  </label>
                  <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-emerald-100 dark:border-slate-800 rounded-3xl cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all overflow-hidden relative">
                    {editingProduct?.image || formData.image ? (
                      <img
                        src={
                          editingProduct ? editingProduct.image : formData.image
                        }
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-emerald-400">
                        <ImagePlus size={32} />
                        <span className="text-[10px] font-black mt-2">
                          CLICK TO UPLOAD
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, !!editingProduct)}
                    />
                  </label>
                </div>

                {/* Name & Category */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-emerald-700 ml-2 tracking-widest">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct ? editingProduct.name : formData.name}
                    onChange={(e) =>
                      editingProduct
                        ? setEditingProduct({
                            ...editingProduct,
                            name: e.target.value,
                          })
                        : setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                    placeholder="e.g. Red Tomato"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-emerald-700 ml-2 tracking-widest">
                    Category
                  </label>
                  <select
                    value={
                      editingProduct
                        ? editingProduct.category
                        : formData.category
                    }
                    onChange={(e) =>
                      editingProduct
                        ? setEditingProduct({
                            ...editingProduct,
                            category: e.target.value,
                          })
                        : setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                  >
                    <option>Vegetables</option>
                    <option>Fruits</option>
                    <option>Meat</option>
                    <option>Dairy</option>
                  </select>
                </div>

                {/* Pricing (Per KG) */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-emerald-700 ml-2 tracking-widest">
                    Price per KG (Rs.)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={
                      editingProduct ? editingProduct.price : formData.price
                    }
                    onChange={(e) =>
                      editingProduct
                        ? setEditingProduct({
                            ...editingProduct,
                            price: e.target.value,
                          })
                        : setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white font-mono"
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-emerald-700 ml-2 tracking-widest">
                    Discount Price (Optional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={
                      editingProduct
                        ? editingProduct.discountPrice
                        : formData.discountPrice
                    }
                    onChange={(e) =>
                      editingProduct
                        ? setEditingProduct({
                            ...editingProduct,
                            discountPrice: e.target.value,
                          })
                        : setFormData({
                            ...formData,
                            discountPrice: e.target.value,
                          })
                    }
                    className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white font-mono"
                    placeholder="0.00"
                  />
                </div>

                {/* Stock (In KG) */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-emerald-700 ml-2 tracking-widest flex items-center gap-1">
                    <Scale size={12} /> Stock Quantity (KG)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={
                        editingProduct ? editingProduct.stock : formData.stock
                      }
                      onChange={(e) =>
                        editingProduct
                          ? setEditingProduct({
                              ...editingProduct,
                              stock: e.target.value,
                            })
                          : setFormData({ ...formData, stock: e.target.value })
                      }
                      className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white font-mono"
                      placeholder="0.0"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-md">
                      KG
                    </span>
                  </div>
                </div>

                {/* Visibility Toggle */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-emerald-700 ml-2 tracking-widest">
                    Store Visibility
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      editingProduct
                        ? setEditingProduct({
                            ...editingProduct,
                            isActive: !editingProduct.isActive,
                          })
                        : setFormData({
                            ...formData,
                            isActive: !formData.isActive,
                          })
                    }
                    className={`flex items-center justify-center gap-2 w-full p-4 rounded-2xl font-black transition-all ${(editingProduct ? editingProduct.isActive : formData.isActive) ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                  >
                    {(
                      editingProduct
                        ? editingProduct.isActive
                        : formData.isActive
                    ) ? (
                      <>
                        <Eye size={18} /> Visible to Customers
                      </>
                    ) : (
                      <>
                        <EyeOff size={18} /> Hidden from Store
                      </>
                    )}
                  </button>
                </div>

                {/* Description */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase text-emerald-700 ml-2 tracking-widest">
                    Product Description
                  </label>
                  <textarea
                    rows="3"
                    value={
                      editingProduct
                        ? editingProduct.description
                        : formData.description
                    }
                    onChange={(e) =>
                      editingProduct
                        ? setEditingProduct({
                            ...editingProduct,
                            description: e.target.value,
                          })
                        : setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                    }
                    className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white resize-none leading-relaxed"
                    placeholder="Write details about origin, quality, or freshness..."
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="md:col-span-2 py-5 bg-emerald-600 text-white font-black rounded-3xl shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 mt-4"
                >
                  <Check size={20} />{" "}
                  {editingProduct ? "SAVE CHANGES" : "ADD TO INVENTORY"}
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
