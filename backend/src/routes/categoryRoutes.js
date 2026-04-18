import express from "express";
import categoryController from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", categoryController.fetchCategories);
router.post("/", categoryController.addCategory);

export default router;