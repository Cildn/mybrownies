import React from "react";

type BadgeVariant = "light" | "solid";
type BadgeSize = "sm" | "md";
type BadgeColor =
  | "primary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "light"
  | "dark";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  color?: BadgeColor;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  variant = "light",
  color = "primary",
  size = "md",
  startIcon,
  endIcon,
  children,
}) => {
  const baseStyles = "inline-flex items-center rounded-full font-medium";

  // Size styles
  const sizeStyles = {
    sm: "text-xs px-2.5 py-0.5",
    md: "text-sm px-3 py-1",
  };

  // Color styles for variants
  const variants = {
    light: {
      primary: "bg-blue-50 text-blue-700",
      success: "bg-green-50 text-green-700",
      error: "bg-red-50 text-red-700",
      warning: "bg-yellow-50 text-yellow-700",
      info: "bg-purple-50 text-purple-700",
      light: "bg-gray-50 text-gray-700",
      dark: "bg-gray-800 text-white",
    },
    solid: {
      primary: "bg-blue-600 text-white",
      success: "bg-green-600 text-white",
      error: "bg-red-600 text-white",
      warning: "bg-yellow-500 text-white",
      info: "bg-blue-500 text-white",
      light: "bg-gray-200 text-gray-800",
      dark: "bg-gray-800 text-white",
    },
  };

  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${variants[variant][color]}`}>
      {startIcon && <span className="mr-1.5">{startIcon}</span>}
      {children}
      {endIcon && <span className="ml-1.5">{endIcon}</span>}
    </span>
  );
};

export default Badge;