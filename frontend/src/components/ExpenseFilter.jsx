function ExpenseFilter({ filters, categories, onFilterChange, onClearFilters }) {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <h2 className="font-syne" style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 14 }}>
        Filter
      </h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
        <select
          value={filters.category_id}
          onChange={(e) => onFilterChange({ ...filters, category_id: e.target.value })}
          className="et-input"
          style={{ width: "auto", cursor: "pointer" }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => onFilterChange({ ...filters, startDate: e.target.value })}
          className="et-input"
          style={{ width: "auto", cursor: "pointer" }}
        />

        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => onFilterChange({ ...filters, endDate: e.target.value })}
          className="et-input"
          style={{ width: "auto", cursor: "pointer" }}
        />

        <button
          onClick={onClearFilters}
          style={{
            padding: "8px 16px", borderRadius: 10, cursor: "pointer",
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.22)",
            color: "#f87171", fontSize: 13, fontWeight: 500,
            fontFamily: "'Inter', sans-serif",
            transition: "opacity 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.75"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export default ExpenseFilter;