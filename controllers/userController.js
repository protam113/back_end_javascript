import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";
import { isValidObjectId } from "mongoose";

export const userRegister = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("User Avatar Required!", 400));
  }

  const { avatar } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(avatar.mimetype)) {
    return next(new ErrorHandler("File Format Not Supported!", 400));
  }

  const { username, email, phone, dob, password } = req.body;

  if (!username || !email || !phone || !dob || !password) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  let user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler("User already Registered!", 400));
  }

  const cloudinaryResponse = await cloudinary.uploader.upload(
    avatar.tempFilePath
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary error"
    );
    return next(
      new ErrorHandler("Failed To Upload User Avatar To Cloudinary", 500)
    );
  }

  user = await User.create({
    username,
    email,
    phone,
    dob,
    password,
    role: "User",
    avatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  generateToken(user, "User Registered!", 200, res);
});

// user

export const getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({ role: "User" });
  res.status(200).json({
    success: true,
    users,
  });
});

export const deleteUsers = catchAsyncErrors(async (req, res, next) => {
  const Id = req.params.id;

  if (!isValidObjectId(Id)) {
    return next(new ErrorHandler("Invalid Manager ID", 400));
  }

  const users = await User.findOneAndDelete({ _id: Id, role: "User" });

  if (!users) {
    return next(new ErrorHandler("Manager not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Manager deleted successfully",
  });
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, confirmPassword, role } = req.body;
  if (!email || !password || !confirmPassword || !role) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  if (password !== confirmPassword) {
    return next(
      new ErrorHandler("Password & Confirm Password Do Not Match!", 400)
    );
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password!", 400));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email Or Password!", 400));
  }
  if (role !== user.role) {
    return next(new ErrorHandler(`User Not Found With This Role!`, 400));
  }
  generateToken(user, "Login Successfully!", 201, res);
});

export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  const { username, email, phone, dob, password } = req.body;

  if (!username || !email || !phone || !dob || !password) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(
      new ErrorHandler(
        `${isRegistered.role}Admin With This Email Already Exists!`,
        400
      )
    );
  }

  const admin = await User.create({
    username,
    email,
    phone,
    dob,
    password,
    role: "Admin",
  });

  res.status(200).json({
    success: true,
    message: "New Admin Registered",
    admin, // Ensure to send correct admin object
  });
});

export const getAllAdmin = catchAsyncErrors(async (req, res, next) => {
  const Admins = await User.find({ role: "Admin" });
  res.status(200).json({
    success: true,
    Admins,
  });
});

export const addNewManager = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Manager Avatar Required!", 400));
  }
  const { avatar } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(avatar.mimetype)) {
    return next(new ErrorHandler("File Format Not Supported!", 400));
  }
  const { username, email, phone, dob, password, Department } = req.body;
  if (
    !username ||
    !email ||
    !phone ||
    !dob ||
    !password ||
    !Department ||
    !avatar
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return next(
      new ErrorHandler(
        `${isRegistered.role}Manager With This Email Already Exists!`,
        400
      )
    );
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    avatar.tempFilePath
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary error"
    );
    return next(
      new ErrorHandler("Failed To Upload Doctor Avatar To Cloudinary", 500)
    );
  }
  const manager = await User.create({
    username,
    email,
    phone,
    dob,
    password,
    role: "Manager",
    Department,
    avatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    message: "New Manager Registered",
    manager,
  });
});

export const getAllManagers = catchAsyncErrors(async (req, res, next) => {
  const managers = await User.find({ role: "Manager" });
  res.status(200).json({
    success: true,
    managers,
  });
});

export const deleteManager = catchAsyncErrors(async (req, res, next) => {
  const Id = req.params.id;

  if (!isValidObjectId(Id)) {
    return next(new ErrorHandler("Invalid Manager ID", 400));
  }

  const manager = await User.findOneAndDelete({ _id: Id, role: "Manager" });

  if (!manager) {
    return next(new ErrorHandler("Manager not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Manager deleted successfully",
  });
});

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

// Logout function for dashboard admin
export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("adminToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Admin Logged Out Successfully.",
    });
});

// Logout function for frontend User
export const logoutUser = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("userToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "User Logged Out Successfully.",
    });
});
