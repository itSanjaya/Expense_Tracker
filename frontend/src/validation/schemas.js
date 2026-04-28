// src/validation/schemas.js  (frontend)
import { z } from "zod";

// ─── Auth ────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ─── Expenses ────────────────────────────────────────────────────────────────

export const expenseSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, {
      message: "Amount must be a positive number",
    }),
  description: z.string().max(255, "Description too long").optional(),
  date: z.string().min(1, "Date is required"),
  category_id: z
    .string()
    .min(1, "Please select a category")
    .refine((v) => v !== "add-new" || true, { message: "Please select or add a category" }),
});

// ─── Categories ──────────────────────────────────────────────────────────────

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(100, "Category name too long")
    .trim(),
});

// ─── Budgets ─────────────────────────────────────────────────────────────────

export const budgetSchema = z.object({
  categoryId: z.string().min(1, "Please select a category"),
  limitAmount: z
    .string()
    .min(1, "Limit amount is required")
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, {
      message: "Limit must be a positive number",
    }),
});