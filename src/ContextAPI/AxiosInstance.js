// src/ContextAPI/useAxiosInstance.js
import axios from 'axios';
import { useAuth } from '../ContextAPI/AuthContext'; // Adjust the path according to your project structure
import { useEffect, useMemo } from 'react';


// Custom hook to create the axios instance
const useAxiosInstance = () => {
  const { token } = useAuth(); // Use the AuthContext to get the token

  // Create axios instance only once using useMemo
  const axiosInstance = useMemo(() => {
    return axios.create({
      baseURL: 'https://buysellproductserver-production.up.railway.app/api', // Your API base URL
    });
  }, []);

  // Update the Authorization header when token changes
  useEffect(() => {
    const setAuthHeader = (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    };

    const requestInterceptor = axiosInstance.interceptors.request.use(
      setAuthHeader,
      (error) => Promise.reject(error)
    );

    // Cleanup the interceptor when the component unmounts or token changes
    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
    };
  }, [token, axiosInstance]);

  // Return the created axios instance
  return axiosInstance;
};

export default useAxiosInstance;
