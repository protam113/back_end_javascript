import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { isValidObjectId } from "mongoose";
import { Info } from "../models/infoSchema.js";
import cloudinary from "cloudinary";

// Tạo mới thông tin
export const createInfo = catchAsyncErrors(async (req, res, next) => {
  const { mainTitle, intro, title, slogan, address, phone, email, map, link } =
    req.body;

  // Kiểm tra xem các trường cần thiết có được cung cấp hay không
  if (
    !mainTitle ||
    !intro ||
    !title ||
    !slogan ||
    !address ||
    !phone ||
    !email ||
    !map ||
    !req.files ||
    !req.files.mainImage ||
    !link
  ) {
    return next(new ErrorHandler("Please fill all required fields!", 400));
  }

  try {
    const { mainImage } = req.files;

    // Xác định định dạng hợp lệ cho hình ảnh
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(mainImage.mimetype)) {
      return next(
        new ErrorHandler(
          "Invalid file type. Only JPG, PNG and WEBP Formats Are Allowed!",
          400
        )
      );
    }

    // Tải lên hình ảnh lên Cloudinary
    const imageRes = await cloudinary.uploader.upload(mainImage.tempFilePath);
    if (!imageRes || imageRes.error) {
      return next(
        new ErrorHandler("Error occurred while uploading the main image!", 500)
      );
    }

    // Tạo thông tin mới với URL hình ảnh từ Cloudinary
    const newInfo = await Info.create({
      mainTitle,
      intro,
      title,
      slogan,
      address,
      phone,
      email,
      map,
      mainImage: {
        public_id: imageRes.public_id,
        url: imageRes.secure_url,
      },
      link,
    });

    res.status(201).json(newInfo);
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Cập nhật thông tin
export const updateInfo = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(new ErrorHandler("Invalid Info ID", 400));
  }

  const { mainTitle, intro, title, slogan, address, phone, email, map, link } =
    req.body;
  const updatedData = {
    mainTitle,
    intro,
    title,
    slogan,
    address,
    phone,
    email,
    map,
    link,
  };

  if (req.files && req.files.mainImage) {
    const { mainImage } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(mainImage.mimetype)) {
      return next(
        new ErrorHandler(
          "Invalid file type. Only JPG, PNG and WEBP Formats Are Allowed!",
          400
        )
      );
    }
    const mainImageRes = await cloudinary.uploader.upload(
      mainImage.tempFilePath
    );
    if (!mainImageRes || mainImageRes.error) {
      return next(
        new ErrorHandler("Error occurred while uploading the main image!", 500)
      );
    }
    updatedData.mainImage = {
      public_id: mainImageRes.public_id,
      url: mainImageRes.secure_url,
    };
  }

  const info = await Info.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  });
  if (!info) {
    return next(new ErrorHandler("Info not found", 404));
  }
  res.status(200).json({
    success: true,
    data: info,
  });
});

// Lấy thông tin theo ID
export const getInfoById = catchAsyncErrors(async (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    return next(new ErrorHandler("Invalid Object ID", 400));
  }

  try {
    const info = await Info.findById(req.params.id);
    if (!info) {
      return next(new ErrorHandler("Info not found", 404));
    }

    res.json(info);
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Lấy tất cả thông tin
export const getAllInfo = catchAsyncErrors(async (req, res, next) => {
  const infos = await Info.find();
  res.status(200).json({
    success: true,
    infos,
  });
});

// export const getAllNews = catchAsyncErrors(async (req, res, next) => {
//     //Get all news from the database
//     const news = await News.find();

//     // Returns a success result and a list of news
//     res.status(200).json({
//         success: true,
//         news,
//     });
// });

// Xóa thông tin dựa trên ID
export const deleteInfo = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(new ErrorHandler("Invalid Info ID", 400));
  }
  try {
    const info = await Info.findById(id); // Change 'infos' to 'Info'
    if (!info) {
      return next(new ErrorHandler("Info not found!", 404));
    }
    await info.deleteOne(); // Change 'infos' to 'info'
    res.status(200).json({
      success: true,
      message: "Info deleted!",
    });
  } catch (error) {
    return next(new ErrorHandler("Error deleting info", 500));
  }
});
