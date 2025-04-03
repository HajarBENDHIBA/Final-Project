"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";

export default function AdminLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsOpen(prevState => !prevState); // Toggle the sidebar state
  };

  return (
    <div className="flex">
      {/* Sidebar - Controlled by State */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Content */}
      <main className="w-full">{children}</main>

      {/* Sidebar Toggle Button (Lowered & Styled) */}
      <button
        onClick={handleToggleSidebar}  // Toggle open/close when clicked
        className="fixed top-40 left-6 bg-gray-700 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-300 hover:bg-gray-700 hover:scale-110 focus:outline-none flex items-center justify-center w-12 h-12"
      >
        ☰
      </button>
    </div>
  );
}
