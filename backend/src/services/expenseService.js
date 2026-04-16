const db = require('../config/db');
const queries = require('../queries/expenseQueries');

async function createExpense(userId, data) {
  const { amount, description, date, category_id } = data;

  const result = await db.query(
    queries.createExpense,
    [amount, description, date, userId, category_id]
  );

  return result.rows[0];
}

async function getExpenses(userId, page = 1, limit = 10) {
  const offset = (page - 1) * limit;

  const result = await db.query(
    queries.getExpensesByUser,
    [userId, limit, offset]
  );

  return result.rows;
}

async function deleteExpense(userId, expenseId) {
  const result = await db.query(
    queries.deleteExpense,
    [expenseId, userId]
  );

  if (result.rows.length === 0) {
    throw new Error('Expense not found');
  }

  return result.rows[0];
}

module.exports = {
  createExpense,
  getExpenses,
  deleteExpense,
};