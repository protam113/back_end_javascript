import { News } from "../models/newSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { isValidObjectId } from "mongoose";
import cloudinary from "cloudinary";

// Controller function to create a new news
export const createNews = catchAsyncErrors(async (req, res, next) => {
  // Kiểm tra xem có tệp đính kèm không
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Image Required!", 400));
  }

  // Lấy dữ liệu từ req.body
  const { caption, title, desc } = req.body;
  const { image } = req.files;

  // Kiểm tra định dạng của tệp đính kèm
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(image.mimetype)) {
    return next(new ErrorHandler("File Format Not Supported!", 400));
  }

  // Kiểm tra xem các trường bắt buộc đã được điền đầy đủ
  if (!caption || !title || !desc) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  try {
    // Tải lên hình ảnh lên Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(
      image.tempFilePath
    );
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error(
        "Cloudinary Error:",
        cloudinaryResponse.error || "Unknown Cloudinary error"
      );
      return next(
        new ErrorHandler("Failed To Upload Image To Cloudinary", 500)
      );
    }

    // Tạo một tin tức mới và lưu vào cơ sở dữ liệu
    const newNews = await News.create({
      caption,
      title,
      desc,
      image: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
      active: "Live",
    });

    // Trả về kết quả thành công và tin tức mới đã tạo
    res.status(200).json({
      success: true,
      message: "News Created Successfully!",
      newNews,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Controller function to get all news
export const getAllNews = catchAsyncErrors(async (req, res, next) => {
  //Get all news from the database
  const news = await News.find();

  // Returns a success result and a list of news
  res.status(200).json({
    success: true,
    news,
  });
});

// Controller function to delete news by ID
export const deleteNews = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const news = await News.findByIdAndDelete(id);

  if (!news) {
    return next(new ErrorHandler("News not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "News deleted successfully",
  });
});

// Controller function to update news by ID
export const updateNews = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { caption, title, desc } = req.body;
  let image;
  // Kiểm tra nếu có file được gửi lên
  if (req.file) {
    image = req.file.path;
  }
  try {
    // Kiểm tra data đã gửi
    if (!caption || !title || !desc) {
      throw new ErrorHandler("Please Fill Full Form!", 400);
    }
    // Kiểm tra ID của news
    if (!isValidObjectId(id)) {
      throw new ErrorHandler("Invalid News ID", 400);
    }
    // Tải lên hình ảnh lên Cloudinary (nếu có)
    let cloudinaryResponse;
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image.tempFilePath);
      if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error(
          "Cloudinary Error:",
          cloudinaryResponse.error || "Unknown Cloudinary error"
        );
        return next(
          new ErrorHandler("Failed To Upload Image To Cloudinary", 500)
        );
      }
    }
    // Tìm và cập nhật news trong cơ sở dữ liệu
    let updateData = { caption, title, desc };
    if (cloudinaryResponse && cloudinaryResponse.secure_url) {
      updateData.image = cloudinaryResponse.secure_url;
    }
    const news = await News.findByIdAndUpdate(id, updateData, { new: true });
    // Kiểm tra nếu news tồn tại
    if (!news) {
      throw new ErrorHandler("News not found", 404);
    }
    // Trả về kết quả thành công và thông báo
    res.status(200).json({
      success: true,
      message: "News updated successfully",
      news,
    });
  } catch (error) {
    next(error);
  }
});

// Controller function to get news by ID
export const getNewsById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return next(new ErrorHandler("Invalid News ID", 400));
  }

  const news = await News.findById(id);

  // Kiểm tra xem tin tức có tồn tại không
  if (!news) {
    return next(new ErrorHandler("News not found", 404));
  }

  res.status(200).json({
    success: true,
    news,
  });
});
