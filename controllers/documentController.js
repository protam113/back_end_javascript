import { Document } from "../models/documentSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { isValidObjectId } from "mongoose";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import cloudinary from "cloudinary";

// Create a new document
export const createDocument = catchAsyncErrors(async (req, res, next) => {
  if (!req.user || !req.user._id) {
    return next(new ErrorHandler("Admin Not Authenticated!", 401));
  }

  if (!req.files || !req.files.image) {
    return next(new ErrorHandler("Document Main Image Is Mandatory!", 400));
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

  const {
    caption,
    intro,
    paraOneDescription,
    paraOneTitle,
    paraTwoDescription,
    paraTwoTitle,
    link,
    published,
  } = req.body;
  const createdBy = req.user._id;

  if (!caption || !intro) {
    return next(
      new ErrorHandler("Caption and Intro Are Required Fields!", 400)
    );
  }

  const imageRes = await cloudinary.uploader.upload(image.tempFilePath);

  if (!imageRes || imageRes.error) {
    return next(
      new ErrorHandler("Error occurred while uploading the main image!", 500)
    );
  }

  const documentData = {
    caption,
    intro,
    paraOneDescription,
    paraOneTitle,
    paraTwoDescription,
    paraTwoTitle,
    link,
    published,
    createdBy,
    image: {
      public_id: imageRes.public_id,
      url: imageRes.secure_url,
    },
  };

  const document = await Document.create(documentData);
  res.status(200).json({
    success: true,
    message: "Document Uploaded!",
    document,
  });
});

// Get all documents
export const getAllDocuments = catchAsyncErrors(async (req, res, next) => {
  const documents = await Document.find();
  res.status(200).json({
    success: true,
    data: documents,
  });
});

// Get document by ID
export const getDocumentById = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(new ErrorHandler("Invalid Document ID", 400));
  }
  const document = await Document.findById(id);
  if (!document) {
    return next(new ErrorHandler("Document not found", 404));
  }
  res.status(200).json({
    success: true,
    data: document,
  });
});

// Update document by ID
export const updateDocument = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(new ErrorHandler("Invalid Document ID", 400));
  }

  const {
    caption,
    intro,
    paraOneDescription,
    paraOneTitle,
    paraTwoDescription,
    paraTwoTitle,
    link,
    published,
  } = req.body;
  const updatedData = {
    caption,
    intro,
    paraOneDescription,
    paraOneTitle,
    paraTwoDescription,
    paraTwoTitle,
    link,
    published,
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

  const document = await Document.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  });
  if (!document) {
    return next(new ErrorHandler("Document not found", 404));
  }
  res.status(200).json({
    success: true,
    data: document,
  });
});

// Delete document by ID
export const deleteDocument = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(new ErrorHandler("Invalid Document ID", 400));
  }
  const document = await Document.findById(id);
  if (!document) {
    return next(new ErrorHandler("Document not found!", 404));
  }
  await document.deleteOne();
  res.status(200).json({
    success: true,
    message: "Document deleted!",
  });
});
