import express from "express";
import {
  getAllMessages,
  sendMessage,
} from "../controllers/messageController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/send", sendMessage);
router.get("/getall", isAdminAuthenticated, getAllMessages);

export default router;
