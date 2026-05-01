function SummaryBar({ expenses }) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear  = now.getFullYear();

  const thisMonth = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalThisMonth = thisMonth.reduce((s, e) => s + parseFloat(e.amount), 0);
  const totalAllTime   = expenses.reduce((s, e) => s + parseFloat(e.amount), 0);
  const count = expenses.length;

  const catTotals = {};
  thisMonth.forEach((e) => {
    catTotals[e.category_name] = (catTotals[e.category_name] || 0) + parseFloat(e.amount);
  });
  const top = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];

  const cards = [
    { label: "Spent This Month", value: `Rs ${totalThisMonth.toFixed(2)}`, icon: "💸",  r: "124,58,237"  },
    { label: "Total All Time",   value: `Rs ${totalAllTime.toFixed(2)}`,   icon: "🧾",  r: "37,99,235"   },
    { label: "Expenses Logged",  value: count,                             icon: "📦",  r: "5,150,105"   },
    { label: "Top Category",     value: top ? top[0] : "—",               icon: "🔥",  r: "234,88,12",
      sub: top ? `Rs ${top[1].toFixed(2)}` : null },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}
      className="md:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} style={{
          padding: 16, borderRadius: 16,
          background: `rgba(${card.r},0.10)`,
          border: `1px solid rgba(${card.r},0.20)`,
          boxShadow: `0 2px 12px rgba(${card.r},0.08)`,
          transition: "background 0.25s ease, border-color 0.25s ease",
          fontFamily: "'Inter', sans-serif",
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: `rgba(${card.r},0.18)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, marginBottom: 10,
          }}>{card.icon}</div>
          <div className="font-syne" style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.2 }}>
            {card.value}
          </div>
          {card.sub && (
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{card.sub}</div>
          )}
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{card.label}</div>
        </div>
      ))}
    </div>
  );
}

export default SummaryBar;