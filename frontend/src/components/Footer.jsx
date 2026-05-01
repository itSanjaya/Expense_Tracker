//frontend/src/components/Footer.jsx
function Footer() {
  return (
    <div>
      {/* ── Footer ── */}
      <footer className="py-8 px-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-purple-600 flex items-center justify-center text-xs font-bold">
            Rs
          </div>
          <span className="font-syne text-sm text-gray-500">
            ExpenseTracker
          </span>
        </div>
        <p className="font-inter text-xs text-gray-600">
          Built with Node.js · React · PostgreSQL
        </p>
        {/* ── Copyright ── */}
        <p className="font-inter text-xs text-gray-600">
          &copy; {new Date().getFullYear()} ExpenseTracker. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Footer;
