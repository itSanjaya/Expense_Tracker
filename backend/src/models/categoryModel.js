import db from "../config/db.js";

export const getAllCategories = async () => {
  const result = await db.query("SELECT * FROM categories ORDER BY id");
  return result.rows;
};