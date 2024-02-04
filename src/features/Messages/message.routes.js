import express from "express";
import { userMessages } from "./message.controller.js";
const router = express.Router();

router.get("/get-messages/:senderID/:receiverID", userMessages);

export default router;
