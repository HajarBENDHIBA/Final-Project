"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const router = useRouter();

  // Check login status when the component mounts
  useEffect(() => {
    const userLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const role = localStorage.getItem("role") || ""; // Default to empty if null
    setIsLoggedIn(userLoggedIn);
    setUserRole(role);
  }, []);  

  // Toggle mobile menu
  const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);

  // Toggle profile dropdown
  const handleProfileToggle = () => setIsProfileOpen(!isProfileOpen);

  // Login handler
  const handleLogin = (role) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", role); // Store actual role dynamically
    setIsLoggedIn(true);
    setUserRole(role);
    setIsProfileOpen(false);
    router.push("/account"); // Redirect to account page after login
  };
  

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setUserRole("");
    setIsProfileOpen(false);
    router.push("/");
  };

  // Profile navigation
  const handleProfileClick = () => {
    const storedRole = localStorage.getItem("role"); // Get the role from localStorage
    setIsProfileOpen(false);
  
    if (storedRole === "admin") {
      router.push("/dashboard/admin");
    } else {
      router.push("/dashboard/user");
    }
  };
  
  return (
    <nav className="bg-gray-50 p-4 text-gray-800 w-full z-50 shadow-sm sticky top-0">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <img src="/logo.png" alt="Green Heaven Logo" className="w-26 h-8 object-contain cursor-pointer" />
        </Link>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-3xl text-[#7FA15A]" onClick={handleMenuToggle}>
          {isMenuOpen ? "✖" : "☰"}
        </button>

        {/* Navigation Links */}
        <ul className={`md:flex space-x-6 ${isMenuOpen ? "block absolute top-full left-0 w-full bg-gray-50 p-4 shadow-lg" : "hidden md:flex"}`}>
          <li className="hover:text-[#7FA15A]"><Link href="/">Home</Link></li>
          <li className="hover:text-[#7FA15A]"><Link href="/about">About Us</Link></li>
          <li className="hover:text-[#7FA15A]"><Link href="/shop">Shop</Link></li>
          <li className="hover:text-[#7FA15A]"><Link href="/blog">Blog</Link></li>
          <li className="hover:text-[#7FA15A]"><Link href="/cart">Cart</Link></li>
          <li className="hover:text-[#7FA15A]"><Link href="/contact">Contact Us</Link></li>
        </ul>

        {/* Profile Dropdown */}
        <div className="relative">
          <button onClick={handleProfileToggle} className="text-gray-700 text-3xl focus:outline-none">
            <FaUserCircle />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
              {isLoggedIn ? (
                <>
                  <button onClick={handleProfileClick} className="w-full text-left px-4 py-2 text-blue-600 hover:bg-gray-100">
                    Profile
                  </button>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
                    Logout
                  </button>
                </>
              ) : (
                <button onClick={handleLogin} className="w-full text-left px-4 py-2 text-blue-600 hover:bg-gray-100">
                  Login
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

