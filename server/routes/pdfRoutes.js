import express from "express";
import {
  uploadPdfFile,
  getWorkspacePdfs,
  deletePdf,
} from "../controllers/pdfController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireWorkspaceMember } from "../middleware/workspaceMiddleware.js";
import { uploadPdf } from "../middleware/uploadMiddleware.js";

const router = express.Router({ mergeParams: true });

router.use(protect, requireWorkspaceMember);

router.post("/", uploadPdf.single("pdf"), uploadPdfFile);
router.get("/", getWorkspacePdfs);
router.delete("/:pdfId", deletePdf);

export default router;
