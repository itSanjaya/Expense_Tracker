// src/components/modals/RegisterModal.jsx
import { useState } from "react";
import { register } from "../../api/authApi";
import { useZodForm } from "../../hooks/useZodForm";
import { registerSchema } from "../../validation/schemas";

function FieldError({ message }) {
  if (!message) return null;
  return <p style={{ color: "#f87171", fontSize: 12, marginTop: 4, fontFamily: "'Inter', sans-serif" }}>{message}</p>;
}

function RegisterModal({ onClose, onRegisterSuccess, onSwitchToLogin }) {
  const [email, setEmail]                     = useState("");
  const [password, setPassword]               = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [apiError, setApiError]               = useState("");
  const [loading, setLoading]                 = useState(false);

  const { errors, validate, clearFieldError } = useZodForm(registerSchema);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!validate({ email, password, confirmPassword })) return;
    setLoading(true);
    try {
      const res = await register({ email, password });
      onRegisterSuccess(res.data.data ?? res.data);
      onClose();
    } catch (err) {
      setApiError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
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
          color: "var(--text-muted)", fontSize: 18, lineHeight: 1, transition: "color 0.15s",
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
          <h2 className="font-syne" style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)" }}>Create an account</h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Free forever. No credit card needed.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <input type="email" placeholder="Email" value={email}
              onChange={(e) => { setEmail(e.target.value); clearFieldError("email"); }}
              className={`et-input${errors.email ? " error" : ""}`} />
            <FieldError message={errors.email} />
          </div>
          <div>
            <input type="password" placeholder="Password (min. 6 characters)" value={password}
              onChange={(e) => { setPassword(e.target.value); clearFieldError("password"); }}
              className={`et-input${errors.password ? " error" : ""}`} />
            <FieldError message={errors.password} />
          </div>
          <div>
            <input type="password" placeholder="Confirm Password" value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); clearFieldError("confirmPassword"); }}
              className={`et-input${errors.confirmPassword ? " error" : ""}`} />
            <FieldError message={errors.confirmPassword} />
          </div>
          {apiError && <p style={{ color: "#f87171", fontSize: 13, textAlign: "center" }}>{apiError}</p>}
          <button type="submit" disabled={loading} className="shimmer-btn"
            style={{ width: "100%", padding: "12px 0", marginTop: 4, opacity: loading ? 0.6 : 1 }}>
            {loading ? "Creating account…" : "Create Account →"}
          </button>
        </form>

        <p style={{ marginTop: 20, fontSize: 13, textAlign: "center", color: "var(--text-muted)" }}>
          Already have an account?{" "}
          <span onClick={onSwitchToLogin} style={{ color: "var(--accent-purple)", cursor: "pointer", fontWeight: 500 }}>
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}

export default RegisterModal;