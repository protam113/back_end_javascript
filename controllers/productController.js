import { Product } from "../models/productSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { isValidObjectId } from "mongoose";
import cloudinary from "cloudinary";

export const createProduct = catchAsyncErrors(async (req, res, next) => {
  const { productName, title, desc, price, stock } = req.body;

  if (!productName || !title || !desc || !price || !stock || !req.files.image) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  try {
    const { image } = req.files;

    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(image.mimetype)) {
      return next(
        new ErrorHandler(
          "Invalid file type. Only JPG, PNG and WEBP Formats Are Allowed!",
          400
        )
      );
    }

    const imageRes = await cloudinary.uploader.upload(image.tempFilePath);
    if (!imageRes || imageRes.error) {
      return next(
        new ErrorHandler("Error occurred while uploading the main image!", 500)
      );
    }

    const newProduct = await Product.create({
      productName,
      title,
      desc,
      price,
      stock,
      image: {
        public_id: imageRes.public_id,
        url: imageRes.secure_url,
      },
    });

    res.status(201).json(newProduct);
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

export const getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

// Hàm lấy sản phẩm theo ID
export const getProductById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  // Kiểm tra xem ID sản phẩm có hợp lệ không
  if (!isValidObjectId(id)) {
    return next(new ErrorHandler("Invalid Product ID", 400));
  }

  // Tìm sản phẩm trong cơ sở dữ liệu
  const product = await Product.findById(id);

  // Kiểm tra xem sản phẩm có tồn tại không
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // Trả về kết quả thành công và sản phẩm tìm thấy
  res.status(200).json({
    success: true,
    product,
  });
});

// Hàm cập nhật sản phẩm
export const updateProduct = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { productName, title, desc, price, stock, image } = req.body;

  // Kiểm tra xem các trường bắt buộc đã được điền đầy đủ chưa
  if (!productName || !title || !desc || !price || !stock || !image) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  try {
    // Kiểm tra xem ID sản phẩm có hợp lệ không
    if (!isValidObjectId(id)) {
      throw new ErrorHandler("Invalid Product ID", 400);
    }

    // Upload hình ảnh mới lên Cloudinary
    const imageRes = await cloudinary.uploader.upload(image.tempFilePath);

    // Tìm và cập nhật sản phẩm trong cơ sở dữ liệu
    const product = await Product.findByIdAndUpdate(
      id,
      {
        productName,
        title,
        desc,
        price,
        stock,
        image: {
          public_id: imageRes.public_id,
          url: imageRes.secure_url,
        },
      },
      { new: true }
    );

    // Kiểm tra xem sản phẩm có tồn tại không
    if (!product) {
      throw new ErrorHandler("Product not found", 404);
    }

    // Trả về kết quả thành công và thông báo
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
});

// Hàm xóa sản phẩm
export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  // Kiểm tra xem ID sản phẩm có hợp lệ không
  if (!isValidObjectId(id)) {
    return next(new ErrorHandler("Invalid Product ID", 400));
  }

  // Xóa sản phẩm từ cơ sở dữ liệu
  const product = await Product.findByIdAndDelete(id);

  // Kiểm tra xem sản phẩm có tồn tại không
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // Trả về kết quả thành công và thông báo
  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});
