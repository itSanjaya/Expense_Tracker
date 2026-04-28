// src/components/ExpenseForm.jsx
import { useState, useEffect } from "react";
import { addExpense, addCategory } from "../api/expenseApi";
import { useZodForm } from "../hooks/useZodForm";
import { expenseSchema, categorySchema } from "../validation/schemas";

function FieldError({ message }) {
  if (!message) return null;
  return <p className="text-red-500 text-xs mt-1">{message}</p>;
}

function ExpenseForm({ onExpenseAdded, categories: propCategories, onCategoryAdded }) {
  const [form, setForm] = useState({
    amount: "",
    description: "",
    date: "",
    category_id: "",
  });

  const [localCategories, setLocalCategories] = useState(propCategories);
  const [newCategoryName, setNewCategoryName] = useState("");

  const { errors, validate, clearFieldError } = useZodForm(expenseSchema);
  const {
    errors: catErrors,
    validate: validateCategory,
    clearErrors: clearCatErrors,
  } = useZodForm(categorySchema);

  useEffect(() => {
    setLocalCategories(propCategories);
  }, [propCategories]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate expense form
    const ok = validate(form);

    // If adding new category, also validate category name
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

      const expenseRes = await addExpense({
        ...form,
        amount: Number(form.amount),
        category_id: Number(categoryId),
      });

      onExpenseAdded(expenseRes.data);

      setForm({ amount: "", description: "", date: "", category_id: "" });
      setNewCategoryName("");
    } catch (error) {
      console.error(error);
    }
  };

  const field = (name) => ({
    onChange: (e) => {
      setForm((prev) => ({ ...prev, [name]: e.target.value }));
      clearFieldError(name);
    },
    className: `w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
      errors[name]
        ? "border-red-400 focus:ring-red-300"
        : "border-gray-300 focus:ring-purple-400"
    }`,
  });

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Add Expense</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount */}
        <div>
          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            {...field("amount")}
          />
          <FieldError message={errors.amount} />
        </div>

        {/* Description */}
        <div>
          <input
            type="text"
            placeholder="Description"
            value={form.description}
            {...field("description")}
          />
          <FieldError message={errors.description} />
        </div>

        {/* Date */}
        <div>
          <input
            type="date"
            value={form.date}
            {...field("date")}
            className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 cursor-pointer ${
              errors.date
                ? "border-red-400 focus:ring-red-300"
                : "border-gray-300 focus:ring-purple-400"
            }`}
          />
          <FieldError message={errors.date} />
        </div>

        {/* Category */}
        <div>
          <select
            value={form.category_id}
            onChange={(e) => {
              setForm({ ...form, category_id: e.target.value });
              clearFieldError("category_id");
            }}
            className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 cursor-pointer ${
              errors.category_id
                ? "border-red-400 focus:ring-red-300"
                : "border-gray-300 focus:ring-purple-400"
            }`}
          >
            <option value="">Select Category</option>
            {localCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
            <option value="add-new">+ Add New Category</option>
          </select>
          <FieldError message={errors.category_id} />
        </div>

        {/* New Category Input */}
        {form.category_id === "add-new" && (
          <div>
            <input
              type="text"
              placeholder="New category name"
              value={newCategoryName}
              onChange={(e) => {
                setNewCategoryName(e.target.value);
                clearCatErrors();
              }}
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                catErrors.name
                  ? "border-red-400 focus:ring-red-300"
                  : "border-yellow-300 bg-yellow-50 focus:ring-yellow-400"
              }`}
            />
            <FieldError message={catErrors.name} />
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 font-medium cursor-pointer"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
}

export default ExpenseForm;