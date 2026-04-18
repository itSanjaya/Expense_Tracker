import db from "../config/db.js";

const getAllCategories = async () => {
  const result = await db.query("SELECT * FROM categories ORDER BY id");
  return result.rows;
};

async function createCategory(name, userId) {
  const query = `
    INSERT INTO categories (name, user_id)
    VALUES ($1, $2)
    RETURNING *;
  `;

  const result = await db.query(query, [name, userId]);

  return result.rows[0];
}

export default {
  getAllCategories,
  createCategory,
};