// components/Sidebar.tsx
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import MenuSidebar from "./MenuSidebar";
import SearchSidebar from "./SearchSidebar";
import CartSidebar from "./CartSidebar";
import FilterSidebar from "./FilterSidebar";

interface SidebarProps {
  type: "menu" | "search" | "cart" | "filter" | null;
  onClose: () => void;
  products?: any[]; // Add products prop
  collections?: any[]; // Add collections prop
}

export default function Sidebar({ type, onClose, products, collections }: SidebarProps) {
  if (!type) return null;

  // Common sidebar styles
  const baseStyles = "fixed top-0 h-full bg-white shadow-xl z-50 p-6 flex flex-col";

  // Different widths based on sidebar type
  const widthStyles = {
    menu: "w-80", // Wider for menu
    search: "w-96", // Extra wide for search
    cart: "w-96", // Wide for cart
    filter: "w-80", // Standard for filters
  };

  const sidebarVariants = {
    hidden: { x: type === "menu" ? "-100%" : "100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", damping: 25, stiffness: 300 },
    },
    exit: {
      x: type === "menu" ? "-100%" : "100%",
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {/* Overlay with subtle blur */}
      <motion.div
        key="overlay"
        className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Sidebar with floating appearance */}
      <motion.div
        key={type}
        className={`${baseStyles} ${widthStyles[type]} ${
          type === "menu" ? "left-0" : "right-0"
        }`}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={sidebarVariants}
        style={{
          boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Close button with better styling */}
        <button
          className="self-end mb-6 p-1 rounded-full hover:bg-gray-100 transition-colors"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X size={24} className="text-gray-600" />
        </button>

        {/* Sidebar content */}
        <div className="overflow-y-auto flex-1">
          {type === "menu" && <MenuSidebar />}
          {type === "search" && <SearchSidebar />}
          {type === "cart" && <CartSidebar />}
          {type === "filter" && (
            <FilterSidebar products={products} collections={collections} />
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}