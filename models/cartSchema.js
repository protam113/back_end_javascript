import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User", // Tham chiếu đến model User
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product", // Tham chiếu đến model Product
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity must be at least 1"], // Số lượng tối thiểu là 1
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
    min: [0, "Total amount must be non-negative"], // Tổng giá trị không được âm
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Cart = mongoose.model("Cart", cartSchema);
