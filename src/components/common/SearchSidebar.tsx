"use client";

import { useSidebar } from "../context/SidebarContext";
import { X } from "lucide-react";
import { motion } from "framer-motion";

export default function SearchSidebar() {
  const { isSearchOpen, toggleSearch } = useSidebar();

  return (
    <>
      {/* Background Overlay */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-md z-40"
          onClick={toggleSearch}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: isSearchOpen ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 100 }}
        className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 p-6"
      >
        {/* Close Button */}
        <button className="absolute top-4 left-4" onClick={toggleSearch}>
          <X className="text-gray-600 w-6 h-6" />
        </button>

        {/* Search Input */}
        <h2 className="text-lg font-semibold mb-4">Search</h2>
        <input
          type="text"
          placeholder="Search products..."
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          autoFocus
        />

        {/* Example Search Results */}
        <div className="mt-4 space-y-3">
          <div className="p-3 border rounded-md">Product 1</div>
          <div className="p-3 border rounded-md">Product 2</div>
          <div className="p-3 border rounded-md">Product 3</div>
        </div>
      </motion.aside>
    </>
  );
}