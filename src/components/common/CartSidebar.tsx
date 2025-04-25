"use client";

import { useSidebar } from "../context/SidebarContext";
import { X } from "lucide-react";
import { motion } from "framer-motion";

export default function CartSidebar() {
  const { isCartOpen, toggleCart } = useSidebar();

  return (
    <>
      {/* Background Overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-md z-40"
          onClick={toggleCart}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: isCartOpen ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 100 }}
        className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 p-6"
      >
        {/* Close Button */}
        <button className="absolute top-4 left-4" onClick={toggleCart}>
          <X className="text-gray-600 w-6 h-6" />
        </button>

        {/* Cart Header */}
        <h2 className="text-xl font-bold mb-6">Your Cart</h2>

        {/* Cart Items (Placeholder for now) */}
        <div className="flex flex-col space-y-4">
          <div className="border p-4 flex justify-between">
            <span>Product Name</span>
            <span>$199</span>
          </div>
        </div>

        {/* Checkout Button */}
        <button className="w-full mt-6 py-2 bg-gray-900 text-white rounded-md">
          Checkout
        </button>
      </motion.aside>
    </>
  );
}