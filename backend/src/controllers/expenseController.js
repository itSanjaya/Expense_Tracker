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

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedExpense = await Expense.deleteExpense(id, 1);
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
    const updatedExpense = await Expense.updateExpense(id, 1, data);
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