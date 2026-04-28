// src/validation/schemas.js
import { z } from "zod";

// ─── Auth ────────────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});

// ─── Expenses ────────────────────────────────────────────────────────────────

export const createExpenseSchema = z.object({
  amount: z
    .number({ required_error: "Amount is required", invalid_type_error: "Amount must be a number" })
    .positive("Amount must be greater than 0"),
  description: z
    .string()
    .max(255, "Description too long")
    .optional(),
  date: z
    .string({ required_error: "Date is required" })
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  category_id: z
    .number({ required_error: "Category is required", invalid_type_error: "Category ID must be a number" })
    .int("Category ID must be an integer")
    .positive("Category ID must be positive"),
});

export const updateExpenseSchema = z.object({
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .positive("Amount must be greater than 0")
    .optional(),
  description: z
    .string()
    .max(255, "Description too long")
    .optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .optional(),
  category_id: z
    .number({ invalid_type_error: "Category ID must be a number" })
    .int("Category ID must be an integer")
    .positive("Category ID must be positive")
    .optional(),
});

// ─── Categories ──────────────────────────────────────────────────────────────

export const createCategorySchema = z.object({
  name: z
    .string({ required_error: "Category name is required" })
    .min(1, "Category name cannot be empty")
    .max(100, "Category name too long")
    .trim(),
});

// ─── Budgets ─────────────────────────────────────────────────────────────────

export const upsertBudgetSchema = z.object({
  categoryId: z
    .number({ required_error: "Category is required", invalid_type_error: "Category ID must be a number" })
    .int("Category ID must be an integer")
    .positive("Category ID must be positive"),
  month: z
    .string({ required_error: "Month is required" })
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Month must be in YYYY-MM-DD format"),
  limitAmount: z
    .number({ required_error: "Limit amount is required", invalid_type_error: "Limit amount must be a number" })
    .positive("Limit amount must be greater than 0"),
});