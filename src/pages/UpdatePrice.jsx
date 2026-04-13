import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Loader2 } from "lucide-react";
import { getProducts, updateProduct } from "../api/products";
import toast from "react-hot-toast";

const UpdatePrice = () => {
  const [products, setProducts] = useState([]);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      const productsData = response.products || response.data || response || [];
      setProducts(productsData);

      // Initialize prices state with existing product prices
      const initialPrices = {};
      productsData.forEach((product) => {
        initialPrices[product.id] = {
          rate_g1: product.rate_g1 || "",
          rate_g2: product.rate_g2 || product.price || "",
        };
      });
      setPrices(initialPrices);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (productId, field, value) => {
    setPrices((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that at least one price is filled
    const hasPrices = Object.values(prices).some(
      (p) => p.rate_g1 !== "" || p.rate_g2 !== "",
    );

    if (!hasPrices) {
      toast.error("Please enter at least one price");
      return;
    }

    setSubmitting(true);

    try {
      // Get products that have at least one price filled
      const productsToUpdate = Object.keys(prices).filter(
        (productId) =>
          prices[productId].rate_g1 !== "" || prices[productId].rate_g2 !== "",
      );

      if (productsToUpdate.length === 0) {
        toast.error("Please enter at least one price");
        setSubmitting(false);
        return;
      }

      // Update each product individually using PUT /products/{id}
      const updatePromises = productsToUpdate.map(async (productId) => {
        const productData = {
          price: prices[productId].rate_g2 || prices[productId].rate_g1,
        };
        if (prices[productId].rate_g1)
          productData.rate_g1 = prices[productId].rate_g1;
        if (prices[productId].rate_g2)
          productData.rate_g2 = prices[productId].rate_g2;

        return updateProduct(productId, productData);
      });

      await Promise.all(updatePromises);

      toast.success("Price list updated successfully!");

      // Refresh products to get updated data
      await fetchProducts();
    } catch (error) {
      console.error("Error updating prices:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update prices",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 size={48} className="animate-spin text-emerald-600" />
        <span className="ml-4 text-xl font-bold text-emerald-600">
          Loading products...
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto p-10"
    >
      <div className="bg-white dark:bg-emerald-900/20 p-12 rounded-[3.5rem] shadow-2xl border border-emerald-100 dark:border-emerald-800">
        <div className="flex justify-between items-center mb-12 border-b-4 border-emerald-600 pb-8">
          <div className="text-left">
            <p className="text-emerald-600 font-black text-xl">
              DISTRICT CHARSADDA
            </p>
            <p className="text-slate-400 font-bold">Food Department Office</p>
          </div>
          <h1
            className="text-4xl font-black text-right dark:text-white"
            dir="rtl"
          >
            نرخنامہ برائے فریش سبزی
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {products.length > 0 ? (
              <>
                {/* Split products into two columns */}
                {[
                  products.slice(0, Math.ceil(products.length / 2)),
                  products.slice(Math.ceil(products.length / 2)),
                ].map((columnProducts, colIndex) => (
                  <div key={colIndex} className="space-y-4">
                    <div className="grid grid-cols-4 font-black text-xs text-emerald-700 dark:text-emerald-400 uppercase text-center bg-emerald-50 dark:bg-emerald-900/50 p-4 rounded-2xl">
                      <span>Rate G-2</span>
                      <span>Rate G-1</span>
                      <span className="col-span-2 text-right">Item Name</span>
                    </div>
                    {columnProducts.map((product) => (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        key={product.id}
                        className="grid grid-cols-4 items-center bg-white dark:bg-emerald-800/40 p-3 rounded-2xl border border-emerald-50 dark:border-emerald-700 shadow-sm"
                      >
                        <input
                          type="number"
                          value={prices[product.id]?.rate_g2 || ""}
                          onChange={(e) =>
                            handlePriceChange(
                              product.id,
                              "rate_g2",
                              e.target.value,
                            )
                          }
                          className="w-16 bg-emerald-50 dark:bg-emerald-950 p-2 rounded-xl text-center font-bold"
                          placeholder="00"
                        />
                        <input
                          type="number"
                          value={prices[product.id]?.rate_g1 || ""}
                          onChange={(e) =>
                            handlePriceChange(
                              product.id,
                              "rate_g1",
                              e.target.value,
                            )
                          }
                          className="w-16 bg-emerald-50 dark:bg-emerald-950 p-2 rounded-xl text-center font-bold"
                          placeholder="00"
                        />
                        <span className="col-span-2 text-right font-black text-slate-700 dark:text-emerald-100 pr-4">
                          {product.name_ur || product.name_en || product.name}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                ))}
              </>
            ) : (
              <div className="col-span-2 text-center py-12 text-gray-500">
                No products available to update
              </div>
            )}
          </div>

          <motion.button
            whileHover={{ scale: submitting ? 1 : 1.05 }}
            whileTap={{ scale: submitting ? 1 : 0.95 }}
            type="submit"
            disabled={submitting}
            className="w-full mt-12 py-6 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-black text-2xl rounded-[2rem] shadow-2xl shadow-emerald-500/40 tracking-tight transition-colors flex items-center justify-center gap-3"
          >
            {submitting ? (
              <>
                <Loader2 size={28} className="animate-spin" />
                UPDATING PRICES...
              </>
            ) : (
              <>
                <Save size={28} />
                PUBLISH OFFICIAL PRICE LIST
              </>
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default UpdatePrice;
