import express from "express";
import path from "path";
import fs from "fs/promises";

const router = express.Router();

// Helper function to get folder contents and calculate total size
const getFolderContents = async (basePath) => {
  try {
    const entries = await fs.readdir(basePath, { withFileTypes: true });

    // Get subfolders
    const folders = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => ({
        name: entry.name,
        type: "folder",
        size: "0 Bytes", // Placeholder
        files: 0, // Initialize file count
      }));

    // Get files directly in the current folder
    let totalSize = 0;
    let totalFiles = 0; // Track files in current folder
    const files = await Promise.all(
      entries
        .filter((entry) => !entry.isDirectory())
        .map(async (entry) => {
          const filePath = path.join(basePath, entry.name);
          const stats = await fs.stat(filePath);
          totalSize += stats.size;
          totalFiles += 1; // Increment file count for current folder
          return {
            name: entry.name,
            type: "file",
            category: getFileCategory(entry.name),
            size: formatBytes(stats.size),
            date: stats.mtime.toLocaleDateString(),
          };
        })
    );

    // Recursively calculate folder sizes and file counts
    for (const folder of folders) {
      const folderPath = path.join(basePath, folder.name);
      const folderContents = await getFolderContents(folderPath);

      // Aggregate files from nested subfolders
      files.push(...folderContents.files);

      // Update folder size and file count
      folder.size = formatBytes(folderContents.totalSize); // Update folder size
      folder.files = folderContents.totalFiles; // Update folder file count

      // Add folder's total size and file count to the parent folder
      totalSize += folderContents.totalSize;
      totalFiles += folderContents.totalFiles;
    }
    

    return {
      folders,
      files,
      totalSize,
      totalFiles: totalFiles + folders.reduce((acc, f) => acc + f.files, 0),
    };
  } catch (err) {
    console.error("Error getting folder contents:", err.message);
    throw err;
  }
};

// Fetch all top-level folders
router.get("/folders", async (req, res) => {
  try {
    const basePath = path.join(process.cwd(), "public", "uploads");
    const { folders } = await getFolderContents(basePath);
    res.json(folders);
  } catch (error) {
    console.error("Error fetching folders:", error.message);
    res.status(500).json({ error: "Failed to fetch folders", details: error.message });
  }
});

// Fetch subfolders/files for a specific folder
router.get("/folders/:folderPath*", async (req, res) => {
  try {
    const decodedPath = decodeURIComponent(req.params.folderPath || "");
    const basePath = path.join(process.cwd(), "public", "uploads", decodedPath);

    const stats = await fs.stat(basePath);
    if (!stats.isDirectory()) {
      return res.status(404).json({ error: "Folder not found" });
    }

    const { folders, files } = await getFolderContents(basePath);
    res.json({
      folders: folders || [],
      files: files || [],
    });
  } catch (error) {
    console.error("Error fetching folder contents:", error.message);
    res.status(500).json({ error: "Failed to fetch folder contents", details: error.message });
  }
});

// Helper function to determine file category
const getFileCategory = (fileName) => {
  const ext = path.extname(fileName).toLowerCase();
  if (/\.(mp4|mov|avi|mkv)$/.test(ext)) return "Video";
  if (/\.(jpg|jpeg|png|gif|webp)$/.test(ext)) return "Image";
  if (/\.(pdf|docx|txt|pptx)$/.test(ext)) return "Document";
  return "Other";
};

// Helper function to format bytes
const formatBytes = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export default router;