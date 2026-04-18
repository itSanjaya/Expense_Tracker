import express from "express";
import expenseController from "../controllers/expenseController.js";

const router = express.Router();

router.get("/", expenseController.getExpenses);
router.post("/", expenseController.addExpense);
router.get("/categories", getCategories);

export default router;