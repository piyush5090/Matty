import axios from "axios";

const PORT = 5000;

const axiosInstance = axios.create({
  // baseURL: `http://localhost:${PORT}`,
  baseURL: `https://matty-design-tool-uh85.onrender.com/`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem("token");
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default axiosInstance;
