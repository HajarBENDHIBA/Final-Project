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
                const originalRequest = error.config;

                // Don't retry if we've already retried or it's a 401
                if (originalRequest._retry || error.response?.status === 401) {
                    return Promise.reject(this.formatError(error));
                }

                // Retry on network errors or 504s
                if (error.code === 'ERR_NETWORK' || error.response?.status === 504) {
                    originalRequest._retry = true;
                    return new Promise(resolve => {
                        setTimeout(() => {
                            resolve(this.client(originalRequest));
                        }, 2000); // Wait 2 seconds before retrying
                    });
                }

                return Promise.reject(this.formatError(error));
            }
        );
    }

    clearAuth() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('isLoggedIn');
    }

    formatError(error) {
        let message = 'An error occurred. Please try again.';

        if (error.code === 'ERR_NETWORK') {
            message = 'Connection failed. Please check your internet connection and try again.';
        } else if (error.response?.status === 504) {
            message = 'The server is taking too long to respond. Please try again.';
        } else if (error.response?.status === 401) {
            message = 'Please log in to continue.';
        } else if (error.response?.data?.message) {
            message = error.response.data.message;
        }

        return {
            ...error,
            message
        };
    }

    // Auth methods with improved error handling
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
            this.clearAuth();
            throw this.formatError(error);
        }
    }

    async checkAuth() {
        try {
            const response = await this.client.get('/user');
            return response.data;
        } catch (error) {
            // Don't throw on 401 during auth check
            if (error.response?.status === 401) {
                this.clearAuth();
                return null;
            }
            throw this.formatError(error);
        }
    }
}

const apiService = new ApiService();
export default apiService; 