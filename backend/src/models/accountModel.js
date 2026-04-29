// src/models/accountModel.js
import db from "../config/db.js";

const getProfile = async (userId) => {
  const result = await db.query(
    `SELECT id, email, display_name, phone, address, avatar_color, created_at
     FROM users WHERE id = $1`,
    [userId]
  );
  return result.rows[0];
};

const getUserWithPassword = async (userId) => {
  const result = await db.query(
    `SELECT * FROM users WHERE id = $1`,
    [userId]
  );
  return result.rows[0];
};

const updateProfile = async (userId, { displayName, phone, address, avatarColor }) => {
  const result = await db.query(
    `UPDATE users
     SET display_name = $1, phone = $2, address = $3, avatar_color = $4
     WHERE id = $5
     RETURNING id, email, display_name, phone, address, avatar_color, created_at`,
    [displayName || null, phone || null, address || null, avatarColor || null, userId]
  );
  return result.rows[0];
};

const updatePassword = async (userId, hashedPassword) => {
  await db.query(
    `UPDATE users SET password = $1 WHERE id = $2`,
    [hashedPassword, userId]
  );
};

const deleteUser = async (userId) => {
  await db.query(`DELETE FROM users WHERE id = $1`, [userId]);
};

export default { getProfile, getUserWithPassword, updateProfile, updatePassword, deleteUser };