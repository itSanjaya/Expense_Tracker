// src/routes/budgetRoutes.js
import express from "express";
import budgetController from "../controllers/budgetController.js";
import { validate } from "../middleware/validate.js";
import { upsertBudgetSchema } from "../validation/schemas.js";

const router = express.Router();

// Get budgets for a month
router.get("/", budgetController.fetchBudget);

// Create or update budget
router.post("/", validate(upsertBudgetSchema), budgetController.upsertBudget);

export default router;