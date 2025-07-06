import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://infiniteflight.onrender.com/api",
  withCredentials: false, // ensure not sending cookies
});

// Automatically attach JWT token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// (Optional) Handle global response errors like 401
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized. Maybe redirect to login.");
      // Optionally redirect to login:
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
