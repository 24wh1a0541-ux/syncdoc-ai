import express from "express";
import {
  createSnippet,
  getWorkspaceSnippets,
  updateSnippet,
  deleteSnippet,
} from "../controllers/snippetController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireWorkspaceMember } from "../middleware/workspaceMiddleware.js";

const router = express.Router({ mergeParams: true });

router.use(protect, requireWorkspaceMember);

router.post("/", createSnippet);
router.get("/", getWorkspaceSnippets);
router.put("/:snippetId", updateSnippet);
router.delete("/:snippetId", deleteSnippet);

export default router;
