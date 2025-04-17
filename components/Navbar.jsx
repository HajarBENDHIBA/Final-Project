"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import apiService from "@/src/services/api";
import Image from "next/image";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const profileRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await apiService.checkAuth();
        console.log("Auth check response:", data);
        if (data) {
          setIsLoggedIn(true);
          setUserRole(data.role);
          console.log("Setting user role to:", data.role);
        } else {
          // Check localStorage as fallback
          const storedRole = localStorage.getItem("role");
          const storedIsLoggedIn = localStorage.getItem("isLoggedIn");

          if (storedIsLoggedIn === "true" && storedRole) {
            setIsLoggedIn(true);
            setUserRole(storedRole);
            console.log("Using stored role from localStorage:", storedRole);
          } else {
            setIsLoggedIn(false);
            setUserRole(null);
            console.log("No auth data found, clearing role");
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        // User is not logged in - this is expected
        setIsLoggedIn(false);
        setUserRole(null);
      }
    };

    checkAuth();
    // Reduce the frequency of auth checks to avoid overwhelming the server
    const interval = setInterval(checkAuth, 30000); // Check every 30 seconds instead of 5
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleProfileToggle = (e) => {
    e.stopPropagation();
    setIsProfileOpen(!isProfileOpen);
  };

  const handleProfileClick = () => {
    console.log("Profile click - Current state:", {
      isLoggedIn,
      userRole,
      localStorage: {
        role: localStorage.getItem("role"),
        isLoggedIn: localStorage.getItem("isLoggedIn"),
      },
    });

    // Check both state and localStorage for role
    const currentRole = userRole || localStorage.getItem("role");

    if (currentRole === "admin") {
      console.log("Redirecting to admin dashboard");
      router.push("/dashboard/admin");
    } else if (currentRole === "user") {
      console.log("Redirecting to user dashboard");
      router.push("/dashboard/user");
    } else {
      console.log("No role found, redirecting to account");
      router.push("/account");
    }
    setIsProfileOpen(false);
  };

  const handleLogin = () => {
    router.push("/account");
    setIsProfileOpen(false);
  };

  const handleLogout = async () => {
    try {
      await apiService.logout();
      setIsLoggedIn(false);
      setUserRole(null);
      setIsProfileOpen(false);
      router.push("/account");
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear state even if request fails
      setIsLoggedIn(false);
      setUserRole(null);
      setIsProfileOpen(false);
      router.push("/account");
    }
  };

  return (
    <nav className="bg-gray-50 p-4 text-gray-800 w-full z-50 shadow-sm sticky top-0">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Green Heaven Logo"
            width={104}
            height={32}
            priority
            className="object-contain cursor-pointer"
          />
        </Link>

        {/* Navigation Links */}
        <ul
          className={`md:flex space-x-6 ${
            isMenuOpen
              ? "block absolute top-full left-0 w-full bg-gray-50 p-4 shadow-lg"
              : "hidden md:flex"
          }`}
        >
          <li
            className="hover:text-[#7FA15A]"
            onClick={() => setIsMenuOpen(false)}
          >
            <Link href="/">Home</Link>
          </li>
          <li
            className="hover:text-[#7FA15A]"
            onClick={() => setIsMenuOpen(false)}
          >
            <Link href="/about">About Us</Link>
          </li>
          <li
            className="hover:text-[#7FA15A]"
            onClick={() => setIsMenuOpen(false)}
          >
            <Link href="/shop">Shop</Link>
          </li>
          <li
            className="hover:text-[#7FA15A]"
            onClick={() => setIsMenuOpen(false)}
          >
            <Link href="/blog">Blog</Link>
          </li>
          <li
            className="hover:text-[#7FA15A]"
            onClick={() => setIsMenuOpen(false)}
          >
            <Link href="/cart">Cart</Link>
          </li>
          <li
            className="hover:text-[#7FA15A]"
            onClick={() => setIsMenuOpen(false)}
          >
            <Link href="/contact">Contact Us</Link>
          </li>
        </ul>

        {/* Profile and Menu Toggle */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-3xl text-[#7FA15A]"
            onClick={handleMenuToggle}
          >
            {isMenuOpen ? "✖" : "☰"}
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={handleProfileToggle}
              className="text-gray-700 text-3xl focus:outline-none"
            >
              <FaUserCircle />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={handleProfileClick}
                      className="w-full text-left px-4 py-2 text-blue-600 hover:bg-gray-100"
                    >
                      {userRole === "admin" ? "Admin Dashboard" : "My Profile"}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleLogin}
                    className="w-full text-left px-4 py-2 text-blue-600 hover:bg-gray-100"
                  >
                    Login
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
