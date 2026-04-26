import { useState } from "react";
import { setBudget } from "../api/budgetApi";

function BudgetManager({
  categories,
  budgets,
  setBudgets,
  selectedMonth,
  onMonthChange,
}) {
  const [form, setForm] = useState({
    categoryId: "",
    limitAmount: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await setBudget({
        categoryId: form.categoryId,
        limitAmount: form.limitAmount,
        month: `${selectedMonth}-01`, // "2026-04" → "2026-04-01"
      });

      const updated = res.data.data;

      setBudgets((prev) => {
        const filtered = prev.filter(
          (b) =>
            !(
              b.category_id === updated.category_id && b.month === updated.month
            ),
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
      {/* Header — title and month picker stacked, not side by side */}
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2">Budget Manager</h2>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => onMonthChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
      </div>

      {/* Form — stacked layout, button full width */}
      <form onSubmit={handleSubmit} className="space-y-2 mb-4">
        <select
          className="w-full border p-2 rounded"
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          required
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Limit"
          className="w-full border p-2 rounded"
          value={form.limitAmount}
          onChange={(e) => setForm({ ...form, limitAmount: e.target.value })}
          required
        />

        <button
          className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition cursor-pointer"
          type="submit"
        >
          Save
        </button>
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
              {categories.find((c) => c.id === b.category_id)?.name ||
                "Unknown"}
            </span>
            <span className="font-bold">Rs {b.limit_amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BudgetManager;
