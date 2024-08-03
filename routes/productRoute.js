import express from "express";
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../controllers/productController.js";
import {isAdminAuthenticated} from "../middlewares/auth.js"

const router = express.Router();

router.post("/create",isAdminAuthenticated, createProduct)
router.get("/getall_product", getAllProducts)
router.get("/getall_product/:id", getProductById)
router.delete('/delete/:id', isAdminAuthenticated, deleteProduct);
router.put('/update/:id', isAdminAuthenticated, updateProduct);



export default router;