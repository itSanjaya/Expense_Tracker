import { useState, useEffect } from "react";
import { addExpense, addCategory } from "../api/expenseApi";

function ExpenseForm({ onExpenseAdded, categories: propCategories, onCategoryAdded }) {
  const [form, setForm] = useState({
    amount: "",
    description: "",
    date: "",
    category_id: "",
  });

  const [localCategories, setLocalCategories] = useState(propCategories);
  const [newCategoryName, setNewCategoryName] = useState("");

  // keep localCategories in sync with parent
  useEffect(() => {
    setLocalCategories(propCategories);
  }, [propCategories]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let categoryId = form.category_id;

      // CASE 1: user selected "add-new"
      if (categoryId === "add-new") {
        if (!newCategoryName.trim()) {
          console.error("Category name required");
          return;
        }

        const categoryRes = await addCategory({
          name: newCategoryName,
        });

        const newCategory = categoryRes.data;
        setLocalCategories((prev) => [...prev, newCategory]);
        onCategoryAdded(newCategory); // ← notify parent
        categoryId = newCategory.id;
      }

      // create expense using final categoryId
      const expenseRes = await addExpense({
        ...form,
        category_id: categoryId,
      });

      onExpenseAdded(expenseRes.data);

      // reset form
      setForm({
        amount: "",
        description: "",
        date: "",
        category_id: "",
      });

      setNewCategoryName("");
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Add Expense</h2>

        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />

        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <select
          value={form.category_id}
          onChange={(e) => setForm({ ...form, category_id: e.target.value })}
        >
          <option value="">Select Category</option>

          {localCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}

          <option value="add-new">+ Add New Category</option>
        </select>
        {/* Inline category creation */}
        {form.category_id === "add-new" && (
          <div>
            <input
              type="text"
              placeholder="New category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
          </div>
        )}
        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
}

export default ExpenseForm;
