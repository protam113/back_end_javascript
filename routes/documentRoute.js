import express from "express";
import {
  createDocument,
  deleteDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
} from "../controllers/documentController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.route("/").post(isAdminAuthenticated, createDocument);

router.get("/getall", getAllDocuments);

router
  .route("/:id")
  .get(getDocumentById)
  .put(isAdminAuthenticated, updateDocument);

router.delete("/delete/:id", isAdminAuthenticated, deleteDocument);

export default router;
