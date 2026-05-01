// src/components/Navbar.jsx
import { useState, useRef, useEffect } from "react";
import Identicon from "./Identicon";
import { useTheme } from "../context/ThemeContext";

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 12px",
        borderRadius: 999,
        border: "1px solid var(--border-default)",
        background: "var(--bg-surface)",
        color: "var(--text-secondary)",
        cursor: "pointer",
        fontSize: 13,
        fontFamily: "'Inter', sans-serif",
        fontWeight: 500,
        transition: "all 0.2s ease",
      }}
    >
      <span style={{ fontSize: 15 }}>{isDark ? "☀️" : "🌙"}</span>
      <span>{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}

function Navbar({ user, onLogout, onNavigate }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const menuItems = [
    { label: "Profile", icon: "👤", page: "settings" },
    // { label: "Developer Settings", icon: "⚙️", page: "developer" },
    // { label: "Account Settings", icon: "🔧", page: "settings" },
  ];

  return (
    <nav
      style={{
        position: "relative",
        zIndex: 40,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 32px",
        background: "var(--bg-nav)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border-subtle)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Logo */}
      <button
        onClick={() => onNavigate("dashboard")}
        style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", background: "none", border: "none" }}
      >
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: "#7C3AED",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 700, color: "white",
        }}>Rs</div>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
          ExpenseTracker
        </span>
      </button>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <ThemeToggle />

        {/* User dropdown */}
        <div style={{ position: "relative" }} ref={ref}>
          <button
            onClick={() => setOpen((p) => !p)}
            style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", background: "none", border: "none" }}
          >
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }} className="hidden sm:block">
              {user?.display_name || user?.email?.split("@")[0]}
            </span>
            <Identicon seed={user?.email || String(user?.id)} size={34} className="rounded-full" />
            <svg
              style={{ width: 14, height: 14, color: "var(--text-muted)", transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {open && (
            <div style={{
              position: "absolute", right: 0, top: "calc(100% + 8px)",
              width: 220, borderRadius: 14, overflow: "hidden", padding: "4px 0",
              background: "var(--bg-dropdown)",
              border: "1px solid var(--border-default)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}>
              {/* User info */}
              <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: 10 }}>
                <Identicon seed={user?.email || String(user?.id)} size={26} />
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user?.display_name || user?.email?.split("@")[0]}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email}</p>
                </div>
              </div>

              {menuItems.map((item) => (
                <button key={item.label} onClick={() => { setOpen(false); onNavigate(item.page); }}
                  style={{
                    width: "100%", textAlign: "left", padding: "10px 16px",
                    fontSize: 13, color: "var(--text-secondary)",
                    display: "flex", alignItems: "center", gap: 10,
                    cursor: "pointer", background: "none", border: "none",
                    transition: "background 0.15s, color 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-surface-hover)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                >
                  <span>{item.icon}</span>{item.label}
                </button>
              ))}

              <div style={{ borderTop: "1px solid var(--border-subtle)", marginTop: 4 }} />
              <button onClick={() => { setOpen(false); onLogout(); }}
                style={{
                  width: "100%", textAlign: "left", padding: "10px 16px",
                  fontSize: 13, color: "#f87171",
                  display: "flex", alignItems: "center", gap: 10,
                  cursor: "pointer", background: "none", border: "none",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                onMouseLeave={e => e.currentTarget.style.background = "none"}
              >
                <span>🚪</span>Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;