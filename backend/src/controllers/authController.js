import authModel from "../models/authModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// 1. REGISTER — creates account + sets cookie (auto-login)
const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await authModel.createUser(email, password);

    // Auto-login: issue JWT immediately
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      data: {
        id: user.id,
        email: user.email,
        display_name: null,
        avatar_color: null,
        created_at: user.created_at,
      },
      error: null,
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({ data: null, error: "Email already in use" });
    }
    return res.status(500).json({ data: null, error: error.message });
  }
};

// 2. LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await authModel.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ data: null, error: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ data: null, error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      data: {
        id: user.id,
        email: user.email,
        display_name: user.display_name ?? null,
        avatar_color: user.avatar_color ?? null,
      },
      error: null,
    });
  } catch (error) {
    return res.status(500).json({ data: null, error: error.message });
  }
};

// 3. LOGOUT
const logout = async (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "none" });
  return res.status(200).json({ data: "Logged out successfully", error: null });
};

// 4. GET ME
const getMe = async (req, res) => {
  const user = await authModel.findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ data: null, error: "User not found" });
  }
  return res.status(200).json({
    data: {
      id: user.id,
      email: user.email,
      display_name: user.display_name ?? null,
      phone: user.phone ?? null,
      address: user.address ?? null,
      avatar_color: user.avatar_color ?? null,
      created_at: user.created_at,
    },
    error: null,
  });
};

export default { register, login, logout, getMe };