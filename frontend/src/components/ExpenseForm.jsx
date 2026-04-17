import { useState, useEffect } from "react";
import { addExpense, getCategories } from "../api/expenseApi";

function ExpenseForm({ onExpenseAdded }) {
  const [form, setForm] = useState({
    amount: "",
    description: "",
    date: "",
    category_id: "",
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await addExpense(form);

      // ✅ notify parent
      onExpenseAdded(res.data);

      // reset form
      setForm({
        amount: "",
        description: "",
        date: "",
        category_id: "",
      });
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Expense</h2>

      <input
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={(e) =>
          setForm({ ...form, amount: e.target.value })
        }
      />

      <input
        type="text"
        placeholder="Description"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      <input
        type="date"
        value={form.date}
        onChange={(e) =>
          setForm({ ...form, date: e.target.value })
        }
      />

      <select
        value={form.category_id}
        onChange={(e) =>
          setForm({ ...form, category_id: e.target.value })
        }
      >
        <option value="">Select Category</option>

        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <button type="submit">Add Expense</button>
    </form>
  );
}

export default ExpenseForm;