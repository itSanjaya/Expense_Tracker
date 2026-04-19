import Expense from "../models/expenseModel.js";

const getExpenses = async (req, res) => {
  try {
    const userID = req.user.id; // from authMiddleware
    
    const expenses = await Expense.getExpensesByUser(userID);
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addExpense = async (req, res) => {
  try {
    const data = req.body;
    const userID = req.user.id; // from authMiddleware
    
    const newExpense = await Expense.createExpense(userID, data);

    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userID = req.user.id; // from authMiddleware

    const deletedExpense = await Expense.deleteExpense(id, userID);
    if (!deletedExpense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.status(200).json(deletedExpense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const userID = req.user.id; // from authMiddleware

    const updatedExpense = await Expense.updateExpense(id, userID, data);
    if (!updatedExpense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  getExpenses,
  addExpense,
  deleteExpense,
  updateExpense,
};