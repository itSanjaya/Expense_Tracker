function HomePage({ onOpenLogin }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
        <h1 className="text-xl font-bold text-purple-600">
          Expense Tracker
        </h1>

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
          Track, manage and analyze your spending in one place
        </p>

        <button
          onClick={onOpenLogin}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 cursor-pointer"
        >
          Get Started
        </button>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto mt-20 px-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
          <h3 className="font-semibold text-lg mb-2">💰 Track Expenses</h3>
          <p className="text-gray-600 text-sm">
            Log your daily expenses easily
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
          <h3 className="font-semibold text-lg mb-2">
            🗂️ Manage Categories
          </h3>
          <p className="text-gray-600 text-sm">
            Organize spending by category
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
          <h3 className="font-semibold text-lg mb-2">
            🔍 Filter & Search
          </h3>
          <p className="text-gray-600 text-sm">
            Find any expense instantly
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
          <h3 className="font-semibold text-lg mb-2">
            🔒 Secure & Private
          </h3>
          <p className="text-gray-600 text-sm">
            Your data stays yours
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;