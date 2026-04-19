import { useEffect, useState } from "react";
import { getExpenses, getCategories } from "./api/expenseApi";
import { getCurrentUser, logout } from "./api/authApi";

import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import ExpenseFilter from "./components/ExpenseFilter";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

function App() {
  const [user, setUser] = useState(null);
  const [authView, setAuthView] = useState("login");

  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category_id: "",
    startDate: "",
    endDate: "",
  });

  // Check auth on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getCurrentUser();
        setUser(res.data);

        // only fetch data if authenticated
        fetchExpenses();
        fetchCategories();
      } catch {
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  const fetchExpenses = async () => {
    const res = await getExpenses();
    setExpenses(res.data);
  };

  const fetchCategories = async () => {
    const res = await getCategories();
    setCategories(res.data);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setExpenses([]);
      setCategories([]);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // Expense handlers
  const handleExpenseAdded = (newExpense) => {
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const handleDeleteExpense = (id) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };

  const handleUpdateExpense = (updated) => {
    setExpenses((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  // Filtering
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

  // AUTH GATE
  if (!user) {
    return (
      <div>
        {authView === "login" ? (
          <LoginForm
            onLoginSuccess={setUser}
            onSwitchToRegister={() => setAuthView("register")}
          />
        ) : (
          <RegisterForm
            onRegisterSuccess={() => setAuthView("login")}
            onSwitchToLogin={() => setAuthView("login")}
          />
        )}
      </div>
    );
  }

  // MAIN APP
  return (
    <div>
      <h1 className="text-3xl font-bold text-purple-600">Expense Tracker</h1>

      <button onClick={handleLogout}>Logout</button>

      <ExpenseForm
        onExpenseAdded={handleExpenseAdded}
        categories={categories}
        onCategoryAdded={(newCat) => setCategories((prev) => [...prev, newCat])}
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
