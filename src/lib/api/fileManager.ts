import axios from "axios";

export const uploadFile = async (file: File, folder: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  try {
    const response = await axios.post("/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw new Error("Upload failed");
  }
};

export const deleteFile = async (folder: string, fileName: string) => {
  try {
    const response = await fetch('/api/files/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        folder: folder || "", // Handle empty folder case
        fileName 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete file');
    }

    return await response.json();
  } catch (error) {
    console.error('Delete file error:', error);
    throw error;
  }
};

export const getFolderContents = async (folderPath: string = "") => {
  try {
    const response = await axios.get(`/api/folders/${encodeURIComponent(folderPath)}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch folder contents");
  }
};