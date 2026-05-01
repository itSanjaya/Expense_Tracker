// src/components/ToastContainer.jsx
import { useEffect, useState } from "react";

const CONFIG = {
  success: { icon: "✅", bar: "#10b981", bg: "rgba(5,150,105,0.12)",  border: "rgba(16,185,129,0.28)" },
  error:   { icon: "❌", bar: "#ef4444", bg: "rgba(239,68,68,0.12)",  border: "rgba(239,68,68,0.28)"  },
  warning: { icon: "⚠️", bar: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.28)" },
  info:    { icon: "ℹ️", bar: "#3b82f6", bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.28)" },
};

function Toast({ id, message, type = "info", duration = 4000, onDismiss }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const cfg = CONFIG[type] || CONFIG.info;

  useEffect(() => { const t = setTimeout(() => setVisible(true), 10); return () => clearTimeout(t); }, []);

  const dismiss = () => { setLeaving(true); setTimeout(() => onDismiss(id), 280); };
  useEffect(() => { const t = setTimeout(dismiss, duration); return () => clearTimeout(t); }, []);

  return (
    <div
      onClick={dismiss}
      style={{
        position: "relative", overflow: "hidden",
        display: "flex", alignItems: "flex-start", gap: 10,
        padding: "12px 36px 12px 14px",
        minWidth: 280, maxWidth: 360,
        borderRadius: 14,
        background: "var(--bg-modal)",
        border: `1px solid ${cfg.border}`,
        borderLeft: `3px solid ${cfg.bar}`,
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        cursor: "pointer",
        fontFamily: "'Inter', sans-serif",
        transition: "opacity 0.28s ease, transform 0.28s ease",
        opacity: visible && !leaving ? 1 : 0,
        transform: visible && !leaving ? "translateX(0)" : "translateX(16px)",
      }}
    >
      <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>{cfg.icon}</span>
      <p style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 500, lineHeight: 1.45, flex: 1 }}>
        {message}
      </p>
      <button
        onClick={(e) => { e.stopPropagation(); dismiss(); }}
        style={{
          position: "absolute", top: 10, right: 10,
          background: "none", border: "none", cursor: "pointer",
          color: "var(--text-muted)", fontSize: 12, lineHeight: 1,
          transition: "color 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"}
        onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
      >✕</button>

      {/* Progress bar */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "var(--border-subtle)" }}>
        <div style={{ height: "100%", background: cfg.bar, animation: `toast-progress ${duration}ms linear forwards` }} />
      </div>
    </div>
  );
}

function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null;
  return (
    <div style={{
      position: "fixed", top: 16, right: 16, zIndex: 9999,
      display: "flex", flexDirection: "column", gap: 8,
      alignItems: "flex-end", pointerEvents: "none",
    }}>
      {toasts.map((t) => (
        <div key={t.id} style={{ pointerEvents: "auto" }}>
          <Toast {...t} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;