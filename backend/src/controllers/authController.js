import authModel from "../models/authModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// 1. REGISTER
const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await authModel.createUser(email, password);
    return res.status(201).json({
      data: user,
      error: null,
    });
  } catch (error) {
    if (error.message === "Email already exists") {
      return res.status(400).json({
        data: null,
        error: "Email already in use",
      });
    }
    return res.status(500).json({
      data: null,
      error: error.message,
    });
  }
};
// 2. LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await authModel.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        data: null,
        error: "Invalid credentials",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        data: null,
        error: "Invalid credentials",
      });
    }
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    // set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      data: {
        id: user.id,
        email: user.email,
      },
      error: null,
    });
  } catch (error) {
    return res.status(500).json({
      data: null,
      error: "Server error",
    });
  }
};
// 3. LOGOUT
const logout = async (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({
    data: "Logged out successfully",
    error: null,
  });
};

const getMe = async (req, res) => {

  const User = await authModel.findUserById(req.user.id);
  if (!User) {
    return res.status(404).json({
      data: null,
      error: "User not found",
    });
  }
  return res.status(200).json({
    data: {
      id: User.id,
      email: User.email,
      created_at: User.created_at,
    },
    error: null,
  });
};

export default {
    register,
    login,
    logout,
    getMe,
};
