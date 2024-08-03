import { Service } from "../models/serviceSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { isValidObjectId } from "mongoose";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import cloudinary from "cloudinary";

// Create a new service
export const createService = catchAsyncErrors(async (req, res, next) => {
  if (!req.user || !req.user._id) {
    return next(new ErrorHandler("Admin Not Authenticated!", 401));
  }

  if (!req.files || !req.files.image) {
    return next(new ErrorHandler("Service Main Image Is Mandatory!", 400));
  }

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

  const { caption, intro, description, title, link } = req.body;
  const createdBy = req.user._id;

  if (!caption || !intro || !description) {
    return next(
      new ErrorHandler(
        "Caption, Intro, and Description Are Required Fields!",
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

  const serviceData = {
    caption,
    intro,
    description,
    title,
    link,
    createdBy,
    image: {
      public_id: imageRes.public_id,
      url: imageRes.secure_url,
    },
  };

  const service = await Service.create(serviceData);
  res.status(200).json({
    success: true,
    message: "Service Uploaded!",
    service,
  });
});

// Get all services
export const getAllServices = catchAsyncErrors(async (req, res, next) => {
  const services = await Service.find();
  res.status(200).json({
    success: true,
    data: services,
  });
});

// Get service by ID
export const getServiceById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(new ErrorHandler("Invalid Service ID", 400));
  }
  const service = await Service.findById(id);
  if (!service) {
    return next(new ErrorHandler("Service not found", 404));
  }
  res.status(200).json({
    success: true,
    data: service,
  });
});

// Update service by ID
export const updateService = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(new ErrorHandler("Invalid Service ID", 400));
  }

  const { caption, intro, description, title, link } = req.body;
  const updatedData = {
    caption,
    intro,
    description,
    title,
    link,
  };

  if (req.files && req.files.image) {
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
    updatedData.image = {
      public_id: imageRes.public_id,
      url: imageRes.secure_url,
    };
  }

  const service = await Service.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  });
  if (!service) {
    return next(new ErrorHandler("Service not found", 404));
  }
  res.status(200).json({
    success: true,
    data: service,
  });
});

// Delete service by ID
export const deleteService = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(new ErrorHandler("Invalid Service ID", 400));
  }
  const service = await Service.findById(id);
  if (!service) {
    return next(new ErrorHandler("Service not found!", 404));
  }
  await service.deleteOne();
  res.status(200).json({
    success: true,
    message: "Service deleted!",
  });
});
