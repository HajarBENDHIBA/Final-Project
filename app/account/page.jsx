'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Account() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const router = useRouter(); 

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", 
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('Login successful, role:', data.user.role);
        
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("isLoggedIn", "true");
        
        if (data.user.role === "admin") {
          router.push("/dashboard/admin");
        } else {
          router.push("/dashboard/user");
        }
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Something went wrong");
    }
  };  

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
        credentials: "include",
      });
  
      const data = await response.json();
      if (response.ok) {
        setIsLogin(true);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Something went wrong");
    }
  };
  
  return (
    <section className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Your Account</h2>

        <div className="flex justify-center mb-6 space-x-4">
          <button
            className={`w-1/2 py-2 text-lg font-semibold ${isLogin ? 'bg-[#7FA15A] text-white' : 'bg-gray-200 text-gray-800'} rounded-lg transition-all duration-300`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`w-1/2 py-2 text-lg font-semibold ${!isLogin ? 'bg-[#7FA15A] text-white' : 'bg-gray-200 text-gray-800'} rounded-lg transition-all duration-300`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {isLogin ? (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-center text-gray-800">Login</h3>
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
                className="w-full py-3 text-white bg-[#7FA15A] rounded-lg hover:bg-green-900 transition-all duration-300"
              >
                Log In
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-center text-gray-800">Sign Up</h3>
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
                className="w-full py-3 text-white bg-[#7FA15A] rounded-lg hover:bg-green-900 transition-all duration-300"
              >
                Sign Up
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Images Section */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="flex justify-center">
          <img src="/1.jpg" alt="Image 1" className="w-full h-68 object-cover rounded-lg shadow-lg" />
        </div>
        <div className="flex justify-center">
          <img src="/2.jpg" alt="Image 2" className="w-full h-68 object-cover rounded-lg shadow-lg" />
        </div>
        <div className="flex justify-center">
          <img src="/blog.jpg" alt="Image 3" className="w-full h-68 object-cover rounded-lg shadow-lg" />
        </div>
      </div>
    </section>
  );
}
