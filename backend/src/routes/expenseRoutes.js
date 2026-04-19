import express from "express";
import expenseController from "../controllers/expenseController.js";

const router = express.Router();

router.get("/", expenseController.getExpenses);
router.post("/", expenseController.addExpense);

router.delete("/:id", expenseController.deleteExpense);
router.put("/:id", expenseController.updateExpense);

export default router;