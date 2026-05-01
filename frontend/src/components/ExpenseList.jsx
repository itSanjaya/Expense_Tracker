import { useState } from "react";
import { deleteExpense, updateExpense } from "../api/expenseApi";
import ConfirmModal from "./modals/ConfirmModal";
import exportToCSV from "../utils/exportToCSV";

function ExpenseList({ expenses = [], onDeleteExpense, onUpdateExpense }) {
  const [editingId, setEditingId]   = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editForm, setEditForm]     = useState({ amount: "", description: "", date: "", category_id: "" });

  const handleConfirmDelete = async () => {
    try {
      await deleteExpense(deletingId);
      onDeleteExpense(deletingId);
      setDeletingId(null);
    } catch (err) { console.error(err); }
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

  const handleSave = async (id) => {
    try {
      const res = await updateExpense(id, {
        ...editForm,
        amount: Number(editForm.amount),
        category_id: Number(editForm.category_id),
      });
      onUpdateExpense(res.data);
      setEditingId(null);
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <h2 className="font-syne" style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)" }}>
          Expenses
        </h2>

        <button
          onClick={() => {
            const m = new Date().toISOString().slice(0, 7);
            exportToCSV(expenses, `expenses-${m}.csv`);
          }}
          disabled={expenses.length === 0}
          style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "7px 12px", borderRadius: 8,
            fontSize: 12, fontWeight: 600, cursor: "pointer",
            background: "rgba(5,150,105,0.10)",
            border: "1px solid rgba(5,150,105,0.25)",
            color: "#10b981",
            fontFamily: "'Inter', sans-serif",
            opacity: expenses.length === 0 ? 0.35 : 1,
            transition: "opacity 0.15s",
          }}
        >
          {/* Icon always visible; label hidden on very small screens via CSS */}
          <span>⬇️</span>
          <span className="export-btn-label">Export CSV</span>
        </button>
      </div>

      {/* ── Empty state ── */}
      {expenses.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
          <p style={{ color: "var(--text-muted)", fontSize: 13 }}>No expenses found</p>
        </div>
      )}

      {/* ── List ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {expenses.map((exp) => (
          <div
            key={exp.id}
            style={{
              borderRadius: 12,
              padding: "12px 14px",
              background: editingId === exp.id ? "var(--accent-purple-bg)" : "var(--bg-surface-hover)",
              border: `1px solid ${editingId === exp.id ? "var(--accent-purple-border)" : "var(--border-subtle)"}`,
              transition: "background 0.2s, border-color 0.2s",
            }}
          >
            {/* ── Edit mode ── */}
            {editingId === exp.id ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <input
                  type="number"
                  value={editForm.amount}
                  onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                  className="et-input"
                  placeholder="Amount"
                />
                <input
                  type="text"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="et-input"
                  placeholder="Description"
                />
                <input
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                  className="et-input"
                />

                {/* Save / Cancel — stack on very small screens via .edit-form-actions */}
                <div
                  className="edit-form-actions"
                  style={{ display: "flex", gap: 8, marginTop: 4 }}
                >
                  <button
                    onClick={() => handleSave(exp.id)}
                    style={{
                      padding: "8px 20px", borderRadius: 8, border: "none",
                      fontSize: 13, fontWeight: 600,
                      background: "var(--accent-purple)", color: "white",
                      cursor: "pointer", fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    style={{
                      padding: "8px 20px", borderRadius: 8,
                      fontSize: 13, fontWeight: 500,
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border-default)",
                      color: "var(--text-muted)", cursor: "pointer",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>

            ) : (
              /* ── View mode ── */
              /*
                .expense-row wraps at ≤480px:
                  - .expense-row-left  → full width, description + meta
                  - .expense-row-right → full width, right-aligned: amount · edit · delete
              */
              <div className="expense-row">

                {/* Left: description + meta */}
                <div className="expense-row-left" style={{ minWidth: 0 }}>
                  <p style={{
                    fontWeight: 600, fontSize: 13,
                    color: "var(--text-primary)",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {exp.description || "—"}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>
                    {new Date(exp.date).toLocaleDateString()} · {exp.category_name || "Uncategorized"}
                  </p>
                </div>

                {/* Right: amount pill + action buttons */}
                <div className="expense-row-right">
                  {/* Amount */}
                  <span style={{
                    fontSize: 12, fontWeight: 700,
                    padding: "4px 10px", borderRadius: 999,
                    background: "rgba(5,150,105,0.12)", color: "#10b981",
                    border: "1px solid rgba(5,150,105,0.2)",
                    whiteSpace: "nowrap",
                  }}>
                    Rs {exp.amount}
                  </span>

                  {/* Edit */}
                  <button
                    onClick={() => handleEdit(exp)}
                    title="Edit"
                    className="expense-action-btn"
                    style={{
                      padding: 6, borderRadius: 8, fontSize: 14,
                      cursor: "pointer", lineHeight: 1,
                      background: "rgba(59,130,246,0.08)",
                      border: "1px solid rgba(59,130,246,0.18)",
                      color: "#60a5fa",
                    }}
                  >
                    ✏️
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => setDeletingId(exp.id)}
                    title="Delete"
                    className="expense-action-btn"
                    style={{
                      padding: 6, borderRadius: 8, fontSize: 14,
                      cursor: "pointer", lineHeight: 1,
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.18)",
                      color: "#f87171",
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Confirm delete modal ── */}
      {deletingId && (
        <ConfirmModal
          title="Delete Expense"
          message="This action cannot be undone. Are you sure?"
          onCancel={() => setDeletingId(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}

export default ExpenseList;