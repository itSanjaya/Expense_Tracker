function BudgetProgress({ budgets, expenses, categories, selectedMonth }) {
  const monthlyExpenses = expenses.filter((e) => e.date.slice(0, 7) === selectedMonth);

  const spentMap = {};
  monthlyExpenses.forEach((e) => {
    spentMap[e.category_id] = (spentMap[e.category_id] || 0) + Number(e.amount);
  });

  const getCategoryName = (id) => categories.find((c) => c.id === id)?.name || "Unknown";

  const getBarColor = (percent) => {
    if (percent < 75)  return { bar: "#10b981", glow: "rgba(16,185,129,0.3)",  label: "#10b981" };
    if (percent < 100) return { bar: "#f59e0b", glow: "rgba(245,158,11,0.3)",  label: "#f59e0b" };
    return               { bar: "#ef4444", glow: "rgba(239,68,68,0.3)",   label: "#ef4444" };
  };

  if (budgets.length === 0) return null;

  return (
    <div className="card" style={{ fontFamily: "'Inter', sans-serif" }}>
      <h2 className="font-syne" style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 18 }}>
        Budget Overview
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {budgets.map((b) => {
          const spent   = spentMap[b.category_id] || 0;
          const limit   = Number(b.limit_amount);
          const percent = limit ? (spent / limit) * 100 : 0;
          const colors  = getBarColor(percent);

          return (
            <div key={b.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>
                  {getCategoryName(b.category_id)}
                </span>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  Rs {spent} <span style={{ opacity: 0.5 }}>/</span> Rs {limit}
                </span>
              </div>

              <div style={{ width: "100%", height: 6, borderRadius: 999, background: "var(--border-default)", overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 999,
                  width: `${Math.min(percent, 100)}%`,
                  background: colors.bar,
                  boxShadow: `0 0 8px ${colors.glow}`,
                  transition: "width 0.5s ease",
                }} />
              </div>

              <p style={{ fontSize: 11, marginTop: 4, color: colors.label }}>
                {percent.toFixed(0)}% used
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BudgetProgress;