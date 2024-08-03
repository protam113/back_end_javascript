import { Category } from "../models/categorySchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { isValidObjectId } from "mongoose";

export const createCategory = catchAsyncErrors(async (req, res, next) => {
  const { name, description } = req.body;

  if (!name) {
    return next(new ErrorHandler("Category name is required", 400));
  }

  const newCategory = new Category({ name, description });
  await newCategory.save();

  res.status(201).json({ success: true, data: newCategory });
});

// Lấy tất cả các danh mục
export const getCategories = catchAsyncErrors(async (req, res, next) => {
  const categories = await Category.find();

  res.status(200).json({ success: true, data: categories });
});

// Lấy một danh mục theo ID
export const getCategoryById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return next(new ErrorHandler("Invalid Category ID", 400));
  }

  const category = await Category.findById(id);
  if (!category) {
    return next(new ErrorHandler("Category not found", 404));
  }

  res.status(200).json({ success: true, data: category });
});

// Cập nhật một danh mục theo ID
export const updateCategory = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!isValidObjectId(id)) {
    return next(new ErrorHandler("Invalid Category ID", 400));
  }

  const category = await Category.findByIdAndUpdate(
    id,
    { name, description },
    { new: true, runValidators: true }
  );
  if (!category) {
    return next(new ErrorHandler("Category not found", 404));
  }

  res.status(200).json({ success: true, data: category });
});

// Xóa một danh mục theo ID
export const deleteCategory = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return next(new ErrorHandler("Invalid Category ID", 400));
  }

  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    return next(new ErrorHandler("Category not found", 404));
  }

  res
    .status(200)
    .json({ success: true, message: "Category deleted successfully" });
});
