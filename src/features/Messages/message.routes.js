import express from "express";

const router = express.Router();

router.post("/get-messages", userMessages);

export default router;
