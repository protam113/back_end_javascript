import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/categoryController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router
  .route("/")
  .post(isAdminAuthenticated, createCategory)
  .get(isAdminAuthenticated, getCategories);

router
  .route("/:id")
  .get(getCategoryById)
  .put(isAdminAuthenticated, updateCategory)
  .delete(isAdminAuthenticated, deleteCategory);

export default router;
