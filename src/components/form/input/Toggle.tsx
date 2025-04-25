import React from "react";

interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ checked = false, onChange }) => {
  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-10 h-5 rounded-full transition ${
            checked ? "bg-blue-600" : "bg-gray-300"
          }`}
        ></div>
        <div
          className={`absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        ></div>
      </div>
    </label>
  );
};

export default Toggle;
