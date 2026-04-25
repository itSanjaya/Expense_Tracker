function BudgetProgress({ budgets, expenses, categories }) {
  // calculate spent per category
  const spentMap = {};

  expenses.forEach((e) => {
    const catId = e.category_id;
    spentMap[catId] = (spentMap[catId] || 0) + Number(e.amount);
  });

  const getCategoryName = (id) => {
    return categories.find((c) => c.id === id)?.name || "Unknown";
  };

  const getColor = (percent) => {
    if (percent < 75) return "bg-green-500";
    if (percent < 100) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow mt-4">
      <h2 className="text-lg font-bold mb-4">Budget Overview</h2>

      <div className="space-y-4">
        {budgets.map((b) => {
          const spent = spentMap[b.category_id] || 0;
          const limit = Number(b.limit_amount);
          const percent = limit ? (spent / limit) * 100 : 0;

          return (
            <div key={b.id}>
              <div className="flex justify-between mb-1">
                <span className="font-medium">
                  {getCategoryName(b.category_id)}
                </span>
                <span className="text-sm text-gray-600">
                  {spent} / {limit}
                </span>
              </div>

              <div className="w-full bg-gray-200 h-2 rounded">
                <div
                  className={`${getColor(percent)} h-2 rounded`}
                  style={{ width: `${Math.min(percent, 100)}%` }}
                ></div>
              </div>

              <p className="text-xs text-gray-500 mt-1">
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