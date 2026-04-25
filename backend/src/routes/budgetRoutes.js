<<<<<<< HEAD
import express from "express";
import budgetController from "../controllers/budgetController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Get budgets for a month
router.get("/", budgetController.fetchBudget);

// Create or update budget
router.post("/", budgetController.upsertBudget);

export default router;
=======
import express from "express";
import budgetController from "../controllers/budgetController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Get budgets for a month
router.get("/", budgetController.fetchBudget);

// Create or update budget
router.post("/", budgetController.upsertBudget);

export default router;
>>>>>>> 8617770219ddeda56b91826bb0aec50e60091f25
