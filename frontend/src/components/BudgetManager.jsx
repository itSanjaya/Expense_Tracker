// src/components/BudgetManager.jsx
import { useState } from "react";
import { setBudget } from "../api/budgetApi";
import { useZodForm } from "../hooks/useZodForm";
import { budgetSchema } from "../validation/schemas";

function FieldError({ message }) {
  if (!message) return null;
  return <p style={{ color: "#f87171", fontSize: 12, marginTop: 4, fontFamily: "'Inter', sans-serif" }}>{message}</p>;
}

function BudgetManager({ categories, budgets, setBudgets, selectedMonth, onMonthChange }) {
  const [form, setForm] = useState({ categoryId: "", limitAmount: "" });
  const { errors, validate, clearFieldError } = useZodForm(budgetSchema);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate(form)) return;
    try {
      const res = await setBudget({
        categoryId: Number(form.categoryId),
        limitAmount: Number(form.limitAmount),
        month: `${selectedMonth}-01`,
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
    <div className="card" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 className="font-syne" style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>
          Budget Manager
        </h2>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => onMonthChange(e.target.value)}
          className="et-input"
          style={{ width: "auto", fontSize: 12, padding: "5px 10px", cursor: "pointer" }}
        />
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <select
              value={form.categoryId}
              onChange={(e) => { setForm({ ...form, categoryId: e.target.value }); clearFieldError("categoryId"); }}
              className={`et-input${errors.categoryId ? " error" : ""}`}
            >
              <option value="">Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <FieldError message={errors.categoryId} />
          </div>

          <div style={{ width: 96 }}>
            <input
              type="number"
              placeholder="Limit"
              value={form.limitAmount}
              onChange={(e) => { setForm({ ...form, limitAmount: e.target.value }); clearFieldError("limitAmount"); }}
              className={`et-input${errors.limitAmount ? " error" : ""}`}
            />
            <FieldError message={errors.limitAmount} />
          </div>

          <button
            type="submit"
            style={{
              padding: "9px 16px", borderRadius: 10, border: "none", flexShrink: 0,
              background: "linear-gradient(135deg, #7C3AED, #9333ea)",
              color: "white", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
              cursor: "pointer", boxShadow: "0 4px 12px rgba(124,58,237,0.25)",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            Save
          </button>
        </div>
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {budgets.length === 0 && (
          <p style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", padding: "12px 0" }}>
            No budgets set for {selectedMonth}
          </p>
        )}
        {budgets.map((b) => (
          <div key={b.id} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "10px 12px", borderRadius: 10,
            background: "var(--bg-surface-hover)",
            border: "1px solid var(--border-subtle)",
          }}>
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              {categories.find((c) => c.id === b.category_id)?.name || "Unknown"}
            </span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--accent-purple)" }}>
              Rs {b.limit_amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BudgetManager;