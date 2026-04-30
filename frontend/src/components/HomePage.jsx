// src/components/HomePage.jsx
import { useEffect, useRef, useState } from "react";

// Animated floating expense card mock
function FloatingCard({ style, emoji, label, amount, color, delay }) {
  return (
    <div
      className="absolute bg-white rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3 select-none"
      style={{
        ...style,
        animation: `float 6s ease-in-out ${delay} infinite`,
        border: "1px solid rgba(255,255,255,0.15)",
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
        <p className="text-xs text-gray-400 leading-none mb-0.5">{label}</p>
        <p className="text-sm font-bold text-gray-800">{amount}</p>
      </div>
      <div
        className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full"
        style={{ backgroundColor: color + "15", color }}
      >
        Logged
      </div>
    </div>
  );
}

// Animated counter
function Counter({ target, prefix = "", suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const duration = 1800;
          const step = (target / duration) * 16;
          const timer = setInterval(() => {
            start += step;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

const FEATURES = [
  {
    icon: "📊",
    title: "Smart Analytics",
    desc: "Visual charts show exactly where your money goes — by category, by month, at a glance.",
    color: "#7C3AED",
  },
  {
    icon: "🎯",
    title: "Budget Goals",
    desc: "Set monthly limits per category. Get color-coded alerts before you overspend.",
    color: "#2563EB",
  },
  {
    icon: "⚡",
    title: "Instant Logging",
    desc: "Add an expense in seconds. Custom categories, date picker, inline editing.",
    color: "#059669",
  },
  {
    icon: "🔒",
    title: "Private & Secure",
    desc: "Your data is yours. JWT auth, encrypted passwords, zero third-party tracking.",
    color: "#D97706",
  },
  {
    icon: "📤",
    title: "CSV Export",
    desc: "Download your expenses any time. Works with Excel, Sheets, anywhere.",
    color: "#DC2626",
  },
  {
    icon: "🔍",
    title: "Filter & Search",
    desc: "Find any expense instantly by category, date range, or description.",
    color: "#DB2777",
  },
];

const CARDS = [
  { emoji: "☕", label: "Morning Coffee", amount: "Rs 280", color: "#D97706", style: { top: "12%", right: "6%" }, delay: "0s" },
  { emoji: "🛒", label: "Groceries", amount: "Rs 2,400", color: "#059669", style: { top: "38%", right: "2%" }, delay: "1.5s" },
  { emoji: "🚌", label: "Transport", amount: "Rs 150", color: "#2563EB", style: { top: "62%", right: "8%" }, delay: "3s" },
  { emoji: "🍕", label: "Dinner out", amount: "Rs 890", color: "#DC2626", style: { top: "24%", left: "2%" }, delay: "2s" },
];

function HomePage({ onOpenLogin }) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500&display=swap');

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
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes grid-move {
          0%   { transform: translateY(0); }
          100% { transform: translateY(60px); }
        }

        .font-syne { font-family: 'Syne', sans-serif; }
        .font-inter { font-family: 'Inter', sans-serif; }

        .hero-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          background: linear-gradient(135deg, #fff 30%, #a78bfa 60%, #60a5fa 90%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .shimmer-btn {
          background: linear-gradient(
            90deg,
            #7C3AED 0%,
            #9333ea 30%,
            #a855f7 50%,
            #9333ea 70%,
            #7C3AED 100%
          );
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }

        .fade-up { animation: fadeUp 0.7s ease both; }
        .fade-up-1 { animation: fadeUp 0.7s 0.1s ease both; }
        .fade-up-2 { animation: fadeUp 0.7s 0.2s ease both; }
        .fade-up-3 { animation: fadeUp 0.7s 0.35s ease both; }
        .fade-up-4 { animation: fadeUp 0.7s 0.5s ease both; }

        .grid-bg {
          background-image:
            linear-gradient(rgba(124,58,237,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,58,237,0.07) 1px, transparent 1px);
          background-size: 60px 60px;
          animation: grid-move 8s linear infinite;
        }

        .feature-card:hover .feature-icon {
          transform: scale(1.15) rotate(-4deg);
          transition: transform 0.25s ease;
        }
        .feature-icon { transition: transform 0.25s ease; }

        .glow-purple {
          box-shadow: 0 0 60px rgba(124,58,237,0.25), 0 0 120px rgba(124,58,237,0.1);
        }
      `}</style>

      {/* ── Navbar ── */}
      <nav className="flex justify-between items-center px-8 py-5 relative z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-sm font-bold">Rs</div>
          <span className="font-syne font-700 text-lg tracking-tight">ExpenseTracker</span>
        </div>
        <button
          onClick={onOpenLogin}
          className="text-sm font-medium border border-white/20 px-5 py-2 rounded-full hover:bg-white/10 transition cursor-pointer backdrop-blur-sm"
        >
          Sign In
        </button>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Animated grid bg */}
        <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />

        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-purple-700/20 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-blue-700/15 blur-[100px] pointer-events-none" />

        {/* Floating cards */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block">
          {CARDS.map((c) => (
            <FloatingCard key={c.label} {...c} />
          ))}
        </div>

        {/* Hero content */}
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <div className="fade-up inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs text-purple-300 mb-8 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Free to use · No credit card required
          </div>

          <h1 className="hero-title fade-up-1 text-5xl md:text-7xl leading-[1.08] mb-6">
            Know where<br />every rupee goes.
          </h1>

          <p className="fade-up-2 font-inter text-gray-400 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            The expense tracker that's actually satisfying to use. Log, budget, and visualize your spending in seconds.
          </p>

          <div className="fade-up-3 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onOpenLogin}
              className="shimmer-btn text-white font-semibold px-8 py-3.5 rounded-xl cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-900/40"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Start for free →
            </button>
            <button
              onClick={onOpenLogin}
              className="font-inter text-gray-300 border border-white/15 px-8 py-3.5 rounded-xl hover:bg-white/5 transition cursor-pointer"
            >
              Sign in
            </button>
          </div>

          {/* Social proof */}
          <p className="fade-up-4 mt-8 text-xs text-gray-600 font-inter">
            Track your spending habits
          </p>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 text-xs font-inter animate-bounce">
          <span>scroll</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </div>
      </section>

      {/* ── Stats ── */}
      {/* <section className="py-16 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
          {[
            { value: 12000, suffix: "+", label: "Expenses tracked" },
            { value: 98,    suffix: "%", label: "Uptime" },
            { value: 100,   suffix: "%", label: "Free to use" },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-syne text-4xl font-800 text-white mb-1">
                <Counter target={s.value} suffix={s.suffix} />
              </div>
              <p className="font-inter text-gray-500 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section> */}

      {/* ── Features ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-inter text-purple-400 text-sm mb-3 tracking-widest uppercase">Everything you need</p>
            <h2 className="font-syne text-4xl md:text-5xl font-800 text-white mb-4">
              Built for real life,<br />not spreadsheets.
            </h2>
            <p className="font-inter text-gray-500 max-w-xl mx-auto">
              No bloat. No complex setup. Just the tools you actually use every day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="feature-card group bg-white/[0.03] border border-white/8 rounded-2xl p-6 hover:bg-white/[0.06] hover:border-white/15 transition-all duration-300 cursor-default"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div
                  className="feature-icon w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                  style={{ backgroundColor: f.color + "18", border: `1px solid ${f.color}30` }}
                >
                  {f.icon}
                </div>
                <h3 className="font-syne font-700 text-white text-lg mb-2">{f.title}</h3>
                <p className="font-inter text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dashboard preview strip ── */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-3xl p-8 md:p-12 text-center relative overflow-hidden glow-purple"
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(37,99,235,0.15) 100%)",
              border: "1px solid rgba(124,58,237,0.3)",
            }}
          >
            {/* bg decoration */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-purple-600/20 blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-blue-600/20 blur-[80px] pointer-events-none" />

            <div className="relative z-10">
              <div
                className="inline-flex w-16 h-16 rounded-2xl items-center justify-center text-3xl mb-6 mx-auto"
                style={{ backgroundColor: "rgba(124,58,237,0.3)", animation: "pulse-ring 2s ease infinite" }}
              >
                💸
              </div>
              <h2 className="font-syne text-3xl md:text-4xl font-800 text-white mb-4">
                Ready to take control?
              </h2>
              <p className="font-inter text-gray-400 mb-8 max-w-md mx-auto">
                Create your free account in under 30 seconds. No forms, no fuss.
              </p>
              <button
                onClick={onOpenLogin}
                className="shimmer-btn font-inter font-semibold text-white px-10 py-4 rounded-xl cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-xl shadow-purple-900/40"
              >
                Create free account →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 px-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-purple-600 flex items-center justify-center text-xs font-bold">Rs</div>
          <span className="font-syne text-sm text-gray-500">ExpenseTracker</span>
        </div>
        <p className="font-inter text-xs text-gray-600">
          Built with Node.js · React · PostgreSQL
        </p>
        {/* ── Copyright ── */ }
        <p className="font-inter text-xs text-gray-600">
          &copy; {new Date().getFullYear()} ExpenseTracker. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default HomePage;