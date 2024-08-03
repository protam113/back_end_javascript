import mongoose from "mongoose";

const newsSchema = new mongoose.Schema({
    caption: {
        type: String,
        maxLength: [30, "Caption must be at most 30 characters long."]
    },
    title: String,
    desc: String,
    createdAt: { type: Date, default: Date.now }, 
    image: {
        public_id: String,
        url: String,
    },
    active: {
        type: String,
        enum: ["Live", "Not Live", "Rejected"],
        default: "Live",
    },
});

export const News = mongoose.model("New", newsSchema);
