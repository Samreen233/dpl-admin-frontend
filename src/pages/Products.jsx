import React, { useState, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
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
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByDate,
} from "../api/products";
import api from "../api/axios";

const Products = () => {
  const fallbackCategories = [
    { category_id: 1, name: "Vegetables" },
    { category_id: 2, name: "Fruits" },
    { category_id: 3, name: "Meat" },
    { category_id: 4, name: "Dairy" },
  ];

  // API State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(fallbackCategories);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [previousPrices, setPreviousPrices] = useState({});

  // Date Filter State
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [previousDayProducts, setPreviousDayProducts] = useState({});

  // UI State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Load previous prices from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("product_previous_prices");
      if (stored) {
        setPreviousPrices(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to load previous prices:", err);
    }
  }, []);

  // Save previous price to localStorage
  const savePreviousPrice = (productId, price) => {
    setPreviousPrices((prev) => {
      const updated = { ...prev, [productId]: price };
      localStorage.setItem("product_previous_prices", JSON.stringify(updated));
      return updated;
    });
  };

  const initialFormState = {
    name: "",
    category_id: "",
    price: "",
    discount_percent: "",
    stock_qty: "",
    description: "",
    image: null,
    imageFile: null,
  };

  const [formData, setFormData] = useState(initialFormState);
  const resolveImageUrl = (imageUrl) => {
    if (!imageUrl) return "";
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }

    const baseUrl = (import.meta.env.VITE_BASE_URL || "").replace(/\/$/, "");
    const normalizedPath = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
    return `${baseUrl}${normalizedPath}`;
  };

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesUrl =
        import.meta.env.VITE_CATEGORIES_URL || "/categories";
      const res = await api.get(categoriesUrl);
      if (!Array.isArray(res.data)) return;

      const normalized = res.data
        .map((item) => ({
          category_id: Number(item.category_id ?? item.id),
          name: item.name ?? item.category_name ?? "",
        }))
        .filter((item) => Number.isFinite(item.category_id) && item.name);

      if (normalized.length > 0) {
        setCategories(normalized);
      }
    } catch {
      // Fallback categories stay in place when categories endpoint is unavailable.
      console.warn("Failed to fetch categories, using fallback options.");
    }
  };

  const fetchProducts = async (date = null) => {
    try {
      setLoading(true);
      setError(null);

      const fetchDate = date || selectedDate;

      // If no date selected, fetch all products
      if (!fetchDate) {
        const data = await getProducts();
        setProducts(data);
        setPreviousDayProducts({});
        return;
      }

      // Fetch products for selected date
      const data = await getProductsByDate(fetchDate);
      setProducts(data);

      // Calculate previous day date
      const currentDate = new Date(fetchDate);
      const previousDate = new Date(currentDate);
      previousDate.setDate(currentDate.getDate() - 1);
      const previousDateStr = previousDate.toISOString().split("T")[0];

      // Fetch previous day products
      try {
        const previousData = await getProductsByDate(previousDateStr);
        const previousMap = {};
        previousData.forEach((product) => {
          previousMap[product.name] = product.price;
        });
        setPreviousDayProducts(previousMap);
      } catch (err) {
        console.error("Failed to fetch previous day products:", err);
        setPreviousDayProducts({});
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleApplyDateFilter = () => {
    fetchProducts(selectedDate);
  };

  const handleShowAllProducts = () => {
    // Reset to show all products without date filter
    setSelectedDate("");
    getProducts()
      .then((data) => {
        setProducts(data);
        setPreviousDayProducts({});
      })
      .catch((err) => {
        console.error("Failed to fetch all products:", err);
      });
  };

  const handleFileChange = (e, isEditing = false) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEditing) {
          setEditingProduct((prev) => ({
            ...prev,
            imagePreview: reader.result,
            imageFile: file,
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            image: reader.result,
            imageFile: file,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const productData = {
      name: formData.name.trim(),
      description: formData.description || "",
      price: Number(formData.price),
      discount_percent: formData.discount_percent
        ? Number(formData.discount_percent)
        : 0,
      stock_qty: formData.stock_qty ? Number(formData.stock_qty) : 0,
      category_id: formData.category_id ? Number(formData.category_id) : null,
    };

    try {
      await createProduct(productData, formData.imageFile);
      await fetchProducts(); // Refresh product list
      setFormData(initialFormState);
      setIsAddModalOpen(false);
    } catch (err) {
      console.error("Failed to create product:", err);
      console.error("Create product payload:", {
        ...productData,
        imageName: formData.imageFile?.name || null,
        imageSize: formData.imageFile?.size || null,
      });
      console.error("Create product backend response:", err.response?.data);

      const status = err.response?.status;
      const errorMessage =
        err.response?.data?.message ||
        "Failed to create product. Please try again.";
      alert(
        `${errorMessage}${status ? ` (HTTP ${status})` : ""}\nIf status is 500, check backend console for SQL/multer error.`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      await fetchProducts(); // Refresh product list
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product. Please try again.");
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Get the current product to save its price as previous
      const currentProduct = products.find(
        (p) => p.product_id === editingProduct.product_id,
      );
      const currentPrice = currentProduct?.price;

      // Save current price as previous price before updating
      if (
        currentPrice !== undefined &&
        currentPrice !== Number(editingProduct.price)
      ) {
        savePreviousPrice(editingProduct.product_id, currentPrice);
      }

      const productData = {
        name: (editingProduct.name || "").trim(),
        description: editingProduct.description || "",
        price: Number(editingProduct.price),
        discount_percent:
          editingProduct.discount_percent === ""
            ? 0
            : Number(editingProduct.discount_percent),
        stock_qty:
          editingProduct.stock_qty === ""
            ? 0
            : Number(editingProduct.stock_qty),
        category_id:
          editingProduct.category_id === "" ||
          editingProduct.category_id == null
            ? null
            : Number(editingProduct.category_id),
      };

      await updateProduct(
        editingProduct.product_id,
        productData,
        editingProduct.imageFile,
      );
      await fetchProducts(); // Refresh product list
      setEditingProduct(null);
    } catch (err) {
      console.error("Failed to update product:", err);
      alert("Failed to update product. Please try again.");
    } finally {
      setSubmitting(false);
    }
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

        <div className="flex flex-col sm:flex-row gap-3 items-center">
          {/* Date Filter */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-emerald-50 dark:border-slate-800">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border-none outline-none rounded-xl text-sm font-medium dark:text-white"
            />
            <button
              onClick={handleApplyDateFilter}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-black hover:bg-emerald-500 transition-all"
            >
              Apply
            </button>
            <button
              onClick={handleShowAllProducts}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white rounded-xl text-sm font-black hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
            >
              Show All
            </button>
          </div>

          <Motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-emerald-500/20 hover:bg-emerald-500 transition-all"
          >
            <Plus size={20} /> ADD NEW PRODUCT
          </Motion.button>
        </div>
      </div>

      {/* Grid Section */}
      <div className="max-w-7xl mx-auto">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 size={48} className="text-emerald-600 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Loading products...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-40 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-red-200 dark:border-red-900">
            <AlertCircle size={64} className="text-red-500 mb-4" />
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">
              Something went wrong
            </h3>
            <p className="text-slate-400 font-medium mb-4">{error}</p>
            <button
              onClick={fetchProducts}
              className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-500 transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((p) => (
                <Motion.div
                  key={p.product_id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-emerald-50 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-2xl transition-all group relative"
                >
                  {/* Image/Preview Area */}
                  <div className="relative h-48 bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center overflow-hidden">
                    {p.image_url ? (
                      <img
                        src={resolveImageUrl(p.image_url)}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.querySelector(
                            ".fallback-icon",
                          ).style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className={`fallback-icon flex-col items-center text-emerald-200 ${
                        p.image_url ? "hidden" : "flex"
                      }`}
                    >
                      <ImageIcon size={48} />
                      <span className="text-[10px] font-black mt-2">
                        NO IMAGE
                      </span>
                    </div>

                    {/* Status Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {p.discount_percent > 0 && (
                        <span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg shadow-red-500/20">
                          <Tag size={10} /> {p.discount_percent}% OFF
                        </span>
                      )}
                    </div>

                    {/* Action Overlay */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-14 group-hover:translate-x-0 transition-transform duration-300">
                      <button
                        onClick={() =>
                          setEditingProduct({
                            ...p,
                            imagePreview: resolveImageUrl(p.image_url),
                            imageFile: null,
                          })
                        }
                        className="p-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl text-emerald-600 shadow-lg hover:bg-emerald-600 hover:text-white transition-all"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(p.product_id)}
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
                        {p.category_name || "Uncategorized"}
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
                        {previousDayProducts[p.name] ? (
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                              Previous Day
                            </span>
                            <span className="text-slate-400 line-through text-[10px] font-bold italic">
                              Rs.{previousDayProducts[p.name]}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-600 mt-1">
                              Current Day
                            </span>
                            <span className="text-2xl font-black text-emerald-600 font-mono">
                              Rs.{p.price}
                              <span className="text-xs ml-1 opacity-60">
                                /kg
                              </span>
                            </span>
                          </div>
                        ) : previousPrices[p.product_id] ? (
                          <div className="flex flex-col">
                            <span className="text-slate-400 line-through text-[10px] font-bold italic">
                              Rs.{previousPrices[p.product_id]}
                            </span>
                            <span className="text-2xl font-black text-emerald-600 font-mono">
                              Rs.{p.price}
                              <span className="text-xs ml-1 opacity-60">
                                /kg
                              </span>
                            </span>
                          </div>
                        ) : p.discount_percent > 0 ? (
                          <div className="flex flex-col">
                            <span className="text-slate-400 line-through text-[10px] font-bold italic">
                              Rs.{p.price}
                            </span>
                            <span className="text-2xl font-black text-emerald-600 font-mono">
                              Rs.
                              {(
                                p.price -
                                (p.price * p.discount_percent) / 100
                              ).toFixed(2)}
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
                          className={`flex items-center gap-1 font-mono font-black ${p.stock_qty < 10 ? "text-red-500" : "text-slate-700 dark:text-emerald-400"}`}
                        >
                          <Scale size={14} />
                          <span className="text-lg">{p.stock_qty}</span>
                          <span className="text-xs">KG</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <Motion.div
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
          </Motion.div>
        )}
      </div>

      {/* Unified Modal (Add/Edit) */}
      <AnimatePresence>
        {(isAddModalOpen || editingProduct) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingProduct(null);
              }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            <Motion.div
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
                    {editingProduct?.imagePreview || formData.image ? (
                      <img
                        src={
                          editingProduct
                            ? editingProduct.imagePreview
                            : formData.image
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
                        ? (editingProduct.category_id ?? "")
                        : formData.category_id
                    }
                    onChange={(e) =>
                      editingProduct
                        ? setEditingProduct({
                            ...editingProduct,
                            category_id: e.target.value,
                          })
                        : setFormData({
                            ...formData,
                            category_id: e.target.value,
                          })
                    }
                    className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option
                        key={category.category_id}
                        value={String(category.category_id)}
                      >
                        {category.name}
                      </option>
                    ))}
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
                  {editingProduct &&
                    previousPrices[editingProduct.product_id] && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                        <span className="font-bold">Previous price:</span>
                        <span className="font-mono font-black text-emerald-600">
                          Rs.{previousPrices[editingProduct.product_id]}
                        </span>
                      </p>
                    )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-emerald-700 ml-2 tracking-widest">
                    Discount Percent (Optional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={
                      editingProduct
                        ? editingProduct.discount_percent
                        : formData.discount_percent
                    }
                    onChange={(e) =>
                      editingProduct
                        ? setEditingProduct({
                            ...editingProduct,
                            discount_percent: e.target.value,
                          })
                        : setFormData({
                            ...formData,
                            discount_percent: e.target.value,
                          })
                    }
                    className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white font-mono"
                    placeholder="0"
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
                        editingProduct
                          ? editingProduct.stock_qty
                          : formData.stock_qty
                      }
                      onChange={(e) =>
                        editingProduct
                          ? setEditingProduct({
                              ...editingProduct,
                              stock_qty: e.target.value,
                            })
                          : setFormData({
                              ...formData,
                              stock_qty: e.target.value,
                            })
                      }
                      className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white font-mono"
                      placeholder="0.0"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-md">
                      KG
                    </span>
                  </div>
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

                <Motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={submitting}
                  className="md:col-span-2 py-5 bg-emerald-600 text-white font-black rounded-3xl shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />{" "}
                      {editingProduct ? "SAVING..." : "ADDING..."}
                    </>
                  ) : (
                    <>
                      <Check size={20} />{" "}
                      {editingProduct ? "SAVE CHANGES" : "ADD TO INVENTORY"}
                    </>
                  )}
                </Motion.button>
              </form>
            </Motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirm(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            <Motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-2xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                  <Trash2 size={32} className="text-red-500" />
                </div>

                <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">
                  Delete Product?
                </h3>
                <p className="text-slate-500 font-medium mb-6">
                  This action cannot be undone. The product will be permanently
                  removed from your inventory.
                </p>

                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm)}
                    className="flex-1 py-4 bg-red-500 text-white font-black rounded-2xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            </Motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Products;
