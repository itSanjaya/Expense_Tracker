import budgetModel from "../models/budgetModel.js";

const fetchBudget = async (req, res) => {
  const userId = req.user.id;
  const { month } = req.query;

  try {
    const budget = await budgetModel.getBudget(userId, month);

    const normalized = budget.map((b) => ({
      ...b,
      month: b.month ? new Date(b.month).toISOString().split("T")[0] : b.month,
    }));

    return res.status(200).json({
      data: normalized,
      error: null,
    });
  } catch (error) {
    console.error("FETCH BUDGET ERROR:", error);

    return res.status(500).json({
      data: null,
      error: "Server error",
    });
  }
};

// // 1. GET budgets for a month
// const fetchBudget = async (req, res) => {
//   const userId = req.user.id;
//   const { month } = req.query;

//   if (!month) {
//     return res.status(400).json({
//       data: null,
//       error: "Month is required",
//     });
//   }

//   try {
//     const budgets = await budgetModel.getBudget(userId, month);

//     return res.status(200).json({
//       data: budgets,
//       error: null,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       data: null,
//       error: error.message,
//     });
//   }
// };

// 2. UPSERT budget
const upsertBudget = async (req, res) => {
  const userId = req.user.id;
  const { categoryId, month, limitAmount } = req.body;

  if (!categoryId || !month || !limitAmount) {
    return res.status(400).json({
      data: null,
      error: "categoryId, month, limitAmount required",
    });
  }

  try {
    const budget = await budgetModel.setBudget(
      userId,
      categoryId,
      month,
      limitAmount,
    );

    // normalize date format for frontend consistency
    const normalized = {
      ...budget,
      month: budget.month
        ? new Date(budget.month).toISOString().split("T")[0]
        : budget.month,
    };

    return res.status(200).json({
      data: normalized,
      error: null,
    });
  } catch (error) {
    return res.status(500).json({
      data: null,
      error: error.message,
    });
  }
};

export default {
  fetchBudget,
  upsertBudget,
};
