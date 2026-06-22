import express from "express";
import { getWorkspaceMembers, removeMember } from "../controllers/memberController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  requireWorkspaceMember,
  requireWorkspaceOwner,
} from "../middleware/workspaceMiddleware.js";

const router = express.Router({ mergeParams: true });

router.use(protect, requireWorkspaceMember);

router.get("/", getWorkspaceMembers);
router.delete("/:memberId", requireWorkspaceOwner, removeMember);

export default router;
