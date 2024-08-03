import mongoose from "mongoose";

export const dbConnection = () => {
    mongoose.connect(process.env.MONGO_URI, {
        dbName: "Test1"
    })
    .then (() => {
        console.log("Connect Mongo DB")
    })
    .catch(error => {
        console.log(`Error to database: ${error}`)
    });
};