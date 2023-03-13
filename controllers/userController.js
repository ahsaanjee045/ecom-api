import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

/**
 * This function registers a user, hashes its password and generates a token to authorize it in another operations
 * data : {
 *  username : String,
 *  email : String,
 * password : String
 * }
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const registerUser = async (req, res) => {
  const data = req.body;
  try {
    const existinguser = await User.findOne({ email: data.email });
    if (existinguser) {
      return res.status(400).json({ message: "User Already Exists" });
    }
    let hashedPassword = await bcryptjs.hash(data.password, 10);
    data.password = hashedPassword;
    const newUser = await new User(data).save();
    const token = jwt.sign({ _id: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: "72hrs",
    });
    return res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      createdAt: newUser.createdAt,
      message: "Register Successfull",
      isAdmin: newUser.isAdmin,
      token,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const loginUser = async (req, res) => {
  const data = req.body;

  try {
    const existinguser = await User.findOne({ email: data.email });
    if (!existinguser) {
      return res.status(401).json({ message: "User Not Found" });
    }
    const decodePassword = await bcryptjs.compare(
      data.password,
      existinguser.password
    );

    if (!decodePassword) {
      return res.status(401).json({ message: "Invalid Details" });
    }
    const token = jwt.sign({ _id: existinguser._id }, process.env.SECRET_KEY, {
      expiresIn: "72hrs",
    });
    res.status(200).json({
      message: "Login Success",
      _id: existinguser._id,
      username: existinguser.username,
      email: existinguser.email,
      createdAt: existinguser.createdAt,
      isAdmin: existinguser.isAdmin,
      token,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getAllUser = async (req, res) => {
  const { _id, email } = req.user;
  try {
    const users = await User.find({ email: { $ne: email } });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateAdmin = async (req, res) => {
  const { _id } = req.params;
  const user = req.user;

  try {
    if (user._id == _id) {
      return res
        .status(401)
        .json({ message: "You can Not Update Your Own Admin Status" });
    }
    const existUser = await User.findById(_id);
    if (!existUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (existUser.isAdmin) {
      const updatedUser = await User.findByIdAndUpdate(
        { _id },
        {
          $set: { isAdmin: false },
        },
        { new: true }
      );
      return res.status(200).json(updatedUser);
    } else {
      const updatedUser = await User.findByIdAndUpdate(
        { _id },
        {
          $set: { isAdmin: true },
        },
        { new: true }
      );
      return res.status(200).json(updatedUser);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { _id } = req.params;
  const user = req.user;
  try {
    if (user._id == _id) {
      return res.status(401).json({ message: "You can Not Delete youself" });
    }
    const existUser = await User.findById(_id);
    if (!existUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const deletedUser = await User.findByIdAndDelete(_id);
    return res.status(200).json(deletedUser);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
