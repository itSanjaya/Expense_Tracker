// src/components/modals/LoginModal.jsx
import { useState } from "react";
import { login } from "../../api/authApi";
import { useZodForm } from "../../hooks/useZodForm";
import { loginSchema } from "../../validation/schemas";

function FieldError({ message }) {
  if (!message) return null;
  return <p style={{ color: "#f87171", fontSize: 12, marginTop: 4, fontFamily: "'Inter', sans-serif" }}>{message}</p>;
}

function LoginModal({ onClose, onLoginSuccess, onSwitchToRegister }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [apiError, setApiError] = useState("");

  const { errors, validate, clearFieldError } = useZodForm(loginSchema);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!validate({ email, password })) return;
    try {
      const res = await login({ email, password });
      onLoginSuccess(res.data);
      onClose();
    } catch (err) {
      setApiError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 50,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg-overlay)", backdropFilter: "blur(10px)",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: "100%", maxWidth: 440, padding: 36, borderRadius: 24, position: "relative",
        background: "var(--bg-modal)",
        border: "1px solid var(--border-default)",
        boxShadow: "0 40px 80px rgba(0,0,0,0.25)",
        fontFamily: "'Inter', sans-serif",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: 16, right: 16,
          background: "none", border: "none", cursor: "pointer",
          color: "var(--text-muted)", fontSize: 18, lineHeight: 1,
          transition: "color 0.15s",
        }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
        >✕</button>

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, background: "#7C3AED",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 700, color: "white", margin: "0 auto 16px",
          }}>Rs</div>
          <h2 className="font-syne" style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)" }}>Welcome back</h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <input type="email" placeholder="Email" value={email}
              onChange={(e) => { setEmail(e.target.value); clearFieldError("email"); }}
              className={`et-input${errors.email ? " error" : ""}`} />
            <FieldError message={errors.email} />
          </div>
          <div>
            <input type="password" placeholder="Password" value={password}
              onChange={(e) => { setPassword(e.target.value); clearFieldError("password"); }}
              className={`et-input${errors.password ? " error" : ""}`} />
            <FieldError message={errors.password} />
          </div>
          {apiError && <p style={{ color: "#f87171", fontSize: 13, textAlign: "center" }}>{apiError}</p>}
          <button type="submit" className="shimmer-btn" style={{ width: "100%", padding: "12px 0", marginTop: 4 }}>
            Sign In
          </button>
        </form>

        <p style={{ marginTop: 20, fontSize: 13, textAlign: "center", color: "var(--text-muted)" }}>
          Don't have an account?{" "}
          <span onClick={onSwitchToRegister} style={{ color: "var(--accent-purple)", cursor: "pointer", fontWeight: 500 }}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginModal;