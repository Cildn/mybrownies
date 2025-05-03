import React, { useState } from "react";
import { FileText, FileImage, FileVideo, Trash2, Eye } from "lucide-react";
import Image from "next/image";

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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);

  const handleDelete = async (fileName: string, folder: string) => {
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) return;
  
    try {
      const response = await fetch('/api/files/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ folder, fileName }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete file');
      }
  
      const data = await response.json();
      if (data.success) {
        onDelete(fileName, folder);
      }
    } catch (error) {
      // Remove the `any` type assertion here
      console.error("Delete error:", error);
      alert(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleView = (file: FileItem) => {
    setPreviewFile(file);
    setIsPreviewOpen(true);
  };

  const constructFilePath = (file: FileItem) => {
    return `/uploads/${file.folder}/${file.name}`;
  };

  return (
    <div>
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
                  onClick={() => handleView(file)}
                  title="View file"
                >
                  <Eye size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* File Preview Modal */}
      {previewFile && (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 ${isPreviewOpen ? 'block' : 'hidden'}`}>
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full">
            <div className="flex justify-end mb-4">
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsPreviewOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="file-preview">
              {previewFile.category === "Image" && (
                <Image
                src={constructFilePath(previewFile)}
                alt={previewFile.name}
                className="max-w-full max-h-96 rounded-lg"
                width={800} // Add width
                height={600} // Add height
              />
              )}
              {previewFile.category === "Video" && (
                <video 
                  src={constructFilePath(previewFile)} 
                  controls 
                  className="max-w-full max-h-96 rounded-lg"
                />
              )}
              {previewFile.category === "Document" && (
                <embed 
                  src={constructFilePath(previewFile)} 
                  type="application/pdf" 
                  className="w-full h-96"
                />
              )}
              {previewFile.category === "Other" && (
                <div className="text-center text-gray-500">
                  Preview not available for this file type.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Files;