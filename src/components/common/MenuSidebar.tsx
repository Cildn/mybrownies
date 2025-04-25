"use client";

import { useSidebar } from "../context/SidebarContext";
import { X } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery } from "@apollo/client";
import { GET_CATEGORIES } from "@/lib/graphql/queries/categories";

export default function MenuSidebar() {
  const { isMenuOpen, toggleMenu } = useSidebar();
  const { data, loading, error } = useQuery(GET_CATEGORIES);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading categories</div>;

  const categories = data?.categories || [];

  return (
    <>
      {/* Background Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-md z-40"
          onClick={toggleMenu}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: isMenuOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 100 }}
        className="fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 p-6"
      >
        {/* Close Button */}
        <button className="absolute top-4 right-4" onClick={toggleMenu}>
          <X className="text-gray-600 w-6 h-6" />
        </button>

        {/* Navigation Links */}
        <nav className="mt-10 space-y-4 text-lg font-medium">
          <Link href="/" className="block hover:text-gray-900">Home</Link>
          <Link href="/shop" className="block hover:text-gray-900">Shop</Link>
          <Link href="/about" className="block hover:text-gray-900">About Us</Link>
          <Link href="/contact" className="block hover:text-gray-900">Contact</Link>
          {categories.map((category: { id: string; name: string; slug: string }) => (
            <Link key={category.id} href={`/category/${category.slug}`} className="block hover:text-gray-900">
              {category.name}
            </Link>
          ))}
        </nav>
      </motion.aside>
    </>
  );
}