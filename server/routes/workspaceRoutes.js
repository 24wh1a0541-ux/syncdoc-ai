import express from "express";
import {
  createWorkspace,
  joinWorkspace,
  getMyWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  leaveWorkspace,
} from "../controllers/workspaceController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  requireWorkspaceMember,
  requireWorkspaceOwner,
} from "../middleware/workspaceMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createWorkspace);
router.post("/join", joinWorkspace);
router.get("/", getMyWorkspaces);

router.get("/:workspaceId", requireWorkspaceMember, getWorkspaceById);
router.put("/:workspaceId", requireWorkspaceMember, requireWorkspaceOwner, updateWorkspace);
router.delete("/:workspaceId", requireWorkspaceMember, requireWorkspaceOwner, deleteWorkspace);
router.delete("/:workspaceId/leave", requireWorkspaceMember, leaveWorkspace);

export default router;
