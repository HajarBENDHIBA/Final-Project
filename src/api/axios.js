import axios from "axios";

// Determine the base URL based on the environment
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL + "/api";
  }
  return "https://backend-green-heaven.vercel.app/api";
};

// Create axios instance
const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: parseInt(process.env.NEXT_PUBLIC_TIMEOUT) || 30000,
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
    // Log request for debugging
    console.log("Making request to:", config.url);

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
    console.log("Received response from:", response.config.url);

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
    console.error("Response error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
    });

    // Try to retry the request if applicable
    if (error.config && !error.config.__isRetry) {
      error.config.__isRetry = true;
      return retryRequest(error);
    }

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Clear auth data on unauthorized
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("isLoggedIn");
      // Redirect to login if needed
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
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

export default api;
