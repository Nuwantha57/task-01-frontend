import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

// Add JWT interceptor
api.interceptors.request.use(
  config => {
    // Try to get id_token first, fallback to access_token
    const token = localStorage.getItem("id_token") || localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  response => {
    console.log("API Response:", response.config.url, response.status);
    return response;
  },
  error => {
    console.error("API Error:", error.config?.url, error.response?.status);
    console.error("Error details:", error.response?.data);
    
    // Don't auto-redirect here - let the component handle it
    // This prevents infinite redirect loops
    
    return Promise.reject(error);
  }
);

export default api;