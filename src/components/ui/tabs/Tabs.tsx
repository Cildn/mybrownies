import React from "react";

interface TabsProps {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}

interface TabProps {
  value: string;
  isActive?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ value, onChange, children }) => {
  return (
    <div className="border-b border-gray-300 dark:border-gray-700">
      <div className="flex space-x-4">
        {React.Children.map(children, (child) => {
          if (React.isValidElement<TabProps>(child)) {
            const isActive = child.props.value === value;
            return React.cloneElement(child, {
              isActive,
              onClick: () => onChange(child.props.value),
            });
          }
          return child;
        })}
      </div>
    </div>
  );
};

export const Tab: React.FC<TabProps> = ({ isActive, onClick, children }) => {
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