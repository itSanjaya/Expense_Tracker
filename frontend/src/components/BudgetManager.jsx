// src/components/BudgetManager.jsx
import { useState } from "react";
import { setBudget } from "../api/budgetApi";
import { useZodForm } from "../hooks/useZodForm";
import { budgetSchema } from "../validation/schemas";

function FieldError({ message }) {
  if (!message) return null;
  return <p className="text-red-500 text-xs mt-1">{message}</p>;
}

function BudgetManager({ categories, budgets, setBudgets, selectedMonth, onMonthChange }) {
  const [form, setForm] = useState({
    categoryId: "",
    limitAmount: "",
  });

  const { errors, validate, clearFieldError } = useZodForm(budgetSchema);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ok = validate(form);
    if (!ok) return;

    try {
      const res = await setBudget({
        categoryId: Number(form.categoryId),
        limitAmount: Number(form.limitAmount),
        month: `${selectedMonth}-01`, // "2026-04" → "2026-04-01"
      });

      const updated = res.data.data;

      setBudgets((prev) => {
        const filtered = prev.filter(
          (b) => !(b.category_id === updated.category_id && b.month === updated.month)
        );
        return [...filtered, updated];
      });

      setForm({ categoryId: "", limitAmount: "" });
    } catch (err) {
      console.error("Failed to set budget:", err);
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Budget Manager</h2>

        {/* Month Picker */}
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => onMonthChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2 items-start">
          <div className="flex-1">
            <select
              className={`w-full border p-2 rounded ${
                errors.categoryId ? "border-red-400" : "border-gray-300"
              }`}
              value={form.categoryId}
              onChange={(e) => {
                setForm({ ...form, categoryId: e.target.value });
                clearFieldError("categoryId");
              }}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <FieldError message={errors.categoryId} />
          </div>

          <div>
            <input
              type="number"
              placeholder="Limit"
              className={`border p-2 rounded w-28 ${
                errors.limitAmount ? "border-red-400" : "border-gray-300"
              }`}
              value={form.limitAmount}
              onChange={(e) => {
                setForm({ ...form, limitAmount: e.target.value });
                clearFieldError("limitAmount");
              }}
            />
            <FieldError message={errors.limitAmount} />
          </div>

          <button
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition cursor-pointer"
            type="submit"
          >
            Save
          </button>
        </div>
      </form>

      {/* Budget List */}
      <div className="space-y-2">
        {budgets.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-2">
            No budgets set for {selectedMonth}
          </p>
        )}
        {budgets.map((b) => (
          <div key={b.id} className="flex justify-between p-2 border rounded">
            <span>
              {categories.find((c) => c.id === b.category_id)?.name || "Unknown"}
            </span>
            <span className="font-bold">Rs {b.limit_amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BudgetManager;