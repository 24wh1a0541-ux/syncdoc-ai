import express from "express";
import {
  createTask,
  getWorkspaceTasks,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireWorkspaceMember } from "../middleware/workspaceMiddleware.js";

const router = express.Router({ mergeParams: true });

router.use(protect, requireWorkspaceMember);

router.post("/", createTask);
router.get("/", getWorkspaceTasks);
router.put("/:taskId", updateTask);
router.delete("/:taskId", deleteTask);

export default router;
