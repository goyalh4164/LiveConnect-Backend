import express from "express";
import {
  updateUserDetails,
  userDetails,
  userLogin,
  userLogout,
  userRegisteration,
  allUsers,
  addFriend,
  getFriends
} from "./user.controller.js";
import { auth } from "../../middlewares/jwtAuth.js";

const router = express.Router();

router.post("/signup", userRegisteration);
router.post("/signin", userLogin);
router.get("/logout", auth, userLogout);
router.get("/get-details/", auth, userDetails);
router.put("/update-details/:id", auth, updateUserDetails);
router.get("/get-all-users/:name",auth,allUsers)
router.post("/add-friend/:id",auth,addFriend)
router.get("/user-friends",auth,getFriends);

export default router;
