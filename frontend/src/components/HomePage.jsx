// src/components/HomePage.jsx
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";

// Triggers a CSS fade on the hero title when theme changes instead of
// transitioning the gradient background (which causes a clipping-rect flash).
function useHeroTitleFade(theme) {
  const [fading, setFading] = useState(false);
  const prev = useRef(theme);
  useEffect(() => {
    if (prev.current !== theme) {
      prev.current = theme;
      setFading(true);
      const t = setTimeout(() => setFading(false), 300);
      return () => clearTimeout(t);
    }
  }, [theme]);
  return fading;
}

function FloatingCard({ style, emoji, label, amount, color, delay }) {
  return (
    <div
      className="absolute rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3 select-none"
      style={{
        ...style,
        animation: `float 6s ease-in-out ${delay} infinite`,
        background: "var(--bg-surface)",
        border: "1px solid var(--border-default)",
        boxShadow: "var(--card-shadow)",
        minWidth: 180,
      }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
        style={{ backgroundColor: color + "20" }}
      >
        {emoji}
      </div>
      <div>
        <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{amount}</p>
      </div>
      <div
        className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full"
        style={{ backgroundColor: color + "18", color }}
      >
        Logged
      </div>
    </div>
  );
}

const FEATURES = [
  { icon: "📊", title: "Smart Analytics",  desc: "Visual charts show exactly where your money goes — by category, by month, at a glance.", color: "#7C3AED" },
  { icon: "🎯", title: "Budget Goals",     desc: "Set monthly limits per category. Get color-coded alerts before you overspend.",          color: "#2563EB" },
  { icon: "⚡", title: "Instant Logging",  desc: "Add an expense in seconds. Custom categories, date picker, inline editing.",              color: "#059669" },
  { icon: "🔒", title: "Private & Secure", desc: "Your data is yours. JWT auth, encrypted passwords, zero third-party tracking.",           color: "#D97706" },
  { icon: "📤", title: "CSV Export",       desc: "Download your expenses any time. Works with Excel, Sheets, anywhere.",                    color: "#DC2626" },
  { icon: "🔍", title: "Filter & Search",  desc: "Find any expense instantly by category, date range, or description.",                     color: "#DB2777" },
];

const CARDS = [
  { emoji: "☕", label: "Morning Coffee", amount: "Rs 280",   color: "#D97706", style: { top: "12%", right: "6%" }, delay: "0s"   },
  { emoji: "🛒", label: "Groceries",      amount: "Rs 2,400", color: "#059669", style: { top: "38%", right: "2%" }, delay: "1.5s" },
  { emoji: "🚌", label: "Transport",      amount: "Rs 150",   color: "#2563EB", style: { top: "62%", right: "8%" }, delay: "3s"   },
  { emoji: "🍕", label: "Dinner out",     amount: "Rs 890",   color: "#DC2626", style: { top: "24%", left:  "2%" }, delay: "2s"   },
];

function HomePage({ onOpenLogin }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  const titleFading = useHeroTitleFade(theme);

  return (
    <div
      className="homepage-root"
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-base)",
        color: "var(--text-primary)",
        overflowX: "hidden",
        transition: "background-color 0.25s ease, color 0.25s ease",
      }}
    >
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33%       { transform: translateY(-10px) rotate(0.5deg); }
          66%       { transform: translateY(5px) rotate(-0.5deg); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(124,58,237,0.5); }
          70%  { transform: scale(1);    box-shadow: 0 0 0 18px rgba(124,58,237,0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(124,58,237,0); }
        }
        @keyframes grid-move {
          0%   { transform: translateY(0); }
          100% { transform: translateY(60px); }
        }
        .fade-up   { animation: fadeUp 0.7s ease both; }
        .fade-up-1 { animation: fadeUp 0.7s 0.10s ease both; }
        .fade-up-2 { animation: fadeUp 0.7s 0.20s ease both; }
        .fade-up-3 { animation: fadeUp 0.7s 0.35s ease both; }
        .fade-up-4 { animation: fadeUp 0.7s 0.50s ease both; }
        .homepage-grid-bg {
          background-image:
            linear-gradient(var(--grid-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
          background-size: 60px 60px;
          animation: grid-move 8s linear infinite;
        }
        .feature-card:hover .feature-icon {
          transform: scale(1.15) rotate(-4deg);
        }
        .feature-icon { transition: transform 0.25s ease; }
      `}</style>

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav
        className="homepage-nav"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 32px",
          position: "relative",
          zIndex: 20,
          transition: "background 0.25s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "#7C3AED",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, color: "white",
          }}>Rs</div>
          <span className="font-syne" style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
            ExpenseTracker
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Theme toggle */}
          <button
            onClick={toggle}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 14px", borderRadius: 999,
              border: "1px solid var(--border-default)",
              background: "var(--bg-surface)",
              color: "var(--text-secondary)",
              cursor: "pointer", fontSize: 13,
              fontFamily: "'Inter', sans-serif", fontWeight: 500,
              transition: "all 0.2s ease",
            }}
          >
            <span style={{ fontSize: 15 }}>{isDark ? "☀️" : "🌙"}</span>
            <span>{isDark ? "Light" : "Dark"}</span>
          </button>

          <button
            onClick={onOpenLogin}
            style={{
              fontSize: 13, fontWeight: 500,
              border: "1px solid var(--border-default)",
              padding: "8px 20px", borderRadius: 999,
              background: "transparent",
              color: "var(--text-primary)",
              cursor: "pointer",
              transition: "background 0.2s ease",
              fontFamily: "'Inter', sans-serif",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--bg-surface-hover)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section style={{ position: "relative", minHeight: "92vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", overflow: "hidden" }}>
        {/* Grid */}
        <div className="homepage-grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.7, pointerEvents: "none" }} />

        {/* Glow orbs */}
        <div style={{ position: "absolute", top: "25%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, borderRadius: "50%", background: isDark ? "rgba(124,58,237,0.18)" : "rgba(124,58,237,0.08)", filter: "blur(120px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "33%", left: "25%", width: 300, height: 300, borderRadius: "50%", background: isDark ? "rgba(37,99,235,0.12)" : "rgba(37,99,235,0.06)", filter: "blur(100px)", pointerEvents: "none" }} />

        {/* Floating cards */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }} className="hidden lg:block">
          {CARDS.map((c) => <FloatingCard key={c.label} {...c} />)}
        </div>

        {/* Content */}
        <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: 760, margin: "0 auto" }}>
          <div
            className="fade-up homepage-badge"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.8)",
              border: "1px solid var(--border-default)",
              borderRadius: 999, padding: "6px 16px",
              fontSize: 12, color: "var(--text-secondary)",
              marginBottom: 32,
              backdropFilter: "blur(8px)",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block", animation: "pulse 2s infinite" }} />
            Free to use · No credit card required
          </div>

          <h1
            className={`fade-up-1 font-syne ${isDark ? "hero-title-dark" : "hero-title-light"} ${titleFading ? "hero-title-changing" : ""}`}
            style={{
              fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
              lineHeight: 1.08,
              fontWeight: 800,
              marginBottom: 24,
              /* background and clip are set by the CSS class — NOT here,
                 so React never mutates the background property on re-render */
            }}
          >
            Know where<br />every rupee goes.
          </h1>

          <p
            className="fade-up-2 homepage-body-text font-inter"
            style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.7, color: "var(--text-secondary)" }}
          >
            The expense tracker that's actually satisfying to use. Log, budget, and visualize your spending in seconds.
          </p>

          <div className="fade-up-3" style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <button onClick={onOpenLogin} className="shimmer-btn" style={{ padding: "14px 32px", fontSize: 15 }}>
              Start for free →
            </button>
            <button
              onClick={onOpenLogin}
              style={{
                padding: "14px 32px", borderRadius: 12, fontSize: 15,
                border: "1px solid var(--border-default)",
                background: "transparent",
                color: "var(--text-secondary)",
                cursor: "pointer", fontFamily: "'Inter', sans-serif",
                transition: "background 0.2s, color 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-surface-hover)"; e.currentTarget.style.color = "var(--text-primary)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}
            >
              Sign in
            </button>
          </div>

          <p className="fade-up-4 homepage-scroll-hint font-inter" style={{ marginTop: 32, fontSize: 11, color: "var(--text-muted)" }}>
            Track your spending habits
          </p>
        </div>

        {/* Scroll hint */}
        <div
          className="homepage-scroll-hint"
          style={{
            position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
            color: "var(--text-muted)", fontSize: 11,
            fontFamily: "'Inter', sans-serif",
            animation: "bounce 2s infinite",
          }}
        >
          <span>scroll</span>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────────────── */}
      <section style={{ padding: "96px 24px" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p
              className="homepage-section-label font-inter"
              style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent-purple)", marginBottom: 12 }}
            >
              Everything you need
            </p>
            <h2
              className="homepage-section-heading font-syne"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "var(--text-primary)", marginBottom: 16, lineHeight: 1.15 }}
            >
              Built for real life,<br />not spreadsheets.
            </h2>
            <p
              className="homepage-section-sub font-inter"
              style={{ color: "var(--text-secondary)", maxWidth: 480, margin: "0 auto", lineHeight: 1.6 }}
            >
              No bloat. No complex setup. Just the tools you actually use every day.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="feature-card homepage-feature-card"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-default)",
                  borderRadius: 20, padding: 24,
                  boxShadow: "var(--card-shadow)",
                  cursor: "default",
                  transition: "background 0.2s, border-color 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--bg-surface-hover)"}
                onMouseLeave={e => e.currentTarget.style.background = "var(--bg-surface)"}
              >
                <div
                  className="feature-icon"
                  style={{
                    width: 48, height: 48, borderRadius: 14,
                    background: f.color + "18",
                    border: `1px solid ${f.color}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22, marginBottom: 16,
                  }}
                >
                  {f.icon}
                </div>
                <h3 className="font-syne" style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
                  {f.title}
                </h3>
                <p className="font-inter" style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section style={{ padding: "0 24px 96px" }}>
        <div style={{ maxWidth: 896, margin: "0 auto" }}>
          <div
            style={{
              borderRadius: 28, padding: "64px 48px",
              textAlign: "center", position: "relative", overflow: "hidden",
              background: "linear-gradient(135deg, rgba(124,58,237,0.18) 0%, rgba(37,99,235,0.12) 100%)",
              border: "1px solid rgba(124,58,237,0.28)",
              boxShadow: "0 0 60px rgba(124,58,237,0.18), 0 0 120px rgba(124,58,237,0.08)",
            }}
          >
            <div style={{ position: "absolute", top: -80, right: -80, width: 256, height: 256, borderRadius: "50%", background: "rgba(124,58,237,0.15)", filter: "blur(80px)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -80, left: -80, width: 256, height: 256, borderRadius: "50%", background: "rgba(37,99,235,0.12)", filter: "blur(80px)", pointerEvents: "none" }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{
                display: "inline-flex", width: 64, height: 64, borderRadius: 18,
                alignItems: "center", justifyContent: "center", fontSize: 28,
                background: "rgba(124,58,237,0.3)", marginBottom: 24,
                animation: "pulse-ring 2s ease infinite",
              }}>💸</div>
              <h2 className="font-syne" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", fontWeight: 800, color: "white", marginBottom: 16, lineHeight: 1.2 }}>
                Ready to take control?
              </h2>
              <p className="font-inter" style={{ color: "rgba(255,255,255,0.65)", marginBottom: 32, maxWidth: 400, margin: "0 auto 32px", lineHeight: 1.6 }}>
                Create your free account in under 30 seconds. No forms, no fuss.
              </p>
              <button onClick={onOpenLogin} className="shimmer-btn" style={{ padding: "16px 40px", fontSize: 15 }}>
                Create free account →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer
        className="homepage-footer"
        style={{
          padding: "28px 32px",
          borderTop: "1px solid var(--border-subtle)",
          display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12,
          background: "var(--bg-surface)",
          transition: "background 0.25s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "white" }}>Rs</div>
          <span className="font-syne" style={{ fontSize: 13, color: "var(--text-muted)" }}>ExpenseTracker</span>
        </div>
        <p className="font-inter" style={{ fontSize: 12, color: "var(--text-muted)" }}>Built with Node.js · React · PostgreSQL</p>
        <p className="font-inter" style={{ fontSize: 12, color: "var(--text-muted)" }}>© {new Date().getFullYear()} ExpenseTracker. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;