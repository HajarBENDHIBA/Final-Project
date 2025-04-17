import axios from 'axios';

// Determine the base URL based on the environment
const getBaseUrl = () => {
    if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL;
    }
    return 'https://backend-green-heaven-93tp0klhj-hajar-bendhibas-projects.vercel.app/api';
};

// Create axios instance
const api = axios.create({
    baseURL: getBaseUrl(),
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 30000 // Increase timeout to 30 seconds
});

// Retry logic
const retryCount = 3;
const retryDelay = 1000; // 1 second

const retryRequest = async (error, retries = retryCount) => {
    const shouldRetry = retries > 0 && (
        error.code === 'ECONNABORTED' ||
        error.code === 'ERR_NETWORK' ||
        (error.response && (error.response.status === 504 || error.response.status === 408))
    );

    if (shouldRetry) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        const config = error.config;
        console.log(`Retrying request (${retryCount - retries + 1}/${retryCount})...`);
        return api(config).catch(err => retryRequest(err, retries - 1));
    }

    return Promise.reject(error);
};

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
    async (error) => {
        console.error('Response error:', error);

        // Try to retry the request if applicable
        if (error.config && !error.config.__isRetry) {
            error.config.__isRetry = true;
            return retryRequest(error);
        }

        // Handle specific error cases
        if (error.response?.status === 401) {
            // Clear auth data on unauthorized
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('isLoggedIn');
        }

        // Format error messages
        let errorMessage = 'An error occurred. Please try again.';
        
        if (error.code === 'ECONNABORTED') {
            errorMessage = 'Request timed out. Please try again.';
        } else if (error.code === 'ERR_NETWORK') {
            errorMessage = 'Network error. Please check your connection.';
        } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        }

        return Promise.reject({
            ...error,
            message: errorMessage
        });
    }
);

export default api; 