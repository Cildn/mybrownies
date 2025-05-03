// components/categories/Tabs.tsx

import { useState } from "react";

interface TabsProps {
  onTabChange: (tab: "products" | "collections") => void;
  onFiltersOpen: () => void;
  productCount: number;
  collectionCount: number;
}

const Tabs = ({ onTabChange, onFiltersOpen, productCount, collectionCount }: TabsProps) => {
  const [activeTab, setActiveTab] = useState<"products" | "collections">("products");

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12">
      <div className="flex space-x-4 md:space-x-8 mb-4 md:mb-0">
        <button
          onClick={() => {
            setActiveTab("products");
            onTabChange("products");
          }}
          className={`px-4 py-2 md:px-6 md:py-3 rounded ${
            activeTab === "products"
              ? "bg-gray-200 text-gray-800"
              : "text-gray-500 hover:text-gray-700"
          } transition-colors duration-300`}
        >
          Products
        </button>
        <button
          onClick={() => {
            setActiveTab("collections");
            onTabChange("collections");
          }}
          className={`px-4 py-2 md:px-6 md:py-3 rounded ${
            activeTab === "collections"
              ? "bg-gray-200 text-gray-800"
              : "text-gray-500 hover:text-gray-700"
          } transition-colors duration-300`}
        >
          Collections
        </button>
      </div>

      <div className="flex items-center space-x-4 md:space-x-8">
        {activeTab === "products"
          ? `${productCount} Product${productCount !== 1 ? "s" : ""}`
          : `${collectionCount} Collection${collectionCount !== 1 ? "s" : ""}`}
      </div>

      <button
        onClick={onFiltersOpen}
        className="bg-gray-900 text-white px-4 py-2 md:px-6 md:py-3 rounded hover:bg-gray-800 transition-colors duration-300 mt-4 md:mt-0"
      >
        Filters
      </button>
    </div>
  );
};

export default Tabs;