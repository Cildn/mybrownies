import React, { useState } from "react";

interface TabsProps {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ value, onChange, children }) => {
  return (
    <div className="border-b border-gray-300 dark:border-gray-700">
      <div className="flex space-x-4">
        {React.Children.map(children, (child) =>
          React.isValidElement(child)
            ? React.cloneElement(child, { isActive: child.props.value === value, onClick: () => onChange(child.props.value) })
            : child
        )}
      </div>
    </div>
  );
};

interface TabProps {
  value: string;
  isActive?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export const Tab: React.FC<TabProps> = ({ value, isActive, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-4 text-sm font-medium focus:outline-none ${
        isActive ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {children}
    </button>
  );
};
