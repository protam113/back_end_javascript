import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    caption: {
        type: String,
        required: true,
        maxLength: [20, "Doc intro must contain at max 20 characters!"],
    },
    intro: {
        type: String,
        required: true,
        minLength: [10, "Doc intro must contain at least 10 characters!"],
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
    paraOneDescription: {
        type: String,
    },
    paraOneTitle: {
        type: String,
    },
    paraTwoDescription: {
        type: String,
    },
    paraTwoTitle: {
        type: String,
    },
    link: {
        type:String
    },
    published: {
        type: Boolean,
        default: false,
    },
    createdAt: { type: Date, default: Date.now },

});

export const Document = mongoose.model("Document", documentSchema);