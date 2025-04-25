import React from "react";

interface BreadcrumbsProps {
  path: string;
  onBreadcrumbClick: (path: string) => void;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ path, onBreadcrumbClick }) => {
  const segments = path.split("/");

  return (
    <div className="mb-4 text-sm text-gray-600">
      <span
        className="cursor-pointer hover:text-blue-500"
        onClick={() => onBreadcrumbClick("")}
      >
        Home
      </span>
      {segments.map((segment, index) => {
        const fullPath = segments.slice(0, index + 1).join("/");
        return (
          <span key={index}>
            <span className="mx-1">/</span>
            <span
              className="cursor-pointer hover:text-blue-500"
              onClick={() => onBreadcrumbClick(fullPath)}
            >
              {segment}
            </span>
          </span>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;