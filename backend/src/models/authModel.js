import db from "../config/db.js";
import bcrypt from "bcrypt";
// 1. Create user
async function createUser(email, password) {
  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = `
    INSERT INTO users (email, password)
    VALUES ($1, $2)
    RETURNING id, email, created_at;
  `;
  const result = await db.query(query, [email, hashedPassword]);
  return result.rows[0]; // no password returned
}
// 2. Find user by email (for login)
async function findUserByEmail(email) {
  const query = `
    SELECT * FROM users
    WHERE email = $1;
  `;
  const result = await db.query(query, [email]);
  return result.rows[0]; // includes password
}

async function findUserById(id) {
  const query = ` 
    SELECT id, email, created_at FROM users WHERE id = $1`;
  const result = await db.query(query, [id]);
  return result.rows[0];
}
export default {
  createUser,
  findUserByEmail,
  findUserById,
};