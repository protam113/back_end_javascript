import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name Is Required!"],
        minLength: [5, "Name Must Contain At Least 9 Characters!"],
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
    appointment_date: {
        type: Date,
        required: true,
    },
    title: {
        type: String,
        required: true,
        minLength: [5, "Title Must Contain At Least 5 Characters!"],
    },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected"],
        default: "Pending",
    },
});


export const Appointment = mongoose.model("Appointment", appointmentSchema);
