function ExpenseFilter({
  filters,
  categories,
  onFilterChange,
  onClearFilters,
}) {
  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Filter Expenses</h2>

      <div className="flex flex-wrap gap-4 items-end">
        {/* Category */}
        <select
          value={filters.category_id}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              category_id: e.target.value,
            })
          }
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer"
        >
          <option value="">All Categories</option>

          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Start Date */}
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              startDate: e.target.value,
            })
          }
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer"
        />

        {/* End Date */}
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              endDate: e.target.value,
            })
          }
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer"
        />

        {/* Clear Button */}
        <button
          onClick={onClearFilters}
          className="border border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-50 cursor-pointer"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export default ExpenseFilter;