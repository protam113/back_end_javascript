import express from "express";
import {
  addToCart,
  getCart,
  updateCart,
  removeFromCart,
} from "../controllers/cartController.js";
import { isUserAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Route để thêm sản phẩm vào giỏ hàng
router.post("/add", isUserAuthenticated, addToCart);

// Route để lấy giỏ hàng của người dùng
router.get("/", isUserAuthenticated, getCart);

// Route để cập nhật giỏ hàng
router.put("/update", isUserAuthenticated, updateCart);

// Route để xóa sản phẩm khỏi giỏ hàng
router.delete("/remove/:productId", isUserAuthenticated, removeFromCart);

export default cartRouter;
