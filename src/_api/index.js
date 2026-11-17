import axios from "axios";

// terminal = npm run dev -- --host

const API = axios.create({
  // baseURL: "http:///192.168.1.6:8000/api",
  // baseURL: "http://10.200.70.149:8000/api",
  baseURL: "http://127.0.0.1:8000/api",
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      const pathname = [
        "/login",
        "/register",
        "/forget-password",
        "/verify-email",
      ];

      if (!pathname.includes(window.location.pathname)) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default API;
