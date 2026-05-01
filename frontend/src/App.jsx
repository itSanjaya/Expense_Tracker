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
import Footer from "./components/Footer";

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
    try { await logout(); } catch (err) { console.error(err); }
    finally {
      setUser(null); setExpenses([]); setCategories([]); setBudgets([]);
      setPage("dashboard");
    }
  };

  const handleExpenseAdded = async () => { await refreshData(); toast.success("Expense added!"); };
  const handleDeleteExpense = (id) => { setExpenses((p) => p.filter((e) => e.id !== id)); toast.info("Expense deleted."); };
  const handleUpdateExpense = (updated) => { setExpenses((p) => p.map((e) => e.id === updated.id ? updated : e)); toast.success("Expense updated!"); };

  const filteredExpenses = expenses.filter((exp) => {
    if (filters.category_id && exp.category_id !== Number(filters.category_id)) return false;
    if (filters.startDate && exp.date < filters.startDate) return false;
    if (filters.endDate && exp.date > filters.endDate) return false;
    return true;
  });

  const clearFilters = () => setFilters({ category_id: "", startDate: "", endDate: "" });

  // ── Unauthenticated ────────────────────────────────────────────────────────
  if (!user) {
    return (
      <>
        <HomePage onOpenLogin={() => setModal("login")} />
        {modal === "login" && (
          <LoginModal onClose={() => setModal(null)} onLoginSuccess={handleLoginSuccess} onSwitchToRegister={() => setModal("register")} />
        )}
        {modal === "register" && (
          <RegisterModal onClose={() => setModal(null)} onRegisterSuccess={handleRegisterSuccess} onSwitchToLogin={() => setModal("login")} />
        )}
        <ToastContainer toasts={toasts} onDismiss={dismiss} />
      </>
    );
  }

  // ── Settings ───────────────────────────────────────────────────────────────
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
          onAccountDeleted={() => { setUser(null); setPage("dashboard"); }}
        />
        <ToastContainer toasts={toasts} onDismiss={dismiss} />
      </>
    );
  }

  // ── Dashboard ──────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-base)", color: "var(--text-primary)" }}>
      {/* Background decoration */}
      <div className="fixed inset-0 grid-bg pointer-events-none" style={{ opacity: 0.6 }} />
      <div
        className="fixed pointer-events-none"
        style={{ top: 0, left: "25%", width: 500, height: 500, borderRadius: "50%", background: "rgba(124,58,237,0.06)", filter: "blur(120px)" }}
      />

      <Navbar user={user} onLogout={handleLogout} onNavigate={setPage} />

      <div className="relative" style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem 1.5rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 className="font-syne" style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>
            Dashboard
          </h1>
          <p className="font-inter" style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
            Track, manage, and understand your spending.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}>
          {/* Left column */}
          <div style={{ gridColumn: "span 1", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div className="card">
              <ExpenseForm
                onExpenseAdded={handleExpenseAdded}
                categories={categories}
                onCategoryAdded={(cat) => { setCategories((p) => [...p, cat]); toast.success(`Category "${cat.name}" created!`); }}
              />
            </div>
            <BudgetManager
              categories={categories} budgets={budgets} setBudgets={setBudgets}
              selectedMonth={selectedMonth}
              onMonthChange={async (m) => { setSelectedMonth(m); const r = await getBudgets(`${m}-01`); setBudgets(r.data.data || []); }}
            />
            <BudgetProgress budgets={budgets} expenses={expenses} categories={categories} selectedMonth={selectedMonth} />
          </div>

          {/* Right column */}
          <div style={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div className="card">
              <ExpenseFilter filters={filters} categories={categories} onFilterChange={setFilters} onClearFilters={clearFilters} />
            </div>
            <SummaryBar expenses={filteredExpenses} />
            <div className="card">
              <ExpenseList expenses={filteredExpenses} onDeleteExpense={handleDeleteExpense} onUpdateExpense={handleUpdateExpense} />
            </div>
          </div>
        </div>
      </div>

      {/* Analytics */}
      <div className="relative" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem 4rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem" }}>
          <h2 className="font-syne" style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)" }}>Analytics</h2>
          <span className="font-inter" style={{
            fontSize: "0.75rem", color: "#a78bfa",
            background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.2)",
            padding: "2px 10px", borderRadius: 999,
          }}>All time</span>
        </div>
        <ExpenseCharts expenses={expenses} />
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
      <Footer />
    </div>
  );
}

export default App;