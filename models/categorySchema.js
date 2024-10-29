import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  { _id: false }
); // Không tự động tạo trường _id của MongoDB

export const Category = mongoose.model("Category", categorySchema);
