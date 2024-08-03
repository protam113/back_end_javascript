import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: [11, "Name Must Contain At Least 3 Characters!"],
    },
    phone: {
        type: String,
        required: true,
        minLength: [11, "Phone Number Must Contain Exact 11 Digits!"],
        maxLength: [11, "Phone Number Must Contain Exact 11 Digits!"],
    },
    message: {
        type: String,
        required: true,
        minLength: [10, "Message Must Contain At Least 10 Characters!"],
    },
});

export const Message = mongoose.model("Message", messageSchema);
