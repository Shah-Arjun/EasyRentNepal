import axios from 'axios';

/**
 * A custom hook that creates an Axios instance automatically configured 
 * with the Authentication token for the current user.
 */
const useAxios = () => {
//overall axios instance for frontend apis that , automatically attach the logged-in user’s Clerk token in every request

import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

/**
 * A custom hook that creates an Axios instance automatically configured
 * with the Clerk Authentication token for the current user.
 */
const useAxios = () => {
  const { getToken } = useAuth(); //getToken --> async function that returns the current user’s JWT token

  const customAxios = axios.create({
    //  actual backend URL
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor to add the JWT token automatically
  customAxios.interceptors.request.use(
    (config) => {
      try {
        const token = localStorage.getItem('token');
        //attach token
        const token = await getToken(); //get token form
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
    },
  );

  return customAxios;
};

export default useAxios;

//can be used as:
// const axiosInstance = useAxios();

// axiosInstance.get('/teachers');
// axiosInstance.post('/subjects', data);
