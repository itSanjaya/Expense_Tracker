import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

const COLORS = [
  "#8b5cf6",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

// Add this helper at the top of the file, before the component
const formatMonth = (monthStr) => {
  const [year, month] = monthStr.split("-");
  const date = new Date(year, month - 1);
  return date.toLocaleString("default", { month: "short", year: "numeric" });
  // "2026-04" → "Apr 2026"
};

function ExpenseCharts({ expenses }) {
  // ─── 1. Pie — spending by category ───────────────────────────────
  const categoryMap = {};
  expenses.forEach((e) => {
    const name = e.category_name || "Uncategorized";
    categoryMap[name] = (categoryMap[name] || 0) + parseFloat(e.amount);
  });
  const pieData = Object.entries(categoryMap).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2)),
  }));

  // ─── 2. Bar — spending by month ──────────────────────────────────
  const monthMap = {};
  expenses.forEach((e) => {
    const month = e.date.slice(0, 7); // "2026-04"
    monthMap[month] = (monthMap[month] || 0) + parseFloat(e.amount);
  });
  const barData = Object.entries(monthMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, total]) => ({
      month,
      total: parseFloat(total.toFixed(2)),
    }));

  // ─── 3. Line — spending trend over time ──────────────────────────
  const lineData = [...barData]; // same data, different chart type

  if (expenses.length === 0) {
    return (
      <div className="text-center text-gray-400 py-12">
        No expense data to display charts.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Pie Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-bold text-gray-700 mb-6">
          💰 Spending by Category
        </h3>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={110}
              dataKey="value"
              label={({ name, percent }) =>
                `${name} (${(percent * 100).toFixed(0)}%)`
              }
            >
              {pieData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `Rs ${value}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-bold text-gray-700 mb-6">
          📅 Spending by Month
        </h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={barData}
            margin={{ top: 10, right: 20, left: 20, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              tickFormatter={formatMonth}
              tick={{ fontSize: 12 }}
              label={{
                value: "Month",
                position: "insideBottom",
                offset: -25,
                fontSize: 13,
                fill: "#6b7280",
              }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              label={{
                value: "Amount (Rs)",
                angle: -90,
                position: "insideLeft",
                offset: -5,
                fontSize: 13,
                fill: "#6b7280",
              }}
            />
            <Tooltip
              formatter={(value) => [`Rs ${value}`, "Total"]}
              labelFormatter={formatMonth}
            />
            <Bar dataKey="total" fill="#5cc7f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-bold text-gray-700 mb-6">
          📈 Spending Trend
        </h3>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart
            data={lineData}
            margin={{ top: 10, right: 20, left: 20, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              tickFormatter={formatMonth}
              tick={{ fontSize: 12 }}
              label={{
                value: "Month",
                position: "insideBottom",
                offset: -25,
                fontSize: 13,
                fill: "#6b7280",
              }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              label={{
                value: "Amount (Rs)",
                angle: -90,
                position: "insideLeft",
                offset: -5,
                fontSize: 13,
                fill: "#6b7280",
              }}
            />
            <Tooltip
              formatter={(value) => [`Rs ${value}`, "Total"]}
              labelFormatter={formatMonth}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#0a0002"
              strokeWidth={2}
              dot={{ fill: "#0a0002", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ExpenseCharts;
