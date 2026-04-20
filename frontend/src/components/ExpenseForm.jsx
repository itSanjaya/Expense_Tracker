import { useState, useEffect } from "react";
import { addExpense, addCategory } from "../api/expenseApi";

function ExpenseForm({ onExpenseAdded, categories: propCategories }) {
  const [form, setForm] = useState({
    amount: "",
    description: "",
    date: "",
    category_id: "",
  });

  const [localCategories, setLocalCategories] = useState(propCategories);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    setLocalCategories(propCategories);
  }, [propCategories]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let categoryId = form.category_id;

      if (categoryId === "add-new") {
        if (!newCategoryName.trim()) return;

        const categoryRes = await addCategory({
          name: newCategoryName,
        });

        const newCategory = categoryRes.data;

        setLocalCategories((prev) => [...prev, newCategory]);
        categoryId = newCategory.id;
      }

      const expenseRes = await addExpense({
        ...form,
        category_id: categoryId,
      });

      onExpenseAdded(expenseRes.data);

      setForm({
        amount: "",
        description: "",
        date: "",
        category_id: "",
      });

      setNewCategoryName("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Add Expense</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount */}
        <div className="flex flex-col gap-1">
          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Date */}
        <div className="flex flex-col gap-1">
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer"
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1">
          <select
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer"
          >
            <option value="">Select Category</option>

            {localCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}

            <option value="add-new">+ Add New Category</option>
          </select>
        </div>

        {/* New Category Input */}
        {form.category_id === "add-new" && (
          <div className="flex flex-col gap-1">
            <input
              type="text"
              placeholder="New category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="w-full border border-yellow-300 bg-yellow-50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
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
