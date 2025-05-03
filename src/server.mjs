import express from "express";
import { ApolloServer } from "apollo-server-express";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import typeDefs from "./graphql/schemas/index.js";
import resolvers from "./graphql/resolvers/index.js";
import prisma from "./config/db.js";
import { verifyToken } from "./utils/auth.js";
import downloadRouter from "./routes/download.js";
import { saveFile, sanitizeFolderPath } from "./utils/fileHandler.js";
import filesRouter from "./routes/files.js";
import foldersRouter from "./routes/folders.js";

dotenv.config();

const app = express();

// Get the directory name of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 1. APPLY CORS MIDDLEWARE
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// 🔹 2. ADD EXPLICIT CORS HEADERS TO ALL RESPONSES
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", corsOptions.origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// 🔹 3. OTHER MIDDLEWARES
app.use(express.json());
app.use(cookieParser());

// 🔹 4. SERVE STATIC FILES FROM EXTERNAL DIRECTORY
// Assuming public folder is one level up from src
const publicUploadsPath = path.join(__dirname, '../public/uploads');
app.use('/uploads', express.static(publicUploadsPath, {
  setHeaders: (res) => {
    res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
  }
}));

// 🔹 4. SESSIONS (EXCLUDE GRAPHQL)
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict",
  },
});

app.use((req, res, next) => {
  if (req.path.startsWith("/graphql")) return next();
  sessionMiddleware(req, res, next);
});

// 🔹 5. REST ENDPOINTS
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

app.post("/api/upload", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    if (!req.body.folder) {
      return res.status(400).json({ error: "Folder path required" });
    }

    const { folder } = req.body;
    const { originalname, buffer, mimetype } = req.file;

    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "video/mp4",
      "application/pdf",
    ];
    if (!allowedMimeTypes.includes(mimetype)) {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    const sanitizedName = originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    const sanitizedFolder = folder.replace(/\.\./g, "").replace(/\/+/g, "/");
    const url = await saveFile(buffer, sanitizedName, sanitizedFolder);
    res.json({ url, name: sanitizedName, folder: sanitizedFolder });
  } catch (error) {
    next(error);
  }
});

app.use("/api", filesRouter);
app.use("/api", foldersRouter);
app.use("/download", downloadRouter);

// 🔹 7. APOLLO GRAPHQL SERVER
async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization?.replace("Bearer ", "") || null;
      let admin = null;

      if (token) {
        try {
          const decoded = verifyToken(token);
          if (decoded) admin = decoded;
        } catch (err) {
          console.error("Token verification failed:", err.message);
        }
      }

      return { admin, prisma };
    },
    cors: false, // Let Express handle CORS
  });

  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at ${PORT}`);
  });

  server.timeout = 300000; // Set timeout to 5 minutes (300000 ms)
}

// 🔹 8. GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("Global error:", err.stack);
  res.status(500)
     .header("Access-Control-Allow-Origin", corsOptions.origin)
     .header("Access-Control-Allow-Credentials", "true")
     .json({ error: "Internal Server Error" });
});

startServer().catch((err) => {
  console.error("❌ Server failed to start:", err.stack || err.message);
  process.exit(1);
});