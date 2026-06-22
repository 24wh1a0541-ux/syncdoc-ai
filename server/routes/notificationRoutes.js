import express from "express";
import {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getMyNotifications);
router.put("/:notificationId/read", markNotificationRead);
router.put("/read-all", markAllNotificationsRead);

export default router;
