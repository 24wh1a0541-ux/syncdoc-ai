import express from "express";
import { searchWorkspace } from "../controllers/searchController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireWorkspaceMember } from "../middleware/workspaceMiddleware.js";

const router = express.Router({ mergeParams: true });

router.use(protect, requireWorkspaceMember);

router.get("/", searchWorkspace);

export default router;
