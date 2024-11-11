import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
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
    productName: {
        type: String,
        required: true,
        minLength: [3, "Product Name Must Contain At Least 3 Characters!"],
        },
    title: {
        type: String,
        required: true,
        minLength: [5, "Title Must Contain At Least 5 Characters!"],
    },
    desc: {
        type: String,
        required: true,
        minLength: [10, "Description Must Contain At Least 10 Characters!"],
    },
    category: {
        type: Number,
        required: true,
        min: [0, "Price Must Be Non-Negative!"],
    },
    price: {
        type: Number,
        required: true,
        min: [0, "Price Must Be Non-Negative!"],
    },
    stock: {
        type: Number,
        required: true,
        min: [0, "Stock Must Be Non-Negative!"],
    },
    createdAt: { type: Date, default: Date.now },
});

export const Product = mongoose.model("Product", productSchema);