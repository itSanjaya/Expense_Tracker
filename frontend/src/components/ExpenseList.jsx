import { useState } from "react";
import { deleteExpense, updateExpense } from "../api/expenseApi";
import ConfirmModal from "./modals/ConfirmModal";

function ExpenseList({
  expenses = [],
  onDeleteExpense,
  onUpdateExpense,
}) {
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [editForm, setEditForm] = useState({
    amount: "",
    description: "",
    date: "",
    category_id: "",
  });

  const handleDeleteClick = (id) => {
    setDeletingId(id);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteExpense(deletingId);
      onDeleteExpense(deletingId);
      setDeletingId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelDelete = () => {
    setDeletingId(null);
  };

  const handleEdit = (exp) => {
    setEditingId(exp.id);
    setEditForm({
      amount: exp.amount,
      description: exp.description,
      date: exp.date.split("T")[0],
      category_id: exp.category_id,
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
      console.error(error);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Expenses</h2>

      {expenses.length === 0 && (
        <p className="text-gray-500 text-center py-6">
          No expenses found
        </p>
      )}

      <div className="space-y-3">
        {expenses.map((exp) => (
          <div
            key={exp.id}
            className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition bg-white"
          >
            {editingId === exp.id ? (
              <div className="space-y-3">
                <input
                  type="number"
                  value={editForm.amount}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      amount: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />

                <input
                  type="text"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />

                <input
                  type="date"
                  value={editForm.date}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      date: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave(exp.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 cursor-pointer"
                  >
                    Save
                  </button>

                  <button
                    onClick={handleCancel}
                    className="border border-gray-400 px-3 py-1 rounded-lg hover:bg-gray-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-800">
                    {exp.description}
                  </p>

                  <p className="text-sm text-gray-500">
                    {new Date(exp.date).toLocaleDateString()} •{" "}
                    {exp.category_name || "Uncategorized"}
                  </p>
                </div>

                <div className="text-right space-y-2">
                  <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    Rs {exp.amount}
                  </span>

                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => handleEdit(exp)}
                      className="border border-blue-500 text-blue-500 px-3 py-1 rounded-lg hover:bg-blue-50 cursor-pointer"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeleteClick(exp.id)}
                      className="border border-red-500 text-red-500 px-3 py-1 rounded-lg hover:bg-red-50 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Confirm Modal */}
      {deletingId && (
        <ConfirmModal
          title="Delete Expense"
          message="This action cannot be undone. Are you sure?"
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}

export default ExpenseList;