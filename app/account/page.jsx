"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import apiService from "@/src/services/api";

export default function Account() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        
        if (token && role) {
          if (role === 'admin') {
            router.replace('/dashboard/admin');
          } else {
            router.replace('/dashboard/user');
          }
          return;
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsPageLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const data = await apiService.login({ email, password });
      console.log("Login response:", data);

      if (data.user && data.user.role) {
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("isLoggedIn", "true");
        console.log("Stored role in localStorage:", data.user.role);
        
        // Add a small delay before navigation
        setTimeout(() => {
          if (data.user.role === "admin") {
            router.replace("/dashboard/admin");
          } else {
            router.replace("/dashboard/user");
          }
        }, 100);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Failed to log in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await apiService.signup({
        username,
        email,
        password,
      });

      console.log("✅ Signup response:", res);
      setIsLogin(true);
      setEmail("");
      setPassword("");
      setUsername("");
      setError("Account created successfully! Please log in.");
    } catch (error) {
      console.error("Signup error:", error);
      setError(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7FA15A]"></div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Your Account
        </h2>

        <div className="flex justify-center mb-6 space-x-4">
          <button
            className={`w-1/2 py-2 text-lg font-semibold ${
              isLogin ? "bg-[#7FA15A] text-white" : "bg-gray-200 text-gray-800"
            } rounded-lg transition-all duration-300`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`w-1/2 py-2 text-lg font-semibold ${
              !isLogin ? "bg-[#7FA15A] text-white" : "bg-gray-200 text-gray-800"
            } rounded-lg transition-all duration-300`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {isLogin ? (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-center text-gray-800">
              Login
            </h3>
            <form className="space-y-4" onSubmit={handleLoginSubmit}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7FA15A]"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7FA15A]"
              />
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 text-white ${
                  isLoading ? "bg-gray-400" : "bg-[#7FA15A] hover:bg-green-900"
                } rounded-lg transition-all duration-300`}
              >
                {isLoading ? "Loading..." : "Log In"}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-center text-gray-800">
              Sign Up
            </h3>
            <form className="space-y-4" onSubmit={handleSignUpSubmit}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7FA15A]"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7FA15A]"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7FA15A]"
              />
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 text-white ${
                  isLoading ? "bg-gray-400" : "bg-[#7FA15A] hover:bg-green-900"
                } rounded-lg transition-all duration-300`}
              >
                {isLoading ? "Loading..." : "Sign Up"}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Images Section */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="flex justify-center">
          <img
            src="/1.jpg"
            alt="Image 1"
            className="w-full h-68 object-cover rounded-lg shadow-lg"
          />
        </div>
        <div className="flex justify-center">
          <img
            src="/2.jpg"
            alt="Image 2"
            className="w-full h-68 object-cover rounded-lg shadow-lg"
          />
        </div>
        <div className="flex justify-center">
          <img
            src="/blog.jpg"
            alt="Image 3"
            className="w-full h-68 object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
