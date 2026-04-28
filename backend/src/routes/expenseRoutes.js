// src/routes/expenseRoutes.js
import express from "express";
import expenseController from "../controllers/expenseController.js";
import { validate } from "../middleware/validate.js";
import { createExpenseSchema, updateExpenseSchema } from "../validation/schemas.js";

const router = express.Router();

router.get("/", expenseController.getExpenses);
router.post("/", validate(createExpenseSchema), expenseController.addExpense);
router.delete("/:id", expenseController.deleteExpense);
router.put("/:id", validate(updateExpenseSchema), expenseController.updateExpense);

export default router;