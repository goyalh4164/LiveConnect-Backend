import express from "express";
import {
  updateUserDetails,
  userDetails,
  userLogin,
  userLogout,
  userRegisteration,
} from "./user.controller.js";
import { auth } from "../../middlewares/jwtAuth.js";

const router = express.Router();

router.post("/signup", userRegisteration);
router.post("/signin", userLogin);
router.get("/logout", auth, userLogout);
router.get("/get-details/:id", auth, userDetails);
router.put("/update-details/:id", auth, updateUserDetails);

export default router;
