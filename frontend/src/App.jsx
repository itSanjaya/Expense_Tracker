import { useEffect, useState } from "react";
import { getExpenses, getCategories } from "./api/expenseApi";
import { getCurrentUser, logout } from "./api/authApi";
import { getBudgets } from "./api/budgetApi";

import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import ExpenseFilter from "./components/ExpenseFilter";
import BudgetManager from "./components/BudgetManager";
import BudgetProgress from "./components/BudgetProgress";
import SummaryBar from "./components/SummaryBar";
import ExpenseCharts from "./components/ExpenseCharts";
import Navbar from "./components/Navbar";
import SettingsPage from "./components/SettingsPage";
import ToastContainer from "./components/ToastContainer";

import HomePage from "./components/HomePage";
import LoginModal from "./components/modals/LoginModal";
import RegisterModal from "./components/modals/RegisterModal";

import { useToast } from "./hooks/useToast";

function App() {
  const [user, setUser] = useState(null);
  const [modal, setModal] = useState(null);
  const [page, setPage] = useState("dashboard");

  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7),
  );
  const [filters, setFilters] = useState({
    category_id: "",
    startDate: "",
    endDate: "",
  });

  const { toasts, toast, dismiss } = useToast();

  // =========================
  // MASTER REFRESH FUNCTION
  // =========================
  const refreshData = async () => {
    const [expenseRes, categoryRes, budgetRes] = await Promise.all([
      getExpenses(),
      getCategories(),
      getBudgets(`${selectedMonth}-01`),
    ]);
    setExpenses(expenseRes.data);
    setCategories(categoryRes.data);
    setBudgets(budgetRes.data.data || []);
  };

  // =========================
  // AUTH CHECK ON LOAD
  // =========================
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getCurrentUser();
        setUser(res.data.data ?? res.data);
        await refreshData();
      } catch {
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  // =========================
  // AUTH HANDLERS
  // =========================
  const handleLoginSuccess = async (userData) => {
    const u = userData.data ?? userData;
    setUser(u);
    setModal(null);
    await refreshData();
    toast.success(`Welcome back, ${u.display_name || u.email.split("@")[0]}! 👋`);
  };

  const handleRegisterSuccess = async (userData) => {
    const u = userData.data ?? userData;
    setUser(u);
    setModal(null);
    await refreshData();
    toast.success(`Account created! Welcome, ${u.email.split("@")[0]} 🎉`, { duration: 5000 });
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
      setExpenses([]);
      setCategories([]);
      setBudgets([]);
      setPage("dashboard");
    }
  };

  // =========================
  // EXPENSE HANDLERS
  // =========================
  const handleExpenseAdded = async () => {
    await refreshData();
    toast.success("Expense added!");
  };

  const handleDeleteExpense = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    toast.info("Expense deleted.");
  };

  const handleUpdateExpense = (updated) => {
    setExpenses((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    toast.success("Expense updated!");
  };

  // =========================
  // FILTER LOGIC
  // =========================
  const filteredExpenses = expenses.filter((exp) => {
    if (filters.category_id && exp.category_id !== Number(filters.category_id))
      return false;
    if (filters.startDate && exp.date < filters.startDate) return false;
    if (filters.endDate && exp.date > filters.endDate) return false;
    return true;
  });

  const clearFilters = () => {
    setFilters({ category_id: "", startDate: "", endDate: "" });
  };

  // =========================
  // AUTH VIEW
  // =========================
  if (!user) {
    return (
      <>
        <HomePage onOpenLogin={() => setModal("login")} />
        {modal === "login" && (
          <LoginModal
            onClose={() => setModal(null)}
            onLoginSuccess={handleLoginSuccess}
            onSwitchToRegister={() => setModal("register")}
          />
        )}
        {modal === "register" && (
          <RegisterModal
            onClose={() => setModal(null)}
            onRegisterSuccess={handleRegisterSuccess}
            onSwitchToLogin={() => setModal("login")}
          />
        )}
        <ToastContainer toasts={toasts} onDismiss={dismiss} />
      </>
    );
  }

  // =========================
  // SETTINGS PAGE
  // =========================
  if (page === "settings" || page === "developer") {
    return (
      <>
        <Navbar user={user} onLogout={handleLogout} onNavigate={setPage} />
        <SettingsPage
          user={user}
          defaultTab={page === "developer" ? "developer" : "profile"}
          onBack={() => setPage("dashboard")}
          onProfileSaved={(updated) => {
            setUser((prev) => ({ ...prev, ...updated, email: prev.email }));
            toast.success("Profile saved!");
          }}
          onAccountDeleted={() => {
            setUser(null);
            setPage("dashboard");
          }}
        />
        <ToastContainer toasts={toasts} onDismiss={dismiss} />
      </>
    );
  }

  // =========================
  // DASHBOARD
  // =========================
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} onNavigate={setPage} />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <ExpenseForm
                onExpenseAdded={handleExpenseAdded}
                categories={categories}
                onCategoryAdded={(cat) => {
                  setCategories((prev) => [...prev, cat]);
                  toast.success(`Category "${cat.name}" created!`);
                }}
              />
            </div>

            <BudgetManager
              categories={categories}
              budgets={budgets}
              setBudgets={setBudgets}
              selectedMonth={selectedMonth}
              onMonthChange={async (newMonth) => {
                setSelectedMonth(newMonth);
                const res = await getBudgets(`${newMonth}-01`);
                setBudgets(res.data.data || []);
              }}
            />

            <BudgetProgress
              budgets={budgets}
              expenses={expenses}
              categories={categories}
              selectedMonth={selectedMonth}
            />
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <ExpenseFilter
                filters={filters}
                categories={categories}
                onFilterChange={setFilters}
                onClearFilters={clearFilters}
              />
            </div>

            <SummaryBar expenses={filteredExpenses} />

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

      <div className="max-w-6xl mx-auto px-6 pb-12">
        <h2 className="text-xl font-bold text-gray-700 mb-4">📊 Analytics</h2>
        <ExpenseCharts expenses={expenses} />
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}

export default App;