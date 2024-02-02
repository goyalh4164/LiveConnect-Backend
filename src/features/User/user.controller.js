import {
  updateUserDetailsRepo,
  userDetailsRepo,
  userLoginRepo,
  userRegisterationRepo,
  allUserDetailsRepo
} from "./user.repository.js";
import { customErrorHandler } from "../../utils/errorHandler.js";
import { hashPassword } from "../../utils/hashPassword.js";
import jwt from "jsonwebtoken";

export const userRegisteration = async (req, res, next) => {
  const hashedPassword = await hashPassword(req.body.password);
  const resp = await userRegisterationRepo({
    ...req.body,
    password: hashedPassword,
  });
  if (resp.success) {
    res.status(201).json({
      success: true,
      msg: "user registration successful",
      res: resp.res,
    });
  } else {
    next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
  }
};

export const userLogin = async (req, res, next) => {
  try {
    const resp = await userLoginRepo(req.body);

    if (resp.success) {
      const token = jwt.sign({ _id: resp.res._id }, process.env.SECRETKEY, {
        expiresIn: "1h",
      });

      res.json({ success: true, msg: "User login successful", token });
    } else {
      if (resp.error.statusCode) {
        next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
      } else {
        next(new customErrorHandler(500, "Internal Server Error"));
      }
    }
  } catch (error) {
    next(new customErrorHandler(500, "Internal Server Error"));
  }
};

export const userLogout = async (req, res, next) => {
  try {
    req.user.tokens = req.user.tokens.filter((t) => t.token !== req.token);
    await req.user.save();
    res.status(200).send("Logout successful");
  } catch (error) {
    console.error("Logout error:", error);
    next(new customErrorHandler(500, "Internal Server Error"));
  }
};

export const userDetails = async (req, res, next) => {
  try {
    const id = req.UserID;
    const resp = await userDetailsRepo(id);
    if (resp.success) {
      res.json({ success: true, user: resp.user });
    } else {
      if (resp.error.statusCode) {
        next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
      } else {
        next(new customErrorHandler(500, "Internal Server Error"));
      }
    }
  } catch (error) {
    next(new customErrorHandler(500, "Internal Server Error"));
  }
};

export const updateUserDetails = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const updatedData = req.body;
    if (!userId || !updatedData)
      next(new customErrorHandler(500, "Internal Server Error"));
    const result = await updateUserDetailsRepo(userId, updatedData);
    if (result.success) {
      res.status(200).json({ success: true, msg: result.msg });
    } else {
      if (result.error.statusCode) {
        next(new customErrorHandler(result.error.statusCode, result.error.msg));
      } else {
        next(new customErrorHandler(500, "Internal Server Error"));
      }
    }
  } catch (error) {
    console.log(error);
    next(new customErrorHandler(500, "Internal Server Error"));
  }
};

export const allUsers = async (req, res, next) => {
  try {
    const id = req.UserID;
    const { name } = req.params;
    const resp = await allUserDetailsRepo(id, name);
    if (resp.success) {
      res.json({ success: true, users: resp.users });
    } else {
      if (resp.error.statusCode) {
        next(new customErrorHandler(resp.error.statusCode, resp.error.msg));
      } else {
        next(new customErrorHandler(500, "Internal Server Error"));
      }
    }
  } catch (error) {
    console.log(error);
    next(new customErrorHandler(500, "Internal Server Error"));
  }
};
