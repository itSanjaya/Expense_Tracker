import db from '../config/db.js';

async function createExpense(userId, data) {
  const { amount, description, date, category_id } = data;

  const result = await db.query(
    'INSERT INTO expenses (amount, description, date, user_id, category_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [amount, description, date, userId, category_id]
  );

  return result.rows[0];
}

async function getExpensesByUser(userId) {
  const result = await db.query(
    'SELECT * FROM expenses WHERE user_id = $1',
    [userId]
  );

  return result.rows;
}

export default {
  createExpense,
  getExpensesByUser,
};