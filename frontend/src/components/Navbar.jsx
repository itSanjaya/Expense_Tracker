// src/components/Navbar.jsx
import { useState, useRef, useEffect } from "react";
import Identicon from "./Identicon";

function Navbar({ user, onLogout, onNavigate }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const menuItems = [
    { label: "Profile", icon: "👤", page: "settings" },
    { label: "Developer Settings", icon: "⚙️", page: "developer" },
    { label: "Account Settings", icon: "🔧", page: "settings" },
  ];

  return (
    <nav className="bg-purple-600 text-white px-8 py-3 flex justify-between items-center shadow-md relative z-40">
      <button
        onClick={() => onNavigate("dashboard")}
        className="text-2xl font-bold cursor-pointer hover:opacity-90 transition"
      >
        Expense Tracker
      </button>

      {/* User dropdown */}
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((p) => !p)}
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition select-none"
        >
          <span className="text-sm font-medium hidden sm:block">
            {user?.display_name || user?.email?.split("@")[0]}
          </span>
          <Identicon seed={user?.email || String(user?.id)} size={36} className="rounded-full" />
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1 overflow-hidden">
            {/* User info header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
              <Identicon seed={user?.email || String(user?.id)} size={24} />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {user?.display_name || user?.email?.split("@")[0]}
                </p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>

            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setOpen(false);
                  onNavigate(item.page);
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5 cursor-pointer transition-colors"
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}

            <div className="border-t border-gray-100 mt-1" />

            <button
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2.5 cursor-pointer transition-colors"
            >
              <span>🚪</span>
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;