import mongoose from "mongoose";
import UserModel from "./user.schema.js";
import {
  compareHashedPassword,
  hashPassword,
} from "../../utils/hashPassword.js";
import { v4 as uuidv4 } from "uuid"; // Import uuid for generating unique roomIds

export const userRegisterationRepo = async (userData) => {
  try {
    const isUserExist = await UserModel.findOne({ email: userData.email });
    if (isUserExist) throw new Error("User Already Exist");
    const newUser = new UserModel(userData);
    await newUser.save();
    return { success: true, res: newUser };
  } catch (error) {
    return { success: false, error: { statusCode: 400, msg: error } };
  }
};

export const userLoginRepo = async (userData) => {
  try {
    const { email, password } = userData;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return {
        success: false,
        error: { statusCode: 404, msg: "user not found" },
      };
    } else {
      let passwordValidation = await compareHashedPassword(
        password,
        user.password
      );
      if (passwordValidation) {
        return { success: true, res: user };
      } else {
        return {
          success: false,
          error: { statusCode: 400, msg: "invalid credentials" },
        };
      }
    }
  } catch (error) {
    return {
      success: false,
      error: { statusCode: 400, msg: error },
    };
  }
};

export const userDetailsRepo = async (id) => {
  try {
    const user = await UserModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          email: 1,
          gender: 1,
        },
      },
    ]);

    if (!user || user.length === 0) {
      return {
        success: false,
        error: { statusCode: 404, msg: "User not found" },
      };
    }
    return { success: true, user: user[0] };
  } catch (error) {
    return {
      success: false,
      error: { statusCode: 500, msg: error.message || "Internal Server Error" },
    };
  }
};

export const updateUserDetailsRepo = async (userId, updatedData) => {
  try {
    let hashedPassword = "";
    if (updatedData.password) {
      hashedPassword = await hashPassword(updatedData.password);
    }
    let finalUpdatedData = updatedData;
    if (hashedPassword != "") {
      finalUpdatedData = { ...updatedData, password: hashedPassword };
    }

    const result = await UserModel.updateOne(
      { _id: userId },
      { $set: finalUpdatedData }
    );
    if (result.nModified === 0) {
      return {
        success: false,
        error: { statusCode: 404, msg: "User not found or no changes applied" },
      };
    }
    return { success: true, msg: "User details updated successfully" };
  } catch (error) {
    return {
      success: false,
      error: { statusCode: 500, msg: error.message || "Internal Server Error" },
    };
  }
};

export const allUserDetailsRepo = async (userId, name) => {
  try {
    const users = await UserModel.aggregate([
      {
        $match: {
          _id: { $ne: new mongoose.Types.ObjectId(userId) },
          name: { $regex: new RegExp(name, "i") }, // Case-insensitive substring match
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
        },
      },
    ]);

    return { success: true, users };
  } catch (error) {
    return {
      success: false,
      error: { statusCode: 500, msg: error.message || "Internal Server Error" },
    };
  }
};


export const addFriendRepo = async (userID, id) => {
  try {
    const friendUser = await UserModel.findById(id);
    if (!friendUser)
      return {
        success: false,
        error: { statusCode: 404, msg: 'User not found' },
      };

    const loggedInUser = await UserModel.findById(userID);

    // Check if users are already friends
    const areAlreadyFriends = loggedInUser.friends.some(
      (friend) => friend.user.toString() === id
    );

    if (areAlreadyFriends) {
      return {
        success: false,
        error: { statusCode: 400, msg: 'You are already friends' },
      };
    }

    // Generate a unique roomId using uuid
    const roomId = uuidv4();

    // Update friends array with user, name, and roomId
    friendUser.friends.push({
      user: new mongoose.Types.ObjectId(userID),
      name: loggedInUser.name, // Add the name of the logged-in user
      roomId,
    });

    loggedInUser.friends.push({
      user: new mongoose.Types.ObjectId(id),
      name: friendUser.name, // Add the name of the friend user
      roomId,
    });

    // Save changes to both users
    await friendUser.save();
    await loggedInUser.save();

    return {
      success: true,
      message: `${friendUser.name} is added to your friends list`,
      roomId, // Return roomId for reference if needed
    };
  } catch (error) {
    return {
      success: false,
      error: { statusCode: 500, msg: error.message || 'Internal Server Error' },
    };
  }
};


export const getFriendsRepo = async (userID) => {
  try {
    const loggedInUser = await UserModel.findById(userID);
    if (!loggedInUser)
      return {
        success: false,
        error: { statusCode: 404, msg: "User not found" },
      };

    // Extract the desired fields from friends array
    const friends = loggedInUser.friends.map((friend) => ({
      id: friend.user,
      name: friend.name,
      roomID: friend.roomId,
    }));

    return {
      success: true,
      friends,
    };
  } catch (error) {
    return {
      success: false,
      error: { statusCode: 500, msg: error.message || "Internal Server Error" },
    };
  }
};
