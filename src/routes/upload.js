// src/routes/upload.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs/promises";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// File upload endpoint
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("Incoming request to /api/upload");
    const { folder } = req.body;
    const { originalname, buffer, mimetype } = req.file;

    // Validate MIME type
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "video/mp4",
      "application/pdf",
    ];
    if (!allowedMimeTypes.includes(mimetype)) {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    // Sanitize and save
    const sanitizedName = originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    const sanitizedFolder = folder.replace(/\.\./g, "").replace(/\/+/g, "/");
    const url = await saveFile(buffer, sanitizedName, sanitizedFolder);
    res.json({ url, name: sanitizedName, folder: sanitizedFolder });
  }  catch (error) {
    console.error("Error during file upload:", error);
    res.status(500)
       .header("Access-Control-Allow-Origin", "https://mybrownies.com.ng")
       .header("Access-Control-Allow-Credentials", "true")
       .json({ error: "Upload failed", details: error.message });
  }
});

// Utility to save files
async function saveFile(buffer, fileName, folder) {
  const basePath = path.join(process.cwd(), "public", "uploads", folder);
  await fs.mkdir(basePath, { recursive: true });
  const filePath = path.join(basePath, fileName);
  await fs.writeFile(filePath, buffer);
  return `/uploads/${folder}/${fileName}`;
}

export default router; // Use ES module syntax