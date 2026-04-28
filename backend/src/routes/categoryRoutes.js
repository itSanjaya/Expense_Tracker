// src/routes/categoryRoutes.js
import express from "express";
import categoryController from "../controllers/categoryController.js";
import { validate } from "../middleware/validate.js";
import { createCategorySchema } from "../validation/schemas.js";

const router = express.Router();

router.get("/", categoryController.fetchCategories);
router.post("/", validate(createCategorySchema), categoryController.addCategory);

export default router;