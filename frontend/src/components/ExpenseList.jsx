import { useState } from "react";
import { deleteExpense, updateExpense } from "../api/expenseApi";

function ExpenseList({ expenses = [], onDeleteExpense, onUpdateExpense }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    amount: "",
    description: "",
    date: "",
    category_id: "",
  });

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?",
    );
    if (!confirmed) return;

    try {
      await deleteExpense(id);
      onDeleteExpense(id);
    } catch (error) {
      console.error("Failed to delete expense:", error);
    }
  };

  const handleEdit = (exp) => {
    setEditingId(exp.id);
    setEditForm({
      amount: exp.amount,
      description: exp.description,
      date: exp.date.split("T")[0], // normalize date
      category_id: exp.category_id || "",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleSave = async (id) => {
    try {
      const res = await updateExpense(id, editForm);
      onUpdateExpense(res.data);
      setEditingId(null);
    } catch (error) {
      console.error("Failed to update expense:", error);
    }
  };

  return (
    <div>
      
      <h2>Expenses</h2>

      {expenses.map((exp) => (
        <div key={exp.id}>
          {editingId === exp.id ? (
            <>
              <input
                type="number"
                value={editForm.amount}
                onChange={(e) =>
                  setEditForm({ ...editForm, amount: e.target.value })
                }
              />

              <input
                type="text"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
              />

              <input
                type="date"
                value={editForm.date}
                onChange={(e) =>
                  setEditForm({ ...editForm, date: e.target.value })
                }
              />

              <button onClick={() => handleSave(exp.id)}>Save</button>
              <button onClick={handleCancel}>Cancel</button>
            </>
          ) : (
            <>
              <p>
                {exp.description} - {exp.amount} -{" "}
                {new Date(exp.date).toLocaleDateString()}
              </p>

              <button onClick={() => handleDelete(exp.id)}>Delete</button>
              <button onClick={() => handleEdit(exp)}>Edit</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default ExpenseList;