import mongoose from "mongoose";

const infoSchema = new mongoose.Schema({
    mainTitle: {
        type: String,
        required: true,
        minLength: [5, "mainTitle Must Contain At least 5 Characters!"],
    },
    intro: {
        type: String,
        required: true,
        minLength: [10, " Intro must contain at least 10 characters!"],
    },
    title: {
        type: String,
        required: true,
        minLength: [20, "title Must Contain At Least 20 Characters!"],
    },
    slogan: {
        type: String,
        required: true,
        minLength: [10, "slogan Must Contain At Least 10 Characters!"],
    },
    address: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: [true, "Phone Is Required!"],
        minLength: [10, "Phone Number Must Contain Exact 10 Digits!"],
        maxLength: [12, "Phone Number Must Contain Exact 12 Digits!"],
    },
    email: {
        type: String,
        required: [true, "Email Is Required!"],
    },
    map: {
        type: String,
        required: true
    },
    mainImage: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    // // Thêm trường mới vào schema với thuộc tính 'isPublic'
    // additionalField: {
    //     type: String, // Kiểu dữ liệu của trường mới
    //     required: true, // Có yêu cầu hay không
    //     // Xác định trường này là public hoặc private
    //     isPublic: {
    //         type: Boolean,
    //         default: true // Mặc định là public
    //     }
    // },
    link: {
        type:String
    },
    
});

export const Info = mongoose.model("Info", infoSchema);
