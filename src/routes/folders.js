// src/routes/folders.js
import express from "express";
import path from "path";
import fs from "fs/promises";

const router = express.Router();

// Recursively read a folder, returning { folders, files, totalSize, totalFiles }
async function getFolderContents(basePath) {
  const entries = await fs.readdir(basePath, { withFileTypes: true });

  // 1️⃣ Collect subfolders (placeholder size/count for now)
  const folders = entries
    .filter((e) => e.isDirectory())
    .map((e) => ({ name: e.name, type: "folder", size: "0 Bytes", files: 0 }));

  // 2️⃣ Read files in this folder
  let totalSize = 0;
  let totalFiles = 0;
  const files = await Promise.all(
    entries
      .filter((e) => !e.isDirectory())
      .map(async (e) => {
        const filePath = path.join(basePath, e.name);
        const stats = await fs.stat(filePath);
        totalSize += stats.size;
        totalFiles += 1;
        return {
          name: e.name,
          type: "file",
          category: getFileCategory(e.name),
          size: formatBytes(stats.size),
          date: stats.mtime.toLocaleDateString(),
        };
      })
  );

  // 3️⃣ Recurse into each subfolder to accumulate sizes and nested files
  for (const folder of folders) {
    const subPath = path.join(basePath, folder.name);
    const subContents = await getFolderContents(subPath);

    // pull nested files into this level’s files array
    files.push(...subContents.files);

    // update this folder’s own size & file count
    folder.size = formatBytes(subContents.totalSize);
    folder.files = subContents.totalFiles;

    // add nested totals to our totals
    totalSize += subContents.totalSize;
    totalFiles += subContents.totalFiles;
  }

  return { folders, files, totalSize, totalFiles };
}

// ─── ROOT: list top-level folders (and always include files[])
router.get("/folders", async (req, res) => {
  try {
    const basePath = path.join(process.cwd(), "public", "uploads");
    const { folders } = await getFolderContents(basePath);

    return res.json({
      folders,
      files: [], // no files at the very root
    });
  } catch (err) {
    console.error("Error fetching root folders:", err);
    return res
      .status(500)
      .json({ error: "Failed to fetch folders", details: err.message });
  }
});

// ─── NESTED: list a specific folder’s subfolders + files
// Supports unlimited depth via the wildcard `:folderPath*`
router.get("/folders/:folderPath*", async (req, res) => {
  try {
    const decoded = decodeURIComponent(req.params.folderPath || "");
    const targetPath = path.join(
      process.cwd(),
      "public",
      "uploads",
      decoded
    );

    const stats = await fs.stat(targetPath);
    if (!stats.isDirectory()) {
      return res.status(404).json({ error: "Folder not found" });
    }

    const { folders, files } = await getFolderContents(targetPath);
    return res.json({ folders, files });
  } catch (err) {
    console.error("Error fetching folder contents:", err);
    return res
      .status(500)
      .json({ error: "Failed to fetch folder contents", details: err.message });
  }
});

// ─── Helpers ────────────────────────────────────────────────────────────────
function getFileCategory(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  if (/\.(mp4|mov|avi|mkv)$/.test(ext)) return "Video";
  if (/\.(jpg|jpeg|png|gif|webp)$/.test(ext)) return "Image";
  if (/\.(pdf|docx|txt|pptx)$/.test(ext)) return "Document";
  return "Other";
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default router;