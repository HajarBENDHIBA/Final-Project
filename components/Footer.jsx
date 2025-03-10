import Image from "next/image";
import { FaFacebook, FaInstagram, FaGithub, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-500 py-12">
      <div className="container mx-auto px-8 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        
        {/* Quick Links Section */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold mb-4 text-[#7FA15A]">Quick Links</h3>
          <ul className="space-y-2 text-lg">
            <li><a href="/about" className="hover:text-[#7FA15A] transition-colors">About</a></li>
            <li><a href="/shop" className="hover:text-[#7FA15A] transition-colors">Shop</a></li>
            <li><a href="/blog" className="hover:text-[#7FA15A] transition-colors">Blog</a></li>
            <li><a href="/contact" className="hover:text-[#7FA15A] transition-colors">Contact</a></li>
          </ul>
        </div>

       {/* Contact Section */}
<div className="space-y-4">
  <h3 className="text-2xl font-semibold mb-4 text-[#7FA15A] text-center sm:text-left">Contact Us</h3>
  <div className="space-y-3">
    <p className="text-lg flex items-center gap-2 justify-center sm:justify-start">
      <FaMapMarkerAlt className="text-gray-600" /> Green Street, Casablanca, Morocco
    </p>
    <p className="text-lg flex items-center gap-2 justify-center sm:justify-start">
      <FaPhoneAlt className="text-gray-600" /> +212 762 752 337
    </p>
    <p className="text-lg flex items-center gap-2 justify-center sm:justify-start">
      <FaEnvelope className="text-gray-600" /> contact@greenheaven.com
    </p>
  </div>
</div>


       {/* Social Media + Logo Section */}
<div className="space-y-4 sm:text-center md:text-left">
  <h3 className="text-2xl font-semibold text-[#7FA15A] mb-8">Follow Us</h3>
  <div className="flex justify-center sm:justify-start space-x-8 text-3xl mb-4">
  <a 
    href="https://web.facebook.com/hajar.bendhiba.1" 
    target="_blank" 
    rel="noopener noreferrer" 
    className="hover:text-[#7FA15A] transition-colors"
  >
    <FaFacebook />
  </a>
  <a 
    href="https://www.instagram.com/hajarbendhiba/?next=%2F" 
    target="_blank" 
    rel="noopener noreferrer" 
    className="hover:text-[#7FA15A] transition-colors"
  >
    <FaInstagram />
  </a>
  <a 
    href="https://github.com/HajarBENDHIBA" 
    target="_blank" 
    rel="noopener noreferrer" 
    className="hover:text-[#7FA15A] transition-colors"
  >
    <FaGithub />
  </a>
</div>

  {/* Logo */}
  <div className="mt-16 flex justify-center sm:justify-start">
    <Image 
      src="/logo.png" 
      alt="Green Heaven Logo" 
      width={200} 
      height={140} 
    />
  </div>
</div>


      </div>

      {/* Copyright Section */}
      <div className="mt-8 pt-4 text-center text-lg text-gray-600">
        <p>&copy; 2025 Green Heaven. All rights reserved.</p>
      </div>
    </footer>
  );
}
