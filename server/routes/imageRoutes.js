import express from "express";
import {
  uploadImageFile,
  getWorkspaceImages,
  deleteImage,
} from "../controllers/imageController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireWorkspaceMember } from "../middleware/workspaceMiddleware.js";
import { uploadImage } from "../middleware/uploadMiddleware.js";

const router = express.Router({ mergeParams: true });

router.use(protect, requireWorkspaceMember);

router.post("/", uploadImage.single("image"), uploadImageFile);
router.get("/", getWorkspaceImages);
router.delete("/:imageId", deleteImage);

export default router;
