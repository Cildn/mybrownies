import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import MenuSidebar from "./MenuSidebar";
import SearchSidebar from "./SearchSidebar";
import CartSidebar from "./CartSidebar";
import FilterSidebar from "./FilterSidebar";

interface ProductType {
  id: string;
  name: string;
  category: { name: string };
  colors: string[];
  sizes: string[];
  prices: number[];
}

interface FiltersType {
  colors: string[];
  sizes: string[];
  priceRange: string | null;
  sortBy?: string;
}

interface SidebarProps {
  type: "menu" | "search" | "cart" | "filter" | null;
  onClose: () => void;
  products?: ProductType[];
  filters?: FiltersType;
  onFilterChange?: (type: keyof FiltersType, value: string) => void;
  onDone?: () => void;
  onClearAll?: () => void;
}

export default function Sidebar({
  type,
  onClose,
  products,
  filters,
  onFilterChange,
  onDone,
  onClearAll,
}: SidebarProps) {
  if (!type) return null;

  const base = "fixed top-0 h-full bg-white shadow-xl z-50 p-6 flex flex-col";
  const widths = { menu: "w-80", search: "w-96", cart: "w-96", filter: "w-80" };
  const variants = {
    hidden: { x: type === "menu" ? "-100%" : "100%", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", damping: 25, stiffness: 300 } },
    exit: { x: type === "menu" ? "-100%" : "100%", opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence mode="wait">
      {/* Add unique key to backdrop */}
      <motion.div
        key="backdrop"
        className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      {/* Add unique key to sidebar */}
      <motion.div
        key="sidebar"
        className={`${base} ${widths[type]} ${type === "menu" ? "left-0" : "right-0"}`}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={variants}
      >
        <button className="self-end mb-6 p-1 rounded-full hover:bg-gray-100" onClick={onClose}>
          <X size={24} className="text-gray-600" />
        </button>
        <div className="overflow-y-auto flex-1">
          {type === "menu" && <MenuSidebar />}
          {type === "search" && <SearchSidebar />}
          {type === "cart" && <CartSidebar />}
          {type === "filter" && products && filters && onFilterChange && onDone && onClearAll && (
            <FilterSidebar
              products={products}
              filters={filters}
              onFilterChange={onFilterChange}
              onDone={onDone}
              onClearAll={onClearAll}
            />
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}