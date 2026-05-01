function ConfirmModal({ title, message, onCancel, onConfirm }) {
  return (
    <div
      onClick={onCancel}
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--bg-overlay)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 400, padding: 24, borderRadius: 20,
          background: "var(--bg-modal)",
          border: "1px solid var(--border-default)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.3)",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div style={{
          width: 48, height: 48, borderRadius: 12, marginBottom: 16,
          background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
        }}>⚠️</div>

        <h2 className="font-syne" style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
          {title || "Confirm Action"}
        </h2>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 24, lineHeight: 1.6 }}>
          {message || "Are you sure you want to continue?"}
        </p>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: "10px 0", borderRadius: 10, fontSize: 13, fontWeight: 500,
            background: "var(--bg-surface-hover)", border: "1px solid var(--border-default)",
            color: "var(--text-secondary)", cursor: "pointer",
            fontFamily: "'Inter', sans-serif", transition: "color 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}
          >Cancel</button>

          <button onClick={onConfirm} style={{
            flex: 1, padding: "10px 0", borderRadius: 10, fontSize: 13, fontWeight: 600,
            background: "rgba(239,68,68,0.75)", border: "1px solid rgba(239,68,68,0.4)",
            color: "white", cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
            boxShadow: "0 4px 12px rgba(239,68,68,0.25)",
          }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;