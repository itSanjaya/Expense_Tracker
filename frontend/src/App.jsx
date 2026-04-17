import { useEffect, useState } from "react";
import { getExpenses } from "./api/expenseApi";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";

function App() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const res = await getExpenses();
    setExpenses(res.data);
  };

  // ✅ called when form adds expense
  const handleExpenseAdded = (newExpense) => {
    setExpenses((prev) => [newExpense, ...prev]);
  };

  return (
    <div>
      <h1>Expense Tracker</h1>

      <ExpenseForm onExpenseAdded={handleExpenseAdded} />

      <ExpenseList expenses={expenses} />
    </div>
  );
}

export default App;