const createExpense = `
  INSERT INTO expenses (amount, description, date, user_id, category_id)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *
`;

const getExpensesByUser = `
  SELECT * FROM expenses
  WHERE user_id = $1
  ORDER BY date DESC
  LIMIT $2 OFFSET $3
`;

const getExpenseById = `
  SELECT * FROM expenses
  WHERE id = $1 AND user_id = $2
`;

const deleteExpense = `
  DELETE FROM expenses
  WHERE id = $1 AND user_id = $2
  RETURNING *
`;

module.exports = {
  createExpense,
  getExpensesByUser,
  getExpenseById,
  deleteExpense,
};