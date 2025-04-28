// src/routes/files.js
import express from "express";
import path from "path";
import fs from "fs/promises";

const router = express.Router();

// Helper function to categorize files recursively
const categorizeFiles = async (folderPath, recordsFolderPath) => {
  const categories = {
    images: { files: [], size: 0 },
    videos: { files: [], size: 0 },
    audio: { files: [], size: 0 },
    docs: { files: [], size: 0 },
    uploads: { files: [], size: 0 },
    downloads: { files: [], size: 0 },
  };

  try {
    // Function to calculate the size of a directory
    const calculateDirectorySize = async (dir) => {
      const files = await fs.readdir(dir, { withFileTypes: true });
      let totalSize = 0;

      for (const file of files) {
        const filePath = path.join(dir, file.name);

        if (file.isDirectory()) {
          totalSize += await calculateDirectorySize(filePath);
        } else {
          const stats = await fs.stat(filePath);
          totalSize += stats.size;
        }
      }

      return totalSize;
    };

    // Calculate the size of the records folder
    const recordsSize = await calculateDirectorySize(recordsFolderPath);

    // Traverse the main folder to categorize files
    const traverseDirectory = async (dir) => {
      const files = await fs.readdir(dir, { withFileTypes: true });

      for (const file of files) {
        const filePath = path.join(dir, file.name);

        if (file.isDirectory()) {
          await traverseDirectory(filePath);
        } else {
          // Skip specific files like .DS_Store
          if (/\.(DS_Store|Thumbs\.db)$/.test(file.name)) continue;

          const ext = path.extname(file.name).toLowerCase();
          const stats = await fs.stat(filePath);

          console.log(`Processing file: ${filePath}, Size: ${stats.size} bytes`);

          if (/\.(jpg|jpeg|png|gif|webp)$/.test(ext)) {
            categories.images.files.push(filePath);
            categories.images.size += stats.size;
          } else if (/\.(mp4|mov|avi|mkv)$/.test(ext)) {
            categories.videos.files.push(filePath);
            categories.videos.size += stats.size;
          } else if (/\.(mp3|wav|flac)$/.test(ext)) {
            categories.audio.files.push(filePath);
            categories.audio.size += stats.size;
          } else if (/\.(pdf|docx|txt|pptx)$/.test(ext)) {
            categories.docs.files.push(filePath);
            categories.docs.size += stats.size;
          } else {
            categories.uploads.files.push(filePath);
            categories.uploads.size += stats.size;
          }
        }
      }
    };

    await traverseDirectory(folderPath);

    // Assign the records size to the downloads category
    categories.downloads.size = recordsSize;

    // Calculate uploads size as total size minus downloads size
    const totalSize =
      categories.images.size +
      categories.videos.size +
      categories.audio.size +
      categories.docs.size +
      categories.uploads.size;

    categories.uploads.size = totalSize - recordsSize;
  } catch (err) {
    console.error("Error categorizing files:", err.message);
  }

  return categories;
};

// Fetch categorized file counts and sizes
router.get("/files/stats", async (req, res) => {
  try {
    const folder = req.query.folder || "";
    const basePath = path.join(process.cwd(), "public", "uploads", folder);

    // Path to the records folder
    const recordsFolderPath = path.join(process.cwd(), "public", "uploads", "records");

    // Ensure the directory exists
    if (!(await fs.stat(basePath)).isDirectory()) {
      return res.status(404).json({ error: "Directory not found" });
    }

    const stats = await categorizeFiles(basePath, recordsFolderPath);

    // Total disk size (dynamic or hardcoded)
    const totalDiskSize = process.env.TOTAL_DISK_SIZE || 100 * 1024 * 1024 * 1024;

    // Calculate total size of all files
    const totalSize =
      stats.images.size +
      stats.videos.size +
      stats.audio.size +
      stats.docs.size +
      stats.uploads.size +
      stats.downloads.size;

    // Return enhanced stats
    res.json({
      diskUsage: {
        totalSize: formatBytes(totalSize),
        percentageUsed: ((totalSize / totalDiskSize) * 100).toFixed(2),
      },
      categories: {
        images: {
          count: stats.images.files.length,
          size: formatBytes(stats.images.size),
          percentageUsed: totalSize > 0 ? ((stats.images.size / totalSize) * 100).toFixed(2) : "0.00",
        },
        videos: {
          count: stats.videos.files.length,
          size: formatBytes(stats.videos.size),
          percentageUsed: totalSize > 0 ? ((stats.videos.size / totalSize) * 100).toFixed(2) : "0.00",
        },
        audio: {
          count: stats.audio.files.length,
          size: formatBytes(stats.audio.size),
          percentageUsed: totalSize > 0 ? ((stats.audio.size / totalSize) * 100).toFixed(2) : "0.00",
        },
        docs: {
          count: stats.docs.files.length,
          size: formatBytes(stats.docs.size),
          percentageUsed: totalSize > 0 ? ((stats.docs.size / totalSize) * 100).toFixed(2) : "0.00",
        },
        uploads: {
          count: stats.uploads.files.length,
          size: formatBytes(stats.uploads.size),
        },
        downloads: {
          count: stats.downloads.files.length,
          size: formatBytes(stats.downloads.size),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching file stats:", error.message);
    res.status(500).json({ error: "Failed to fetch file stats", details: error.message });
  }
});

router.delete("/files/delete", async (req, res) => {
  try {
    let sanitizedFolder = "";
    let sanitizedFileName = "";

    const { folder = "", fileName } = req.body;

    if (!fileName) {
      return res.status(400).json({ error: "File name is required" });
    }

    // Sanitize inputs
    sanitizedFolder = folder
      .replace(/\.\./g, "")
      .replace(/\/+/g, "/")
      .replace(/[^a-zA-Z0-9_\-/]/g, "");
    
    sanitizedFileName = fileName
      .replace(/\.\./g, "")
      .replace(/\//g, "")
      .replace(/[^a-zA-Z0-9_.-]/g, "");

    // Construct full path (always relative to public/uploads)
    const basePath = path.join(process.cwd(), "public", "uploads");
    const fullPath = path.join(basePath, sanitizedFolder, sanitizedFileName);

    // Verify path is within the allowed directory
    if (!fullPath.startsWith(basePath)) {
      return res.status(400).json({ error: "Invalid file path" });
    }

    // Check if file exists
    try {
      await fs.access(fullPath);
    } catch (err) {
      console.error("File access error:", err);
      return res.status(404).json({ 
        error: "File not found",
        details: `Path: ${path.join(sanitizedFolder, sanitizedFileName)}` 
      });
    }

    // Delete the file
    await fs.unlink(fullPath);
    res.json({ 
      success: true,
      message: "File deleted successfully",
      path: path.join(sanitizedFolder, sanitizedFileName)
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ 
      error: "Failed to delete file",
      details: error.message 
    });
  }
});

// Helper function to format bytes (unchanged)
const formatBytes = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export default router;