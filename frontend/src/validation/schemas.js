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

// ─── Account Settings ───────────────────────────────────────────────────────

export const updateProfileSchema = z.object({
  displayName: z.string().max(100, "Name too long").optional(),
  phone: z
    .string()
    .max(20, "Phone too long")
    .regex(/^[+\d\s\-()]*$/, "Invalid phone number")
    .optional(),
  address: z.string().max(255, "Address too long").optional(),
  avatarColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color")
    .optional(),
});
 
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
 
export const deleteAccountSchema = z.object({
  password: z.string().min(1, "Password is required"),
});
 