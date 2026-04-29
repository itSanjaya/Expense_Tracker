// src/routes/accountRoutes.js
import express from "express";
import accountController from "../controllers/accountController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { updateProfileSchema, changePasswordSchema, deleteAccountSchema } from "../validation/schemas.js";

const router = express.Router();

router.get("/profile", authMiddleware, accountController.getProfile);
router.put("/profile", authMiddleware, validate(updateProfileSchema), accountController.updateProfile);
router.put("/password", authMiddleware, validate(changePasswordSchema), accountController.changePassword);
router.delete("/", authMiddleware, validate(deleteAccountSchema), accountController.deleteAccount);

export default router;