import React from "react";
import { FileText, FileImage, FileVideo, Trash2, Eye } from "lucide-react";
import { deleteFile } from "@/lib/api/fileManager";

interface FileItem {
  name: string;
  category: string;
  size: string;
  date: string;
  folder: string;
  fullPath?: string; // Optional full path if available
}

interface FilesProps {
  files: FileItem[];
  onDelete: (fileName: string, folder: string) => void;
}

const getFileIcon = (category: string) => {
  switch (category) {
    case "Video":
      return <FileVideo className="text-gray-600" size={20} />;
    case "Image":
      return <FileImage className="text-gray-600" size={20} />;
    case "Document":
      return <FileText className="text-gray-600" size={20} />;
    default:
      return null;
  }
};

const Files: React.FC<FilesProps> = ({ files, onDelete }) => {
  const handleDelete = async (fileName: string, folder: string) => {
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) return;
  
    try {
      // First optimistically update UI
      onDelete(fileName, folder);
      
      // Then make the actual API call
      const result = await deleteFile(folder, fileName);
      
      if (!result.success) {
        // If API fails, show error and refresh files
        alert(`Delete failed: ${result.error}`);
        // You might want to trigger a refetch here
      }
    } catch (error: any) {
      console.error("Delete error:", error);
      alert(`Error: ${error.message}`);
      // You might want to trigger a refetch here
    }
  };

  return (
    <table className="w-full text-left border-collapse mt-4">
      <thead>
        <tr className="text-gray-500 text-sm border-b">
          <th className="py-2">File Name</th>
          <th className="py-2">Category</th>
          <th className="py-2">Size</th>
          <th className="py-2">Date Modified</th>
          <th className="py-2 text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {files.map((file, index) => (
          <tr key={index} className="border-b hover:bg-gray-50">
            <td className="py-3 flex items-center gap-2">
              {getFileIcon(file.category)}
              <span>{file.name}</span>
            </td>
            <td className="py-3">{file.category}</td>
            <td className="py-3">{file.size}</td>
            <td className="py-3">{file.date}</td>
            <td className="py-3 text-center flex justify-center gap-4">
              <button
                className="text-gray-500 hover:text-red-500"
                onClick={() => handleDelete(file.name, file.folder)}
                title="Delete file"
              >
                <Trash2 size={18} />
              </button>
              <button 
                className="text-gray-500 hover:text-blue-500"
                title="View file"
              >
                <Eye size={18} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Files;