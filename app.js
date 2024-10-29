import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { dbConnection } from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";

// api
import infoRoute from "./routes/infoRoute.js";
import productRouter from "./routes/productRoute.js";
import userRouter from "./routes/userRoute.js";
import appointmentRouter from "./routes/appointmentRouter.js";
import messageRoute from "./routes/messageRoute.js";
import newRoute from "./routes/newRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import solutionRoute from "./routes/solutionRoute.js";
import documentRoute from "./routes/documentRoute.js";
import serviceRoute from "./routes/serviceRoute.js";
import cartRouter from "./routes/cartRouter.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.BACKEND_URL],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api/info", infoRoute);
app.use("/api/product", productRouter);
app.use("/api/user", userRouter);
app.use("/api/appointment", appointmentRouter);
app.use("/api/message", messageRoute);
app.use("/api/new", newRoute);
app.use("/api/category", categoryRoute);
app.use("/api/solution", solutionRoute);
app.use("/api/document", documentRoute);
app.use("/api/service", serviceRoute);
app.use("/api/cart", cartRouter);

dbConnection();

app.use(errorMiddleware);

export default app;
