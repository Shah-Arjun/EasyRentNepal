import axios from 'axios';

/**
 * A custom hook that creates an Axios instance automatically configured 
 * with the Authentication token for the current user.
 */
const useAxios = () => {
  const customAxios = axios.create({
    // Replace this with your actual backend URL or define VITE_API_URL in your .env file
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add the JWT token automatically
  customAxios.interceptors.request.use(
    (config) => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error setting custom auth token:", error);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return customAxios;
};

export default useAxios;
