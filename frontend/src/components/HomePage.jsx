function HomePage({ onOpenLogin }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
        <h1 className="text-xl font-bold text-purple-600">Expense Tracker</h1>
        <button
          onClick={onOpenLogin}
          className="text-purple-600 border border-purple-600 px-4 py-1 rounded-lg hover:bg-purple-50 cursor-pointer"
        >
          Login
        </button>
      </nav>

      {/* Hero */}
      <div className="text-center mt-20 px-6">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Take Control of Your Expenses
        </h2>
        <p className="text-gray-600 text-lg mb-8">
          Track spending, set budgets, and understand your finances — all in one place.
        </p>
        <button
          onClick={onOpenLogin}
          className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 cursor-pointer text-lg font-medium"
        >
          Get Started — It's Free
        </button>
      </div>

      {/* Feature Cards */}
      <div className="max-w-6xl mx-auto mt-20 px-6 grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
          <div className="text-3xl mb-3">💸</div>
          <h3 className="font-semibold text-lg mb-2">Track Expenses</h3>
          <p className="text-gray-600 text-sm">
            Log daily expenses with amount, description, date and category.
            Edit or delete any entry at any time.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
          <div className="text-3xl mb-3">🗂️</div>
          <h3 className="font-semibold text-lg mb-2">Organize by Category</h3>
          <p className="text-gray-600 text-sm">
            Create your own categories — Food, Transport, Entertainment and more.
            Filter expenses by category or date range instantly.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
          <div className="text-3xl mb-3">🎯</div>
          <h3 className="font-semibold text-lg mb-2">Set Monthly Budgets</h3>
          <p className="text-gray-600 text-sm">
            Set spending limits per category for any month. Watch progress bars
            turn yellow and red as you approach your limits.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
          <div className="text-3xl mb-3">📊</div>
          <h3 className="font-semibold text-lg mb-2">Spending Summary</h3>
          <p className="text-gray-600 text-sm">
            See your total spent this month, all-time total, number of expenses,
            and your top spending category at a glance.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
          <div className="text-3xl mb-3">⬇️</div>
          <h3 className="font-semibold text-lg mb-2">Export to CSV</h3>
          <p className="text-gray-600 text-sm">
            Download your expenses as a CSV file anytime. Exports respect
            your active filters — export exactly what you see.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
          <div className="text-3xl mb-3">🔒</div>
          <h3 className="font-semibold text-lg mb-2">Secure & Private</h3>
          <p className="text-gray-600 text-sm">
            Your data is protected with JWT authentication. Every expense,
            category and budget belongs only to your account.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
