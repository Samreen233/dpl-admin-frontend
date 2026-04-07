import api from "./axios";

const PRODUCTS_URL = import.meta.env.VITE_PRODUCTS_URL || "/products";
const normalizeNumber = (value, fallback = 0) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

// Fetch all products
export const getProducts = async () => {
  const response = await api.get(PRODUCTS_URL);
  return response.data;
};

// Fetch single product by ID
export const getProduct = async (id) => {
  const response = await api.get(`${PRODUCTS_URL}/${id}`);
  return response.data;
};

// Create a new product (with optional image upload)
export const createProduct = async (productData, imageFile = null) => {
  const formData = new FormData();

  // Append text fields as strings (multipart/form-data sends everything as strings)
  formData.append("name", (productData.name || "").trim());
  formData.append("description", productData.description || "");
  formData.append("price", String(normalizeNumber(productData.price)));
  formData.append(
    "discount_percent",
    String(normalizeNumber(productData.discount_percent, 0)),
  );
  formData.append("stock_qty", String(normalizeNumber(productData.stock_qty, 0)));

  if (productData.category_id !== null && productData.category_id !== "") {
    formData.append("category_id", String(normalizeNumber(productData.category_id)));
  }

  // Append image file if provided
  if (imageFile) {
    formData.append("image", imageFile);
  }

  const response = await api.post(PRODUCTS_URL, formData);

  return response.data;
};

// Update a product (with optional image upload)
export const updateProduct = async (id, productData, imageFile = null) => {
  const formData = new FormData();

  // Append text fields (only those that are provided)
  if (productData.name !== undefined) formData.append("name", (productData.name || "").trim());
  if (productData.description !== undefined) {
    formData.append("description", productData.description);
  }
  if (productData.price !== undefined) {
    formData.append("price", String(normalizeNumber(productData.price)));
  }
  if (productData.discount_percent !== undefined) {
    formData.append(
      "discount_percent",
      String(normalizeNumber(productData.discount_percent, 0)),
    );
  }
  if (productData.stock_qty !== undefined) {
    formData.append("stock_qty", String(normalizeNumber(productData.stock_qty, 0)));
  }
  if (productData.category_id !== undefined && productData.category_id !== null && productData.category_id !== "") {
    formData.append("category_id", String(normalizeNumber(productData.category_id)));
  }

  // Append image file if provided
  if (imageFile) {
    formData.append("image", imageFile);
  }

  const response = await api.put(`${PRODUCTS_URL}/${id}`, formData);

  return response.data;
};

// Delete a product (soft delete)
export const deleteProduct = async (id) => {
  const response = await api.delete(`${PRODUCTS_URL}/${id}`);
  return response.data;
};
