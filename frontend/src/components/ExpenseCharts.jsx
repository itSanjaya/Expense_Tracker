import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from "recharts";
import { useTheme } from "../context/ThemeContext";

const COLORS = ["#8b5cf6","#3b82f6","#10b981","#f59e0b","#ef4444","#ec4899","#14b8a6","#f97316"];

const formatMonth = (s) => {
  const [y, m] = s.split("-");
  return new Date(y, m - 1).toLocaleString("default", { month: "short", year: "numeric" });
};

function CustomTooltip({ active, payload, label, labelFormatter, isDark }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: isDark ? "rgba(14,14,22,0.97)" : "#ffffff",
      border: "1px solid var(--border-default)",
      borderRadius: 12, padding: "10px 14px",
      fontFamily: "'Inter', sans-serif", fontSize: 13,
      boxShadow: "var(--card-shadow)",
    }}>
      {label && <p style={{ color: "var(--text-muted)", marginBottom: 4 }}>{labelFormatter ? labelFormatter(label) : label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || "var(--accent-purple)", fontWeight: 600 }}>
          Rs {p.value}
        </p>
      ))}
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="card">
      <h3 className="font-syne" style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 24 }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function ExpenseCharts({ expenses }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const gridColor   = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)";
  const axisColor   = "var(--text-muted)";
  const axisStyle   = { fill: isDark ? "#8b8b99" : "#5c6470", fontSize: 12, fontFamily: "'Inter', sans-serif" };

  // Pie data
  const categoryMap = {};
  expenses.forEach((e) => {
    const name = e.category_name || "Uncategorized";
    categoryMap[name] = (categoryMap[name] || 0) + parseFloat(e.amount);
  });
  const pieData = Object.entries(categoryMap).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }));

  // Bar/line data
  const monthMap = {};
  expenses.forEach((e) => {
    const month = e.date.slice(0, 7);
    monthMap[month] = (monthMap[month] || 0) + parseFloat(e.amount);
  });
  const barData = Object.entries(monthMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, total]) => ({ month, total: parseFloat(total.toFixed(2)) }));

  if (expenses.length === 0) {
    return (
      <div className="card" style={{ textAlign: "center", padding: "64px 0" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
        <p style={{ color: "var(--text-muted)", fontSize: 13 }}>No expense data to display yet.</p>
      </div>
    );
  }

  const tooltip = (labelFmt) => <CustomTooltip isDark={isDark} labelFormatter={labelFmt} />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Pie */}
      <ChartCard title="💰 Spending by Category">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              labelLine={{ stroke: gridColor }}>
              {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip content={tooltip(null)} />
            <Legend formatter={(v) => <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>{v}</span>} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Bar */}
      <ChartCard title="📅 Spending by Month">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={barData} margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="month" tickFormatter={formatMonth} tick={axisStyle}
              label={{ value: "Month", position: "insideBottom", offset: -20, fill: isDark ? "#8b8b99" : "#5c6470", fontSize: 12 }} />
            <YAxis tick={axisStyle}
              label={{ value: "Rs", angle: -90, position: "insideLeft", offset: 5, fill: isDark ? "#8b8b99" : "#5c6470", fontSize: 12 }} />
            <Tooltip content={tooltip(formatMonth)} />
            <Bar dataKey="total" fill="#7C3AED" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Line */}
      <ChartCard title="📈 Spending Trend">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={barData} margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="month" tickFormatter={formatMonth} tick={axisStyle}
              label={{ value: "Month", position: "insideBottom", offset: -20, fill: isDark ? "#8b8b99" : "#5c6470", fontSize: 12 }} />
            <YAxis tick={axisStyle}
              label={{ value: "Rs", angle: -90, position: "insideLeft", offset: 5, fill: isDark ? "#8b8b99" : "#5c6470", fontSize: 12 }} />
            <Tooltip content={tooltip(formatMonth)} />
            <Line type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={2.5}
              dot={{ fill: "#8b5cf6", r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#a78bfa" }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

export default ExpenseCharts;