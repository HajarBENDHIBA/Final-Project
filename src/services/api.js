import axios from "axios";
import config from "../config";

class ApiService {
  constructor() {
    const isDev = process.env.NODE_ENV === "development";
    const baseURL = isDev
      ? "http://localhost:5000"
      : process.env.NEXT_PUBLIC_API_URL || "https://backend-green-heaven.vercel.app";

    this.client = axios.create({
      baseURL,
      timeout: 10000,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        // Add timestamp to prevent caching
        config.params = {
          ...config.params,
          _t: Date.now()
        };
        return config;
      },
      (error) => {
        console.error("Request error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        if (response.data?.token) {
          this.setAuthData(response.data);
        }
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Handle session expiration
        if (error.response?.status === 401) {
          if (!originalRequest._retry && this.hasAuthData() && !window.location.pathname.includes('/account')) {
            // Clear auth data and redirect to login
            this.clearAuth();
            if (typeof window !== 'undefined') {
              window.location.href = '/account';
            }
          }
          return Promise.reject(this.formatError(error));
        }

        // Retry on network errors or 504s
        if (!originalRequest._retry && (error.code === "ERR_NETWORK" || error.response?.status === 504)) {
          originalRequest._retry = true;
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(this.client(originalRequest));
            }, 2000);
          });
        }

        return Promise.reject(this.formatError(error));
      }
    );
  }

  setAuthData(data) {
    if (data.token) {
      localStorage.setItem("token", data.token);
      if (data.user?.role) {
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userData", JSON.stringify({
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
          role: data.user.role
        }));
      }
    }
  }

  hasAuthData() {
    return !!(localStorage.getItem("token") && localStorage.getItem("role"));
  }

  clearAuth() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userData");
  }

  formatError(error) {
    let message = "An error occurred. Please try again.";

    if (error.code === "ERR_NETWORK") {
      message = "Connection failed. Please check your internet connection and try again.";
    } else if (error.response?.status === 504) {
      message = "The server is taking too long to respond. Please try again.";
    } else if (error.response?.status === 401) {
      message = "Please log in to continue.";
    } else if (error.response?.status === 403) {
      message = "You don't have permission to perform this action.";
    } else if (error.response?.data?.message) {
      message = error.response.data.message;
    }

    return {
      ...error,
      message,
    };
  }

  async login(credentials) {
    try {
      console.log('Attempting login with:', { ...credentials, password: '[REDACTED]' });
      const response = await this.client.post("/api/login", credentials);
      console.log('Login response:', response.data);
      this.setAuthData(response.data);
      return response.data;
    } catch (error) {
      console.error('Login error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw this.formatError(error);
    }
  }

  async signup(userData) {
    try {
      console.log('Attempting signup with data:', { ...userData, password: '[REDACTED]' });
      const response = await this.client.post("/api/signup", userData);
      console.log('Signup response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Signup error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw this.formatError(error);
    }
  }

  async logout() {
    try {
      await this.client.post("/api/logout");
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuth();
      if (typeof window !== 'undefined') {
        window.location.href = '/account';
      }
    }
  }

  async checkAuth() {
    try {
      if (!this.hasAuthData()) {
        return null;
      }

      const response = await this.client.get("/api/user");
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        this.clearAuth();
        return null;
      }
      throw this.formatError(error);
    }
  }

  // Helper method to get user data from localStorage
  getUserData() {
    try {
      const userData = localStorage.getItem("userData");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
}

const apiService = new ApiService();
export default apiService;
