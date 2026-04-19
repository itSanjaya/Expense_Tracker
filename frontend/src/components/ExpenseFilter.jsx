function ExpenseFilter({ categories, filters, onFilterChange, onClearFilters }) {
  return (
    <div>
      <h3>Filters</h3>

      <select
        value={filters.category_id}
        onChange={(e) =>
          onFilterChange({ ...filters, category_id: e.target.value })
        }
      >
        <option value="">All Categories</option>

        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={filters.startDate}
        onChange={(e) => onFilterChange({ ...filters, startDate: e.target.value })}
      />

      <input
        type="date"
        value={filters.endDate}
        onChange={(e) => onFilterChange({ ...filters, endDate: e.target.value })}
      />

      <button onClick={onClearFilters}>Clear</button>
    </div>
  );
}

export default ExpenseFilter;
