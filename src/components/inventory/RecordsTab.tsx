"use client";
import React from "react";

interface RecordsTabProps {
  onTabChange: (tab: "Orders" | "Invoices") => void; // Updated type
}

const RecordsTab: React.FC<RecordsTabProps> = ({ onTabChange }) => {
  const [selected, setSelected] = React.useState<"Orders" | "Invoices">("Orders");

  const handleTabChange = (tab: "Orders" | "Invoices") => {
    setSelected(tab);
    onTabChange(tab);
  };

  const getButtonClass = (option: "Orders" | "Invoices") =>
    selected === option
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
      <button
        onClick={() => handleTabChange("Orders")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
          "Orders"
        )}`}
      >
        Orders
      </button>

      <button
        onClick={() => handleTabChange("Invoices")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
          "Invoices"
        )}`}
      >
        Invoices
      </button>
    </div>
  );
};

export default RecordsTab;