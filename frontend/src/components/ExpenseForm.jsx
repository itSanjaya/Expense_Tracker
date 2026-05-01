// src/components/ExpenseForm.jsx
import { useState, useEffect } from "react";
import { addExpense, addCategory } from "../api/expenseApi";
import { useZodForm } from "../hooks/useZodForm";
import { expenseSchema, categorySchema } from "../validation/schemas";

function FieldError({ message }) {
  if (!message) return null;
  return <p style={{ color: "#f87171", fontSize: 12, marginTop: 4, fontFamily: "'Inter', sans-serif" }}>{message}</p>;
}

function ExpenseForm({ onExpenseAdded, categories: propCategories, onCategoryAdded }) {
  const [form, setForm] = useState({ amount: "", description: "", date: "", category_id: "" });
  const [localCategories, setLocalCategories] = useState(propCategories);
  const [newCategoryName, setNewCategoryName] = useState("");

  const { errors, validate, clearFieldError } = useZodForm(expenseSchema);
  const { errors: catErrors, validate: validateCategory, clearErrors: clearCatErrors } = useZodForm(categorySchema);

  useEffect(() => { setLocalCategories(propCategories); }, [propCategories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = validate(form);
    if (form.category_id === "add-new") {
      const catOk = validateCategory({ name: newCategoryName });
      if (!ok || !catOk) return;
    } else {
      if (!ok) return;
    }
    try {
      let categoryId = form.category_id;
      if (categoryId === "add-new") {
        const categoryRes = await addCategory({ name: newCategoryName });
        const newCategory = categoryRes.data;
        setLocalCategories((prev) => [...prev, newCategory]);
        onCategoryAdded(newCategory);
        categoryId = newCategory.id;
        clearCatErrors();
      }
      const expenseRes = await addExpense({ ...form, amount: Number(form.amount), category_id: Number(categoryId) });
      onExpenseAdded(expenseRes.data);
      setForm({ amount: "", description: "", date: "", category_id: "" });
      setNewCategoryName("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <h2 className="font-syne" style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>
        Add Expense
      </h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div>
          <input
            type="number"
            placeholder="Amount (Rs)"
            value={form.amount}
            onChange={(e) => { setForm((p) => ({ ...p, amount: e.target.value })); clearFieldError("amount"); }}
            className={`et-input${errors.amount ? " error" : ""}`}
          />
          <FieldError message={errors.amount} />
        </div>

        <div>
          <input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={(e) => { setForm((p) => ({ ...p, description: e.target.value })); clearFieldError("description"); }}
            className={`et-input${errors.description ? " error" : ""}`}
          />
          <FieldError message={errors.description} />
        </div>

        <div>
          <input
            type="date"
            value={form.date}
            onChange={(e) => { setForm((p) => ({ ...p, date: e.target.value })); clearFieldError("date"); }}
            className={`et-input${errors.date ? " error" : ""}`}
          />
          <FieldError message={errors.date} />
        </div>

        <div>
          <select
            value={form.category_id}
            onChange={(e) => { setForm((p) => ({ ...p, category_id: e.target.value })); clearFieldError("category_id"); }}
            className={`et-input${errors.category_id ? " error" : ""}`}
            style={{ cursor: "pointer" }}
          >
            <option value="">Select Category</option>
            {localCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
            <option value="add-new">+ Add New Category</option>
          </select>
          <FieldError message={errors.category_id} />
        </div>

        {form.category_id === "add-new" && (
          <div>
            <input
              type="text"
              placeholder="New category name"
              value={newCategoryName}
              onChange={(e) => { setNewCategoryName(e.target.value); clearCatErrors(); }}
              className={`et-input${catErrors.name ? " error" : ""}`}
              style={{ borderColor: catErrors.name ? undefined : "rgba(234,179,8,0.4)" }}
            />
            <FieldError message={catErrors.name} />
          </div>
        )}

        <button
          type="submit"
          style={{
            marginTop: 4,
            padding: "10px 0",
            borderRadius: 10,
            border: "none",
            background: "linear-gradient(135deg, #059669, #10b981)",
            color: "white",
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(5,150,105,0.3)",
            transition: "opacity 0.15s, transform 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          + Add Expense
        </button>
      </form>
    </div>
  );
}

export default ExpenseForm;