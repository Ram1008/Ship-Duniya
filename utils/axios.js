// utils/axios.js
import axios from 'axios';
import Cookies from 'js-cookie';
import Router from 'next/router'; // Import Next.js Router to handle redirects

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
    
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    // Return response if successful
    return response;
  },
  (error) => {
    // Check for 401 (Unauthorized) or 403 (Forbidden) status codes
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Remove the token if unauthorized and redirect to the unauthorized page
      Cookies.remove('token'); // Optionally remove token from cookies
      Router.push('/unauthorized'); // Redirect to the unauthorized page
    }

    // Return the error if not 401 or 403
    return Promise.reject(error);
  }
);

export default axiosInstance;
