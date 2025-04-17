import axios from 'axios';
import config from '../config';

class ApiService {
    constructor() {
        this.client = axios.create({
            baseURL: config.api.baseURL,
            timeout: config.api.timeout,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        this.setupInterceptors();
    }

    setupInterceptors() {
        // Request interceptor
        this.client.interceptors.request.use(
            (config) => {
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
        this.client.interceptors.response.use(
            (response) => {
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
                // Try to retry the request if applicable
                if (error.config && !error.config.__retryCount) {
                    error.config.__retryCount = 0;
                    return this.retryRequest(error);
                }

                this.handleError(error);
                return Promise.reject(this.formatError(error));
            }
        );
    }

    async retryRequest(error) {
        const { config } = error;
        config.__retryCount = config.__retryCount || 0;

        if (config.__retryCount >= config.api.retryCount) {
            return Promise.reject(error);
        }

        config.__retryCount += 1;
        await new Promise(resolve => setTimeout(resolve, config.api.retryDelay));
        
        return this.client(config);
    }

    handleError(error) {
        if (error.response?.status === 401) {
            this.clearAuth();
        }
    }

    clearAuth() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('isLoggedIn');
    }

    formatError(error) {
        let message = 'An error occurred. Please try again.';

        if (error.code === 'ECONNABORTED') {
            message = 'Request timed out. Please try again.';
        } else if (error.code === 'ERR_NETWORK') {
            message = 'Network error. Please check your connection.';
        } else if (error.response?.data?.message) {
            message = error.response.data.message;
        }

        return {
            ...error,
            message
        };
    }

    // Auth methods
    async login(credentials) {
        try {
            const response = await this.client.post('/login', credentials);
            return response.data;
        } catch (error) {
            throw this.formatError(error);
        }
    }

    async signup(userData) {
        try {
            const response = await this.client.post('/signup', userData);
            return response.data;
        } catch (error) {
            throw this.formatError(error);
        }
    }

    async logout() {
        try {
            await this.client.post('/logout');
            this.clearAuth();
        } catch (error) {
            this.clearAuth(); // Clear auth even if request fails
            throw this.formatError(error);
        }
    }

    async checkAuth() {
        try {
            const response = await this.client.get('/user');
            return response.data;
        } catch (error) {
            this.clearAuth();
            throw this.formatError(error);
        }
    }
}

const apiService = new ApiService();
export default apiService; 