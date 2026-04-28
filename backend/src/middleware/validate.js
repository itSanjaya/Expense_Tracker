// src/middleware/validate.js
/**
 * Reusable Zod validation middleware.
 *
 * Usage in a route file:
 *   import { validate } from "../middleware/validate.js";
 *   import { createExpenseSchema } from "../validation/schemas.js";
 *
 *   router.post("/", validate(createExpenseSchema), expenseController.addExpense);
 *
 * On failure, returns:
 *   { data: null, error: "Validation failed", details: [{ field, message }] }
 */

export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const issues = result.error?.errors ?? result.error?.issues ?? [];

      const details = issues.map((e) => ({
        field: e.path.join(".") || "body",
        message: e.message,
      }));

      return res.status(400).json({
        data: null,
        error: "Validation failed",
        details,
      });
    }

    // Replace req.body with the parsed (coerced + trimmed) data
    req.body = result.data;
    next();
  };
}