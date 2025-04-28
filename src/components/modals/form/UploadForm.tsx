"use client";
import React, { useState } from "react";
import axios from "axios";
import DropzoneComponent from "@/components/form/input/DropZone";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";

export default function UploadFormModal({ onClose }: { onClose: () => void }) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fileFolder, setFileFolder] = useState("");

  // Supported file types
  const supportedFileTypes = ["image/jpeg", "image/png", "application/pdf", "video/mp4"];

  // Handle file uploads from Dropzone
  const handleFilesUpload = (files: File[]) => {
    const validFiles = files.filter((file) => supportedFileTypes.includes(file.type));
    if (files.length !== validFiles.length) {
      alert("Some files are not supported. Only JPEG, PNG, PDF, and MP4 files are allowed.");
    }
    setUploadedFiles(validFiles);
  };

  // Handle file removal
  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  // Handle file upload via REST API
  const handleUpload = async () => {
    if (uploadedFiles.length === 0) {
      alert("No files uploaded!");
      return;
    }
  
    if (!fileFolder) {
      alert("Please specify a folder for the files.");
      return;
    }
  
    try {
      await Promise.all(
        uploadedFiles.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("folder", fileFolder);
  
          const response = await axios.post("https://mybrownies.com.ng/api/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
              console.log("Upload Progress:", progressEvent.progress);
            },
          });
          console.log("File uploaded:", response.data);
        })
      );
  
      alert("Files uploaded successfully!");
      onClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error uploading files:", error.response?.data || error.message);
        alert(`Failed to upload files. Details: ${error.message}`);
      } else {
        console.error("Unknown error during file upload:", error);
        alert("An unknown error occurred. Please check the console for details.");
      }
    }
  };

  return (
    <div className="mt-10">
      {/* File Drop Zone */}
      <div className="mb-6">
        <DropzoneComponent onDrop={handleFilesUpload} />
      </div>

      {/* Folder Input */}
      <div className="mb-6">
        <Label>File Folder</Label>
        <input
          type="text"
          placeholder="Enter folder path (e.g., categories/subcategory)"
          value={fileFolder}
          onChange={(e) => setFileFolder(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Uploaded Files Preview */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700">Uploaded Files:</h4>
          <ul className="mt-2 space-y-2">
            {uploadedFiles.map((file, index) => (
              <li key={index} className="flex flex-col bg-gray-100 px-3 py-2 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 text-sm">{file.name}</span>
                  <button onClick={() => removeFile(index)} className="text-red-500 text-sm">
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-6">
        <Button size="sm" variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button size="sm" onClick={handleUpload}>
          Upload
        </Button>
      </div>
    </div>
  );
}