"use client";
import React from "react";

interface InventoryTabProps {
  onTabChange: (tab: "Products" | "Collections") => void; // Updated type
}

const InventoryTab: React.FC<InventoryTabProps> = ({ onTabChange }) => {
  const [selected, setSelected] = React.useState<"Products" | "Collections">("Products");

  const handleTabChange = (tab: "Products" | "Collections") => {
    setSelected(tab);
    onTabChange(tab);
  };

  const getButtonClass = (option: "Products" | "Collections") =>
    selected === option
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
      <button
        onClick={() => handleTabChange("Products")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
          "Products"
        )}`}
      >
        Products
      </button>

      <button
        onClick={() => handleTabChange("Collections")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
          "Collections"
        )}`}
      >
        Collections
      </button>
    </div>
  );
};

export default InventoryTab;