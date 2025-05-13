import axios from "axios";

// Upload a file to a specific folder
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
    console.error("Upload file error:", error);
    throw error;
  }
};

// Delete a file from a specific folder
export const deleteFile = async (folder: string, fileName: string) => {
  try {
    const response = await fetch("/api/files/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        folder: folder || "",
        fileName,
      }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { success: true, message: "File not found (already deleted)" };
      }

      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete file");
    }

    return await response.json();
  } catch (error) {
    console.error("Delete file error:", error);
    throw error;
  }
};

// Get contents of a folder (root or nested)
export const getFolderContents = async (folderPath: string = "") => {
  try {
    const url = folderPath
      ? `/api/folders/${folderPath
          .split("/")
          .map(encodeURIComponent)
          .join("/")}`
      : "/api/folders";

    const response = await axios.get(url);
    return response.data; // { folders: FolderItem[], files: FileItem[] }
  } catch (error) {
    console.error("Failed to fetch folder contents:", error);
    throw error;
  }
};