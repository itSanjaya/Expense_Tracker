function ExpenseList({ expenses = [] }) {
  return (
    <div>
      <h2>Expenses</h2>

      {expenses.map((exp) => (
        <div key={exp.id}>
          <p>
            {exp.description} - {exp.amount} - {new Date(exp.date).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}

export default ExpenseList;