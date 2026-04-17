import Expense from "../models/expenseModel.js";

const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.getExpensesByUser(1); 
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addExpense = async (req, res) => {
  try {
    const data = req.body;

    const newExpense = await Expense.createExpense(1, data);

    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  getExpenses,
  addExpense,
};