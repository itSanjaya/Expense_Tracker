import { useEffect, useState } from "react";
import { getExpenses, getCategories } from "./api/expenseApi";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
// import CategoryForm from "./components/CategoryForm";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);


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
  }

  // ✅ called when form adds expense
  const handleExpenseAdded = (newExpense) => {
    setExpenses((prev) => [newExpense, ...prev]);
  };

  // const handleCategoryAdded = (newCategory) => {
  //   setCategories((prev) => [newCategory, ...prev]);
  // };



  return (
    <div>
      <h1>Expense Tracker</h1>

      <ExpenseForm onExpenseAdded={handleExpenseAdded} categories={categories}/>
      {/* <CategoryForm onCategoryAdded={handleCategoryAdded} /> */}

      <ExpenseList expenses={expenses} />
    </div>
  );
}

export default App;