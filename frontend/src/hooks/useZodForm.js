// src/hooks/useZodForm.js
import { useState } from "react";

/**
 * Lightweight form validation hook backed by a Zod schema.
 *
 * Usage:
 *   const { errors, validate, clearErrors, clearFieldError } = useZodForm(mySchema);
 *
 *   const ok = validate(formValues);   // returns true/false, sets errors
 *   if (!ok) return;
 *   // ...submit
 */
export function useZodForm(schema) {
  const [errors, setErrors] = useState({});

  /**
   * Run schema against `data`.
   * Returns true if valid, false if not (and populates `errors`).
   */
  const validate = (data) => {
    const result = schema.safeParse(data);

    if (result.success) {
      setErrors({});
      return true;
    }

    const fieldErrors = {};
    const issues = result.error?.errors ?? result.error?.issues ?? [];
    issues.forEach((e) => {
      const key = e.path.join(".") || "_root";
      if (!fieldErrors[key]) {
        fieldErrors[key] = e.message;
      }
    });

    setErrors(fieldErrors);
    return false;
  };

  const clearErrors = () => setErrors({});

  const clearFieldError = (field) =>
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });

  return { errors, validate, clearErrors, clearFieldError };
}