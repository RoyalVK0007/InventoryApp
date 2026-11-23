import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// Auth
export const googleLogin = (idToken) =>
  api.post("/api/auth/google", { idToken });

// Products
export const getProducts = () => api.get("/api/products");
export const getProduct = (id) => api.get(`/api/products/${id}`);
export const createProduct = (data) => api.post("/api/products", data);
export const updateProduct = (id, data) => api.put(`/api/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/api/products/${id}`);
export const searchProducts = (keyword) =>
  api.get(`/api/products/search?keyword=${keyword}`);
export const getProductsByCategory = (category) =>
  api.get(`/api/products/category/${category}`);
export const getLowStockProducts = () => api.get("/api/products/low-stock");

// Stock
export const stockIn = (id, data) =>
  api.post(`/api/products/${id}/stock/in`, data);
export const stockOut = (id, data) =>
  api.post(`/api/products/${id}/stock/out`, data);
export const getStockHistory = (id) =>
  api.get(`/api/products/${id}/stock/history`);

// Dashboard
export const getDashboardSummary = () => api.get("/api/dashboard/summary");
export const getRecentProducts = () => api.get("/api/dashboard/recent-products");

export default api;
