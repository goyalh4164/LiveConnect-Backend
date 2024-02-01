import dotenv from "dotenv";
dotenv.config();
import express from "express";
import userRouter from "./src/features/User/user.routes.js";
import { appLevelErrorHandlerMiddleware } from "./src/utils/errorHandler.js";
const app = express();

app.use(express.json());

app.use("/api/users/", userRouter);
app.get("/", (req, res) => {
  res.send("Welcome to liveConnect Backend");
});
app.use(appLevelErrorHandlerMiddleware);
export default app;
