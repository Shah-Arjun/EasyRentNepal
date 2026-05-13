import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// When the request body is FormData, remove the Content-Type header so
// Axios (and the browser) can auto-set  multipart/form-data WITH the
// correct boundary string. Without the boundary Multer cannot parse the
// multipart body and req.files will be empty.
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

const useAxios = () => api;

export default useAxios;