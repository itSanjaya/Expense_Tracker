import db from "../config/db.js";

async function getBudget(userId, month) {
  const query = `
    SELECT *
    FROM budgets
    WHERE user_id = $1
      AND month = $2
    ORDER BY category_id;
  `;

  const result = await db.query(query, [userId, month]);
  return result.rows;
}

async function setBudget(userId, categoryId, month, limitAmount) {
  const query = `
    INSERT INTO budgets (user_id, category_id, month, limit_amount)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id, category_id, month)
    DO UPDATE SET limit_amount = EXCLUDED.limit_amount
    RETURNING *;
  `;

  const result = await db.query(query, [
    userId,
    categoryId,
    month,
    limitAmount,
  ]);

  return result.rows[0];
}

export default {
  getBudget,
  setBudget,
};