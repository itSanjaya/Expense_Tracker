import { useEffect, useState } from "react";
import { getExpenses, getCategories } from "./api/expenseApi";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import ExpenseFilter from "./components/ExpenseFilter";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category_id: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, []);

  const fetchExpenses = async () => {
    const res = await getExpenses();
    setExpenses(res.data);
  };

  const fetchCategories = async () => {
    const res = await getCategories();
    setCategories(res.data);
  };

  // ✅ called when form adds expense
  const handleExpenseAdded = (newExpense) => {
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const handleDeleteExpense = (id) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  const handleUpdateExpense = (updated) => {
    setExpenses((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  const filteredExpenses = expenses.filter((exp) => {
    if (filters.category_id && exp.category_id !== Number(filters.category_id))
      return false;

    if (filters.startDate && exp.date < filters.startDate) return false;

    if (filters.endDate && exp.date > filters.endDate) return false;

    return true;
  });

  const clearFilters = () => {
    setFilters({
      category_id: "",
      startDate: "",
      endDate: "",
    });
  };

  return (
    <div>
      <h1>Expense Tracker</h1>

      <ExpenseForm
        onExpenseAdded={handleExpenseAdded}
        categories={categories}
      />
      <ExpenseFilter
        filters={filters}
        categories={categories}
        onFilterChange={setFilters}
        onClearFilters={clearFilters}
      />
      <ExpenseList
        expenses={filteredExpenses}
        onDeleteExpense={handleDeleteExpense}
        onUpdateExpense={handleUpdateExpense}
      />


    </div>
  );
}

export default App;
