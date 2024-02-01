import dotenv from "dotenv";
dotenv.config();
import cors from 'cors';
import express from "express";
import userRouter from "./src/features/User/user.routes.js";
import { appLevelErrorHandlerMiddleware } from "./src/utils/errorHandler.js";
const app = express();

app.use(express.json());
// Configuring cors middleware
const corsOptions = {
  origin: 'http://localhost:3000', // Specify the exact origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

// Use cors middleware with options
app.use(cors(corsOptions));

app.use("/api/users/", userRouter);
app.get("/", (req, res) => {
  res.send("Welcome to liveConnect Backend");
});
app.use(appLevelErrorHandlerMiddleware);
export default app;
