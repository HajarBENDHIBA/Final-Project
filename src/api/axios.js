import axios from "axios";

// Determine the base URL based on the environment
const getBaseUrl = () => {
  // Debug environment variables
  console.log("Environment Variables:", {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NODE_ENV: process.env.NODE_ENV,
  });

  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://backend-green-heaven.vercel.app";
  console.log("Using API Base URL:", baseUrl);
  return baseUrl;
};

// Create axios instance
const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Credentials": "true",
  },
  timeout: parseInt(process.env.NEXT_PUBLIC_TIMEOUT) || 60000,
});

// Log initial configuration
console.log("API Configuration:", {
  baseURL: api.defaults.baseURL,
  timeout: api.defaults.timeout,
  withCredentials: api.defaults.withCredentials,
  headers: api.defaults.headers,
});

// Retry logic
const retryCount = parseInt(process.env.NEXT_PUBLIC_RETRY_COUNT) || 3;
const retryDelay = parseInt(process.env.NEXT_PUBLIC_RETRY_DELAY) || 1000;

const retryRequest = async (error, retries = retryCount) => {
  const shouldRetry =
    retries > 0 &&
    (error.code === "ECONNABORTED" ||
      error.code === "ERR_NETWORK" ||
      (error.response &&
        (error.response.status === 504 || error.response.status === 408)));

  if (shouldRetry) {
    await new Promise((resolve) => setTimeout(resolve, retryDelay));
    const config = error.config;
    console.log(
      `Retrying request (${retryCount - retries + 1}/${retryCount})...`
    );
    return api(config).catch((err) => retryRequest(err, retries - 1));
  }

  return Promise.reject(error);
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Ensure URL starts with /api
    if (!config.url.startsWith("/api/")) {
      config.url = "/api/" + config.url.replace(/^\/+/, "");
    }

    // Add CORS headers for all requests
    config.headers["Access-Control-Allow-Origin"] = "http://localhost:3000";
    config.headers["Access-Control-Allow-Credentials"] = "true";

    // Log request for debugging
    console.log("Making request to:", {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
    });

    // Add token to request if it exists
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log successful response for debugging
    console.log("Received response:", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });

    // Handle successful responses
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
      if (response.data?.user?.role) {
        localStorage.setItem("role", response.data.user.role);
        localStorage.setItem("isLoggedIn", "true");
      }
    }
    return response;
  },
  async (error) => {
    // Don't log 401s for /api/user as they're expected when not logged in
    if (
      !(
        error.config.url.includes("/api/user") && error.response?.status === 401
      )
    ) {
      console.error("Response error:", {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
    }

    // Try to retry the request if it's a network error or timeout
    if (
      error.config &&
      !error.config.__isRetry &&
      (error.code === "ECONNABORTED" ||
        error.code === "ERR_NETWORK" ||
        error.response?.status === 504)
    ) {
      error.config.__isRetry = true;
      return new Promise((resolve) => setTimeout(resolve, 2000)).then(() =>
        api(error.config)
      );
    }

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Clear auth data on unauthorized
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("isLoggedIn");

      // Only redirect to login if not already on login/signup page
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login") &&
        !window.location.pathname.includes("/signup")
      ) {
        window.location.href = "/login";
      }
    }

    // Format error messages
    let errorMessage = "An error occurred. Please try again.";

    if (error.code === "ECONNABORTED") {
      errorMessage = "Request timed out. Please try again.";
    } else if (error.code === "ERR_NETWORK") {
      errorMessage = "Network error. Please check your connection.";
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    return Promise.reject({
      ...error,
      message: errorMessage,
    });
  }
);

// Export the configured axios instance
export default api;
