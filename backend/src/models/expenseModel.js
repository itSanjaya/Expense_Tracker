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

async function deleteExpense(expenseId, userId) {
  const result = await db.query(
    'DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING *',
    [expenseId, userId]
  );

  return result.rows[0];
}

async function updateExpense(expenseId, userId, data) {
  const { amount, description, date, category_id } = data;
  const result = await db.query(
    'UPDATE expenses SET amount = $1, description = $2, date = $3, category_id = $4 WHERE id = $5 AND user_id = $6 RETURNING *',
    [amount, description, date, category_id, expenseId, userId]
  );
  return result.rows[0];
}

export default {
  createExpense,
  getExpensesByUser,
  deleteExpense,
  updateExpense,
};