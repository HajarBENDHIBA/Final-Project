"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUserCircle } from 'react-icons/fa';
import apiService from '@/src/services/api';

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
        setIsLoggedIn(true);
        setUserRole(data.role);
      } catch (error) {
        // User is not logged in - this is expected
        setIsLoggedIn(false);
        setUserRole(null);
      }
    };

    checkAuth();
    const interval = setInterval(checkAuth, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
    // Add console.log to debug the role
    console.log('Current role:', userRole);
    
    if (userRole === 'admin') {
      router.push('/dashboard/admin');
    } else if (userRole === 'user') {
      router.push('/dashboard/user');
    } else {
      // If no role is set, redirect to login
      router.push('/account');
    }
    setIsProfileOpen(false);
  };

  const handleLogin = () => {
    router.push('/account');
    setIsProfileOpen(false);
  };

  const handleLogout = async () => {
    try {
      await apiService.logout();
      setIsLoggedIn(false);
      setUserRole(null);
      setIsProfileOpen(false);
      router.push('/account');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear state even if request fails
      setIsLoggedIn(false);
      setUserRole(null);
      setIsProfileOpen(false);
      router.push('/account');
    }
  };
  
  return (
    <nav className="bg-gray-50 p-4 text-gray-800 w-full z-50 shadow-sm sticky top-0">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <img src="/logo.png" alt="Green Heaven Logo" className="w-26 h-8 object-contain cursor-pointer" />
        </Link>

        {/* Navigation Links */}
        <ul className={`md:flex space-x-6 ${isMenuOpen ? "block absolute top-full left-0 w-full bg-gray-50 p-4 shadow-lg" : "hidden md:flex"}`}>
          <li className="hover:text-[#7FA15A]" onClick={() => setIsMenuOpen(false)}><Link href="/">Home</Link></li>
          <li className="hover:text-[#7FA15A]" onClick={() => setIsMenuOpen(false)}><Link href="/about">About Us</Link></li>
          <li className="hover:text-[#7FA15A]" onClick={() => setIsMenuOpen(false)}><Link href="/shop">Shop</Link></li>
          <li className="hover:text-[#7FA15A]" onClick={() => setIsMenuOpen(false)}><Link href="/blog">Blog</Link></li>
          <li className="hover:text-[#7FA15A]" onClick={() => setIsMenuOpen(false)}><Link href="/cart">Cart</Link></li>
          <li className="hover:text-[#7FA15A]" onClick={() => setIsMenuOpen(false)}><Link href="/contact">Contact Us</Link></li>
        </ul>

        {/* Profile and Menu Toggle */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button className="md:hidden text-3xl text-[#7FA15A]" onClick={handleMenuToggle}>
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
                      {userRole === 'admin' ? 'Admin Dashboard' : 'My Profile'}
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

