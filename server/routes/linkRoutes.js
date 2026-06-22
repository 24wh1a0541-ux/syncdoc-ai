import express from "express";
import { createLink, getWorkspaceLinks, deleteLink } from "../controllers/linkController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireWorkspaceMember } from "../middleware/workspaceMiddleware.js";

const router = express.Router({ mergeParams: true });

router.use(protect, requireWorkspaceMember);

router.post("/", createLink);
router.get("/", getWorkspaceLinks);
router.delete("/:linkId", deleteLink);

export default router;
