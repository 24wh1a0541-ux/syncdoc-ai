import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

export const registerUser = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Please provide full name, email, and password" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const user = await User.create({ fullName, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Logged in successfully",
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};

export const getCurrentUser = async (req, res, next) => {
  try {
    res.status(200).json({ user: req.user.toSafeObject() });
  } catch (error) {
    next(error);
  }
};
