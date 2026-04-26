function SummaryBar({ expenses }) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const thisMonthExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalThisMonth = thisMonthExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const totalAllTime = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
  const count = expenses.length;

  // Top category this month
  const categoryTotals = {};
  thisMonthExpenses.forEach(e => {
    categoryTotals[e.category_name] = (categoryTotals[e.category_name] || 0) + parseFloat(e.amount);
  });
  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  const cards = [
    { label: "Spent This Month", value: `Rs ${totalThisMonth.toFixed(2)}`, icon: "💸", color: "from-violet-500 to-purple-600" },
    { label: "Total All Time", value: `Rs ${totalAllTime.toFixed(2)}`, icon: "🧾", color: "from-blue-500 to-cyan-600" },
    { label: "Expenses", value: count, icon: "📦", color: "from-emerald-500 to-green-600" },
    { label: "Top Category", value: topCategory ? `${topCategory[0]} (Rs ${topCategory[1].toFixed(2)})` : "—", icon: "🔥", color: "from-orange-500 to-red-500" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {cards.map(card => (
        <div key={card.label} className={`bg-linear-to-br ${card.color} rounded-2xl p-4 text-white shadow-lg`}>
          <div className="text-2xl mb-1">{card.icon}</div>
          <div className="text-xl font-bold">{card.value}</div>
          <div className="text-sm opacity-80">{card.label}</div>
        </div>
      ))}
    </div>
  );
}

export default SummaryBar;