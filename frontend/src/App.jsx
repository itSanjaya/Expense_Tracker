import { useEffect, useState } from "react";
import { getExpenses, getCategories } from "./api/expenseApi";
import { getCurrentUser, logout } from "./api/authApi";

import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import ExpenseFilter from "./components/ExpenseFilter";

import HomePage from "./components/HomePage";
import LoginModal from "./components/modals/LoginModal";
import RegisterModal from "./components/modals/RegisterModal";

function App() {
  const [user, setUser] = useState(null);
  const [modal, setModal] = useState(null); // "login" | "register" | null

  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);

  const [filters, setFilters] = useState({
    category_id: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getCurrentUser();
        setUser(res.data);

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
      console.error(err);
    }
  };

  const handleExpenseAdded = (newExpense) => {
    setExpenses((prev) => [newExpense, ...prev]);
  };

  const handleDeleteExpense = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const handleUpdateExpense = (updated) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === updated.id ? updated : e))
    );
  };

  const filteredExpenses = expenses.filter((exp) => {
    if (
      filters.category_id &&
      exp.category_id !== Number(filters.category_id)
    )
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

  // =======================
  // AUTH VIEW (Home + Modals)
  // =======================
  if (!user) {
    return (
      <>
        <HomePage onOpenLogin={() => setModal("login")} />

        {modal === "login" && (
          <LoginModal
            onClose={() => setModal(null)}
            onLoginSuccess={(data) => {
              setUser(data);
              setModal(null);
              fetchExpenses();
              fetchCategories();
            }}
            onSwitchToRegister={() => setModal("register")}
          />
        )}

        {modal === "register" && (
          <RegisterModal
            onClose={() => setModal(null)}
            onRegisterSuccess={() => setModal("login")}
            onSwitchToLogin={() => setModal("login")}
          />
        )}
      </>
    );
  }

  // =======================
  // MAIN APP (Dashboard)
  // =======================
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-purple-600 text-white px-8 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">Expense Tracker</h1>

        <div className="flex items-center gap-4">
          <span className="text-sm">{user?.email}</span>

          <button
            onClick={handleLogout}
            className="bg-white text-purple-600 px-4 py-1 rounded-lg text-sm font-medium hover:bg-purple-50 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Form */}
          <div className="md:col-span-1 bg-white p-4 rounded-xl shadow-sm">
            <ExpenseForm
              onExpenseAdded={handleExpenseAdded}
              categories={categories}
              onCategoryAdded={(newCat) => setCategories((prev) => [...prev, newCat])}
            />
          </div>

          {/* List */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <ExpenseFilter
                filters={filters}
                categories={categories}
                onFilterChange={setFilters}
                onClearFilters={clearFilters}
              />
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm">
              <ExpenseList
                expenses={filteredExpenses}
                onDeleteExpense={handleDeleteExpense}
                onUpdateExpense={handleUpdateExpense}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;