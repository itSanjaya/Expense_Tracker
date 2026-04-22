import { useEffect, useState } from "react";
import { getBudgets, setBudget } from "../api/budgetApi";

function BudgetManager({ categories, budgets, setBudgets }) {
  const [form, setForm] = useState({
    categoryId: "",
    limitAmount: "",
    month: "2026-04-01",
  });

  // fetch budgets on load
  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    const res = await getBudgets(form.month);
    setBudgets(res.data.data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await setBudget(form);

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

      setForm({
        categoryId: "",
        limitAmount: "",
        month: form.month,
      });
    } catch (err) {
      console.error("Failed to set budget:", err);
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h2 className="text-lg font-bold mb-4">Budget Manager</h2>

      {/* form */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <select
          className="border p-2 rounded"
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
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
          className="border p-2 rounded"
          value={form.limitAmount}
          onChange={(e) => setForm({ ...form, limitAmount: e.target.value })}
        />

        <button
          className="bg-purple-600 text-white px-4 py-2 rounded"
          type="submit"
        >
          Save
        </button>
      </form>

      {/* list */}
      <div className="space-y-2">
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
