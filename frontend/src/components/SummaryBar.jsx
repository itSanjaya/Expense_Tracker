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
    { label: "This Month",   value: `Rs ${totalThisMonth.toFixed(2)}`, icon: "💸", r: "124,58,237" },
    { label: "All Time",     value: `Rs ${totalAllTime.toFixed(2)}`,   icon: "🧾", r: "37,99,235"  },
    { label: "Expenses",     value: count,                             icon: "📦", r: "5,150,105"  },
    { label: "Top Category", value: top ? top[0] : "—",               icon: "🔥", r: "234,88,12",
      sub: top ? `Rs ${top[1].toFixed(2)}` : null },
  ];

  return (
    <div className="summary-grid">
      {cards.map((card) => (
        <div
          key={card.label}
          style={{
            padding: 14,
            borderRadius: 16,
            background: `rgba(${card.r}, 0.10)`,
            border: `1px solid rgba(${card.r}, 0.20)`,
            fontFamily: "'Inter', sans-serif",
            minWidth: 0, /* essential — lets grid cells shrink */
          }}
        >
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: `rgba(${card.r}, 0.18)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, marginBottom: 8, flexShrink: 0,
          }}>
            {card.icon}
          </div>

          {/* Value — truncate if needed rather than wrapping */}
          <div
            className="font-syne"
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              lineHeight: 1.2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {card.value}
          </div>

          {card.sub && (
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {card.sub}
            </div>
          )}

          {/* Label uses the shared CSS class — nowrap + ellipsis */}
          <div className="summary-card-label">{card.label}</div>
        </div>
      ))}
    </div>
  );
}

export default SummaryBar;