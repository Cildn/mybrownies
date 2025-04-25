import React from "react";
import { LucideIcon } from "lucide-react";

interface MediaCardProps {
  icon: LucideIcon;
  title: string;
  files: number;
  usage: number; // Usage as a number (e.g., 5.00)
  size: string; // Formatted size (e.g., "2.25 MB")
  color: string;
}

const MediaCard: React.FC<MediaCardProps> = ({ icon: Icon, title, files, usage, size, color }) => {
  return (
    <div className="flex justify-between items-center w-full bg-gray-50 p-4 rounded-lg">
      {/* Left Section: Icon + Title + Usage */}
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div
          className={`flex items-center justify-center w-10 h-10 rounded-full bg-${color}-100`}
          style={{ backgroundColor: `${color}-100` }}
        >
          <Icon className={`text-${color}-500`} size={20} />
        </div>
        {/* Title & Usage */}
        <div className="flex flex-col">
          <h3 className="font-semibold text-gray-800">{title}</h3>
          {usage > 0 && (
            <p className="text-gray-500 text-sm">{usage}% Used</p>
          )}
        </div>
      </div>

      {/* Right Section: Files + Size */}
      <div className="flex flex-col text-gray-600 text-sm text-right">
        <p>{files} files</p>
        <span>{size}</span>
      </div>
    </div>
  );
};

export default MediaCard;