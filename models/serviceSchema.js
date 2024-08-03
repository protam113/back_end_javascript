import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({

    caption: {
        type: String,
        required: true,
    },
    intro: {
        type: String,
        required: true,
        maxLength: [10, " intro must contain at max 10 characters!"],
    },
    image: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    description: {
        type: String,
        required: true,
    },
    title: {
        type: String,
    },
    link: {
        type:String
    },
    createdAt: { type: Date, default: Date.now },

});

export const Service = mongoose.model("Service", serviceSchema);