import { Cart } from "../models/cartModel.js";
import { Product } from "../models/productModel.js";
import { User } from "../models/userModel.js";

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    // Kiểm tra xem sản phẩm có tồn tại không
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Kiểm tra xem giỏ hàng đã tồn tại chưa
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      // Tạo mới giỏ hàng nếu chưa tồn tại
      cart = new Cart({
        userId: req.user._id,
        items: [{ productId, quantity, price: product.price }],
        totalAmount: product.price * quantity,
      });
    } else {
      // Nếu giỏ hàng đã tồn tại, thêm hoặc cập nhật sản phẩm
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );
      if (existingItem) {
        // Cập nhật số lượng sản phẩm
        existingItem.quantity += quantity;
        existingItem.price = product.price; // Cập nhật giá nếu cần
      } else {
        // Thêm sản phẩm mới vào giỏ hàng
        cart.items.push({ productId, quantity, price: product.price });
      }
      // Cập nhật tổng giá trị của giỏ hàng
      cart.totalAmount += product.price * quantity;
    }

    await cart.save();
    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Lấy giỏ hàng của người dùng
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate(
      "items.productId"
    );
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Cập nhật giỏ hàng
export const updateCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );
    if (existingItem) {
      // Cập nhật số lượng sản phẩm
      existingItem.quantity = quantity;
      // Cập nhật tổng giá trị của giỏ hàng
      cart.totalAmount = cart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    } else {
      return res.status(404).json({ message: "Product not in cart" });
    }

    await cart.save();
    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = async (req, res) => {
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Lọc ra sản phẩm không muốn giữ lại
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    // Cập nhật tổng giá trị của giỏ hàng
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();
    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
