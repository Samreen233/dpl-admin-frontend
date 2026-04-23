import api from "./axios";

const PRODUCTS_URL = "/products";
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
  formData.append(
    "stock_qty",
    String(normalizeNumber(productData.stock_qty, 0)),
  );

  if (productData.category_id !== null && productData.category_id !== "") {
    formData.append(
      "category_id",
      String(normalizeNumber(productData.category_id)),
    );
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
  // If there's an image file, use FormData
  if (imageFile) {
    const formData = new FormData();

    // Append text fields (only those that are provided)
    if (productData.name !== undefined)
      formData.append("name", (productData.name || "").trim());
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
      formData.append(
        "stock_qty",
        String(normalizeNumber(productData.stock_qty, 0)),
      );
    }
    if (
      productData.category_id !== undefined &&
      productData.category_id !== null &&
      productData.category_id !== ""
    ) {
      formData.append(
        "category_id",
        String(normalizeNumber(productData.category_id)),
      );
    }

    formData.append("image", imageFile);

    const response = await api.put(`${PRODUCTS_URL}/${id}`, formData);
    return response.data;
  }

  // If no image file, send as JSON (more reliable for partial updates)
  const jsonData = {};
  if (productData.name !== undefined)
    jsonData.name = (productData.name || "").trim();
  if (productData.description !== undefined)
    jsonData.description = productData.description;
  if (productData.price !== undefined)
    jsonData.price = normalizeNumber(productData.price);
  if (productData.discount_percent !== undefined)
    jsonData.discount_percent = normalizeNumber(
      productData.discount_percent,
      0,
    );
  if (productData.stock_qty !== undefined)
    jsonData.stock_qty = normalizeNumber(productData.stock_qty, 0);
  if (
    productData.category_id !== undefined &&
    productData.category_id !== null &&
    productData.category_id !== ""
  ) {
    jsonData.category_id = normalizeNumber(productData.category_id);
  }

  const response = await api.put(`${PRODUCTS_URL}/${id}`, jsonData);

  return response.data;
};

// Delete a product (soft delete)
export const deleteProduct = async (id) => {
  const response = await api.delete(`${PRODUCTS_URL}/${id}`);
  return response.data;
};

// Fetch products by date
export const getProductsByDate = async (date) => {
  const params = {};
  if (date) {
    params.date = date;
  }
  const response = await api.get(`${PRODUCTS_URL}/date`, { params });
  return response.data;
};

/// ✅ Update single product price
export const updateProductPrice = async (id, priceData) => {
  const response = await api.post(`${PRODUCTS_URL}/update-price/${id}`, {
    price: Number(priceData.price),
    discount_percent: Number(priceData.discount_percent || 0),
    stock_qty: Number(priceData.stock_qty || 0),
  });
  return response.data;
};
