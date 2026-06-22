import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import linkRoutes from "./routes/linkRoutes.js";
import snippetRoutes from "./routes/snippetRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

connectDB();

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin.startsWith("http://localhost")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "SyncDoc API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/notifications", notificationRoutes);

app.use("/api/workspaces/:workspaceId/pdfs", pdfRoutes);
app.use("/api/workspaces/:workspaceId/images", imageRoutes);
app.use("/api/workspaces/:workspaceId/links", linkRoutes);
app.use("/api/workspaces/:workspaceId/snippets", snippetRoutes);
app.use("/api/workspaces/:workspaceId/tasks", taskRoutes);
app.use("/api/workspaces/:workspaceId/members", memberRoutes);
app.use("/api/workspaces/:workspaceId/search", searchRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SyncDoc server running on port ${PORT}`);
});