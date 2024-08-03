import { Solution } from "../models/solutionSchema.js";
import { Category } from "../models/categorySchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { isValidObjectId } from "mongoose";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import cloudinary from "cloudinary";

export const createSolution = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Solution Main Image Is Mandatory!", 400));
  }
  const { mainImage, paraOneImage, paraTwoImage, paraThreeImage } = req.files;
  if (!mainImage) {
    return next(new ErrorHandler("Solution Main Image Is Mandatory!", 400));
  }
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (
    !allowedFormats.includes(mainImage.mimetype) ||
    (paraOneImage && !allowedFormats.includes(paraOneImage.mimetype)) ||
    (paraTwoImage && !allowedFormats.includes(paraTwoImage.mimetype)) ||
    (paraThreeImage && !allowedFormats.includes(paraThreeImage.mimetype))
  ) {
    return next(
      new ErrorHandler(
        "Invalid file type. Only JPG, PNG and WEBP Formats Are Allowed!",
        400
      )
    );
  }
  const {
    title,
    intro,
    paraOneDescription,
    paraOneTitle,
    paraTwoDescription,
    paraTwoTitle,
    paraThreeDescription,
    paraThreeTitle,
    category,
    published,
  } = req.body;

  if (!title || !category || !intro) {
    return next(
      new ErrorHandler("Title, Intro and Category Are Required Fields!", 400)
    );
  }

  const uploadPromises = [
    cloudinary.uploader.upload(mainImage.tempFilePath),
    paraOneImage
      ? cloudinary.uploader.upload(paraOneImage.tempFilePath)
      : Promise.resolve(null),
    paraTwoImage
      ? cloudinary.uploader.upload(paraTwoImage.tempFilePath)
      : Promise.resolve(null),
    paraThreeImage
      ? cloudinary.uploader.upload(paraThreeImage.tempFilePath)
      : Promise.resolve(null),
  ];

  const [mainImageRes, paraOneImageRes, paraTwoImageRes, paraThreeImageRes] =
    await Promise.all(uploadPromises);

  if (
    !mainImageRes ||
    mainImageRes.error ||
    (paraOneImage && (!paraOneImageRes || paraOneImageRes.error)) ||
    (paraTwoImage && (!paraTwoImageRes || paraTwoImageRes.error)) ||
    (paraThreeImage && (!paraThreeImageRes || paraThreeImageRes.error))
  ) {
    return next(
      new ErrorHandler("Error occured while uploading one or more images!", 500)
    );
  }
  const solutionData = {
    title,
    intro,
    paraOneDescription,
    paraOneTitle,
    paraTwoDescription,
    paraTwoTitle,
    paraThreeDescription,
    paraThreeTitle,
    category,
    published,
    mainImage: {
      public_id: mainImageRes.public_id,
      url: mainImageRes.secure_url,
    },
  };

  // Add optional image data if available
  if (paraOneImageRes && !paraOneImageRes.error) {
    solutionData.paraOneImage = {
      public_id: paraOneImageRes.public_id,
      url: paraOneImageRes.secure_url,
    };
  }
  if (paraTwoImageRes && !paraTwoImageRes.error) {
    solutionData.paraTwoImage = {
      public_id: paraTwoImageRes.public_id,
      url: paraTwoImageRes.secure_url,
    };
  }
  if (paraThreeImageRes && !paraThreeImageRes.error) {
    solutionData.paraThreeImage = {
      public_id: paraThreeImageRes.public_id,
      url: paraThreeImageRes.secure_url,
    };
  }

  const solution = await Solution.create(solutionData);
  res.status(200).json({
    success: true,
    message: "Solution Uploaded!",
    solution,
  });
});

// Controller function to get all solutions
export const getAllSolution = catchAsyncErrors(async (req, res, next) => {
  const solution = await Solution.find();
  res.status(200).json({
    success: true,
    data: solution,
  });
});

// Controller function to get solution by ID
export const getSolutionById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return next(new ErrorHandler("Invalid Solution ID", 400));
  }

  const solution = await Solution.findById(id);
  if (!solution) {
    return next(new ErrorHandler("Solution not found", 404));
  }

  res.status(200).json({
    success: true,
    data: solution,
  });
});

// Controller function to update solution by ID
export const updateSolution = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    mainImage,
    intro,
    paraOneImage,
    paraOneDescription,
    paraOneTitle,
    paraTwoImage,
    paraTwoDescription,
    paraTwoTitle,
    paraThreeImage,
    paraThreeDescription,
    paraThreeTitle,
    category,
  } = req.body;

  if (!isValidObjectId(id)) {
    return next(new ErrorHandler("Invalid Solution ID", 400));
  }

  if (category && !isValidObjectId(category)) {
    return next(new ErrorHandler("Invalid Category ID", 400));
  }

  if (category) {
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return next(new ErrorHandler("Category not found", 404));
    }
  }

  const updatedData = {
    title,
    mainImage,
    intro,
    paraOneImage,
    paraOneDescription,
    paraOneTitle,
    paraTwoImage,
    paraTwoDescription,
    paraTwoTitle,
    paraThreeImage,
    paraThreeDescription,
    paraThreeTitle,
    category,
  };

  const solution = await Solution.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  }).populate("category");
  if (!solution) {
    return next(new ErrorHandler("Solution not found", 404));
  }

  res.status(200).json({
    success: true,
    data: solution,
  });
});

// Controller function to delete solution by ID
export const deleteSolution = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(new ErrorHandler("Invalid Service ID", 400));
  }
  const solution = await Solution.findById(id);
  if (!solution) {
    return next(new ErrorHandler("Service not found!", 404));
  }
  await solution.deleteOne();
  res.status(200).json({
    success: true,
    message: "Service deleted!",
  });
});
