import express from "express";
import path from "path";
import fs from "fs";

const router = express.Router();

router.get("/download/:filename", (req, res) => {
  const filePath = path.resolve("public", "invoices", req.params.filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }

  res.download(filePath, (err) => {
    if (err) {
      console.error("Download Error:", err);
      res.status(500).json({ message: "Failed to download file" });
    }
  });
});

export default router;