import axios from 'axios';

// Determine the base URL based on the environment
const getBaseUrl = () => {
    if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL;
    }
    return 'https://backend-green-heaven.vercel.app/api';
};

const api = axios.create({
    baseURL: getBaseUrl(),
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 10000 // 10 second timeout
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Add token to request if it exists
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        // Handle successful responses
        if (response.data?.token) {
            localStorage.setItem('token', response.data.token);
            if (response.data?.user?.role) {
                localStorage.setItem('role', response.data.user.role);
                localStorage.setItem('isLoggedIn', 'true');
            }
        }
        return response;
    },
    (error) => {
        // Handle response errors
        console.error('Response error:', error);
        
        if (error.response?.status === 401) {
            // Clear auth data on unauthorized
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('isLoggedIn');
        }

        // Network errors
        if (error.code === 'ERR_NETWORK') {
            return Promise.reject({
                ...error,
                message: 'Unable to connect to the server. Please check your internet connection.'
            });
        }

        // Timeout errors
        if (error.code === 'ECONNABORTED') {
            return Promise.reject({
                ...error,
                message: 'Request timed out. Please try again.'
            });
        }

        // CORS errors
        if (error.message?.includes('Network Error')) {
            return Promise.reject({
                ...error,
                message: 'Unable to connect to the server. This might be a CORS issue.'
            });
        }

        return Promise.reject(error);
    }
);

export default api; 