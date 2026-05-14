import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// =====================
// Auth APIs
// =====================
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/users/register', data);

// =====================
// Product APIs
// =====================
export const getProducts = () => api.get('/products');
export const getProductById = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const updateStock = (id, data) => api.patch(`/products/${id}/stock`, data);

// =====================
// Cart APIs
// =====================
export const getCart = () => api.get('/cart'); // JWT identifies the user
export const addToCart = (productId, quantity) =>
  api.post('/cart', { product_id: productId, quantity });
export const removeFromCart = (cartItemId) =>
  api.delete(`/cart/${cartItemId}`);

// If you implement clear or update, you can add them later:
export const clearCart = () => api.delete('/cart/clear');
export const updateCartItem = (cartItemId, quantity) =>
  api.put(`/cart/${cartItemId}`, { quantity });
export const checkoutOrder = (userId, shipping_address, token) =>
  api.post(
    "/orders/checkout",
    { userId, shipping_address },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );


  // services/api.js - Add these procurement functions

// Get all procurements
export const getProcurements = (params = {}) => {
  return api.get('/procurements', { params });
};

// Get procurement by ID
export const getProcurementById = (id) => {
  return api.get(`/procurements/${id}`);
};

// Create new procurement
export const createProcurement = (procurementData) => {
  return api.post('/procurements', procurementData);
};

// Update procurement
export const updateProcurement = (id, procurementData) => {
  return api.put(`/procurements/${id}`, procurementData);
};

// Update procurement status
export const updateProcurementStatus = (id, statusData) => {
  return api.put(`/procurements/${id}/status`, statusData);
};

// Delete procurement
export const deleteProcurement = (id) => {
  return api.delete(`/procurements/${id}`);
};


  export const createOrder = (data) => 
  api.post("/orders", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });



  // Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Sales APIs
// =====================
export const getSalesOverview = (range = 'weekly') => {
  // range can be 'daily', 'weekly', or 'monthly'
  return api.get(`/sales?range=${range}`);
};


export default api;
