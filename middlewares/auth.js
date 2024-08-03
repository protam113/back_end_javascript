import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./errorMiddleware.js";
import jwt from "jsonwebtoken";

export const isAdminAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.adminToken;
  if (!token) {
    return next(new ErrorHandler("Admin Not Authenticated!", 400));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if (!req.user || req.user.role !== "Admin") {
      throw new Error("Invalid Admin Token or User Role");
    }
    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid Admin Token or User Role", 400));
  }
});

export const isUserAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.userToken;
  if (!token) {
    return next(new ErrorHandler("User Not Authenticated!", 400));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    if (!req.user || req.user.role !== "User") {
      throw new Error("Invalid User Token or User Role");
    }
    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid User Token or User Role", 400));
  }
});
