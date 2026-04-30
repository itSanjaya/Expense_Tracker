// src/components/ToastContainer.jsx
import { useEffect, useState } from "react";

const ICONS = {
  success: "✅",
  error:   "❌",
  warning: "⚠️",
  info:    "ℹ️",
};

const STYLES = {
  success: "bg-white border-l-4 border-green-500",
  error:   "bg-white border-l-4 border-red-500",
  warning: "bg-white border-l-4 border-amber-400",
  info:    "bg-white border-l-4 border-blue-500",
};

const PROGRESS_COLORS = {
  success: "bg-green-500",
  error:   "bg-red-500",
  warning: "bg-amber-400",
  info:    "bg-blue-500",
};

function Toast({ id, message, type = "info", duration = 4000, onDismiss }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  // Slide in
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleDismiss = () => {
    setLeaving(true);
    setTimeout(() => onDismiss(id), 300);
  };

  // Auto-dismiss
  useEffect(() => {
    const t = setTimeout(handleDismiss, duration);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`
        relative flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg min-w-[280px] max-w-[360px]
        transition-all duration-300 ease-out overflow-hidden cursor-pointer
        ${STYLES[type]}
        ${visible && !leaving
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-8"
        }
      `}
      onClick={handleDismiss}
    >
      <span className="text-lg leading-none mt-0.5 flex-shrink-0">{ICONS[type]}</span>

      <p className="text-sm text-gray-800 font-medium leading-snug flex-1 pr-4">
        {message}
      </p>

      <button
        onClick={(e) => { e.stopPropagation(); handleDismiss(); }}
        className="absolute top-2.5 right-2.5 text-gray-400 hover:text-gray-600 text-xs leading-none cursor-pointer"
      >
        ✕
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100">
        <div
          className={`h-full ${PROGRESS_COLORS[type]}`}
          style={{
            animation: `toast-progress ${duration}ms linear forwards`,
          }}
        />
      </div>

      <style>{`
        @keyframes toast-progress {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  );
}

function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <Toast {...t} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;