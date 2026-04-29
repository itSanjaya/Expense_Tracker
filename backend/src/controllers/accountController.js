// src/controllers/accountController.js
import accountModel from "../models/accountModel.js";
import bcrypt from "bcrypt";

// GET /account/profile
const getProfile = async (req, res) => {
  try {
    const user = await accountModel.getProfile(req.user.id);
    if (!user) return res.status(404).json({ data: null, error: "User not found" });
    return res.status(200).json({ data: user, error: null });
  } catch (err) {
    return res.status(500).json({ data: null, error: err.message });
  }
};

// PUT /account/profile
const updateProfile = async (req, res) => {
  try {
    const { displayName, phone, address, avatarColor } = req.body;
    const user = await accountModel.updateProfile(req.user.id, {
      displayName,
      phone,
      address,
      avatarColor,
    });
    return res.status(200).json({ data: user, error: null });
  } catch (err) {
    return res.status(500).json({ data: null, error: err.message });
  }
};

// PUT /account/password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await accountModel.getUserWithPassword(req.user.id);
    if (!user) return res.status(404).json({ data: null, error: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ data: null, error: "Current password is incorrect" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await accountModel.updatePassword(req.user.id, hashed);

    return res.status(200).json({ data: "Password updated successfully", error: null });
  } catch (err) {
    return res.status(500).json({ data: null, error: err.message });
  }
};

// DELETE /account
const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    const user = await accountModel.getUserWithPassword(req.user.id);
    if (!user) return res.status(404).json({ data: null, error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ data: null, error: "Password is incorrect" });
    }

    await accountModel.deleteUser(req.user.id);

    res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "none" });
    return res.status(200).json({ data: "Account deleted", error: null });
  } catch (err) {
    return res.status(500).json({ data: null, error: err.message });
  }
};

export default { getProfile, updateProfile, changePassword, deleteAccount };