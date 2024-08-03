import express from "express";
import { isAdminAuthenticated } from "../middlewares/auth.js";
import { createNews, deleteNews, getAllNews, getNewsById, updateNews } from "../controllers/newController.js";

const router = express.Router();

router.post("/create",isAdminAuthenticated, createNews);
router.get("/getAll", getAllNews);
router.delete("/:id", isAdminAuthenticated, deleteNews);
router.put("/update/:id", isAdminAuthenticated, updateNews);
router.get("/:id", isAdminAuthenticated, getNewsById);

export default router;
