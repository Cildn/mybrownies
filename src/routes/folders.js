// src/routes/folders.js
import express from "express";
import path from "path";
import fs from "fs/promises";

const router = express.Router();

// Recursively read a folder tree
async function getFolderContents(basePath) {
  const entries = await fs.readdir(basePath, { withFileTypes: true });

  // Gather subfolders (placeholder values)
  const folders = entries
    .filter((e) => e.isDirectory())
    .map((e) => ({ name: e.name, type: "folder", size: "0 Bytes", files: 0 }));

  // Gather files in this folder
  let totalSize = 0, totalFiles = 0;
  const files = await Promise.all(
    entries
      .filter((e) => !e.isDirectory())
      .map(async (e) => {
        const filePath = path.join(basePath, e.name);
        const stats = await fs.stat(filePath);
        totalSize += stats.size;
        totalFiles++;
        return {
          name: e.name,
          type: "file",
          category: getFileCategory(e.name),
          size: formatBytes(stats.size),
          date: stats.mtime.toLocaleDateString(),
        };
      })
  );

  // Recurse into each subfolder
  for (const folder of folders) {
    const subBase = path.join(basePath, folder.name);
    const sub = await getFolderContents(subBase);
    files.push(...sub.files);
    folder.size = formatBytes(sub.totalSize);
    folder.files = sub.totalFiles;
    totalSize += sub.totalSize;
    totalFiles += sub.totalFiles;
  }

  return { folders, files, totalSize, totalFiles };
}

// — Root listing: always return { folders, files: [] }
router.get("/folders", async (req, res) => {
  try {
    const base = path.join(process.cwd(), "public", "uploads");
    const { folders } = await getFolderContents(base);
    res.json({ folders, files: [] });
  } catch (err) {
    console.error("Error fetching root folders:", err);
    res.status(500).json({ error: err.message });
  }
});

// — Nested listing: wildcard to capture nested segments
router.get("/folders/*", async (req, res) => {
  try {
    const decoded = decodeURIComponent(req.params[0] || "");
    const target = path.join(process.cwd(), "public", "uploads", decoded);
    const stats = await fs.stat(target);
    if (!stats.isDirectory()) {
      return res.status(404).json({ error: "Folder not found" });
    }
    const { folders, files } = await getFolderContents(target);
    res.json({ folders, files });
  } catch (err) {
    console.error("Error fetching nested folders:", err);
    res.status(500).json({ error: err.message });
  }
});

// Helpers
function getFileCategory(name) {
  const ext = path.extname(name).toLowerCase();
  if (/\.(mp4|mov|avi|mkv)$/.test(ext)) return "Video";
  if (/\.(jpe?g|png|gif|webp)$/.test(ext)) return "Image";
  if (/\.(pdf|docx?|txt|pptx)$/.test(ext)) return "Document";
  return "Other";
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024, sizes = ["Bytes","KB","MB","GB","TB"];
  const i = Math.floor(Math.log(bytes)/Math.log(k));
  return (bytes/Math.pow(k,i)).toFixed(2) + " " + sizes[i];
}

export default router;