import db from "../config/db.js";

const getAllCategories = async (userId) => {
  const result = await db.query(
    "SELECT * FROM categories WHERE user_id = $1 ORDER BY id",
    [userId]
  );
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