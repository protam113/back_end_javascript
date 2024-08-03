import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "UserName Is Required!"],
        minLength: [9, "UserName Must Contain At Least 9 Characters!"],
    },
    email: {
        type: String,
        required: [true, "Email Is Required!"],
        validate: [validator.isEmail, "Provide A Valid Email!"],
    },
    phone: {
        type: String,
        required: [true, "Phone Is Required!"],
        minLength: [10, "Phone Number Must Contain Exact 10 Digits!"],
        maxLength: [12, "Phone Number Must Contain Exact 12 Digits!"],
    },
    dob: {
        type: Date,
        required: [true, "DOB Is Required!"],
    },
    password: {
        type: String,
        required: [true, "Password Is Required!"],
        minLength: [8, "Password Must Contain At Least 8 Characters!"],
        select: false,
    },
    role: {
        type: String,
        required: [true, "User Role Required!"],
        enum: ["User", "Manager", "Admin"],
    },
    Department:{
        type: String,
    },
    avatar: {
        public_id: String,
        url: String,
    },
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateJsonWebToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES,
    });
};

export const User = mongoose.model("User", userSchema);
