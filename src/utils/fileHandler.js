import fs from "fs/promises";
import path from "path";

/**
 * Sanitizes a folder path to prevent directory traversal attacks
 * @param {string} folder - The folder path
 * @returns {string} - Sanitized folder path
 */
export const sanitizeFolderPath = (folder) => {
  return folder.replace(/\.\./g, "").replace(/\/+/g, "/");
};

/**
 * Saves an uploaded file to a specified folder
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} fileName - Desired file name (sanitized)
 * @param {string} folder - Destination folder (relative to 'public/uploads')
 * @returns {string} - Relative file path
 */
export const saveFile = async (fileBuffer, fileName, folder) => {
  try {
    // Sanitize folder path
    const sanitizedFolder = sanitizeFolderPath(folder);

    // Resolve upload directory
    const uploadDir = path.resolve("public", "uploads", sanitizedFolder);
    await fs.mkdir(uploadDir, { recursive: true });

    // Resolve full file path
    const filePath = path.join(uploadDir, fileName);

    // Write the file buffer to the filesystem
    await fs.writeFile(filePath, fileBuffer);

    // Return the relative URL path
    return `/uploads/${sanitizedFolder}/${fileName}`;
  } catch (error) {
    console.error("Error saving file:", error);
    throw new Error("Failed to save the file");
  }
};

/**
 * Deletes a file by relative URL path
 * @param {string} fileUrl - The file URL (e.g., '/uploads/folder/filename.jpg')
 */
export const deleteFile = async (fileUrl) => {
  try {
    // Resolve the absolute file path
    const filePath = path.resolve("public", fileUrl.slice(1)); // Remove leading "/"

    // Check if the file exists before attempting to delete
    const fileExists = await fileExistsCheck(filePath);
    if (!fileExists) {
      console.warn("File not found or already deleted:", filePath);
      return;
    }

    // Delete the file
    await fs.unlink(filePath);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw new Error("Failed to delete the file");
  }
};

/**
 * Moves or renames a file
 * @param {string} oldPath - Current file path
 * @param {string} newPath - New file path
 */
export const moveFile = async (oldPath, newPath) => {
  try {
    // Ensure the destination directory exists
    const destinationDir = path.dirname(newPath);
    await fs.mkdir(destinationDir, { recursive: true });

    // Move the file
    await fs.rename(oldPath, newPath);
  } catch (error) {
    console.error("Error moving file:", error);
    throw new Error("Failed to move the file");
  }
};

/**
 * Checks if a file exists at the given path
 * @param {string} filePath - Absolute file path
 * @returns {boolean} - True if the file exists, false otherwise
 */
export const fileExistsCheck = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};