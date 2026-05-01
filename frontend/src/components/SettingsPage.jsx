// src/components/SettingsPage.jsx
import { useState, useEffect } from "react";
import { getProfile, updateAccountSettings, deleteAccount, changePassword } from "../api/accountApi";
import { useZodForm } from "../hooks/useZodForm";
import { updateProfileSchema, changePasswordSchema, deleteAccountSchema } from "../validation/schemas";
import ConfirmModal from "./modals/ConfirmModal";
import Identicon from "./Identicon";

// ─── Primitives ───────────────────────────────────────────────────────────────

function FieldError({ message }) {
  if (!message) return null;
  return <p style={{ color: "#f87171", fontSize: 12, marginTop: 4, fontFamily: "'Inter', sans-serif" }}>{message}</p>;
}

function StatusBanner({ type, message, onDismiss }) {
  if (!message) return null;
  const ok = type === "success";
  return (
    <div style={{
      fontSize: 13, borderRadius: 10, padding: "10px 14px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      background: ok ? "rgba(5,150,105,0.1)" : "rgba(239,68,68,0.1)",
      border: `1px solid ${ok ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`,
      color: ok ? "#10b981" : "#f87171",
      fontFamily: "'Inter', sans-serif",
    }}>
      <span>{message}</span>
      {onDismiss && <button onClick={onDismiss} style={{ marginLeft: 8, opacity: 0.6, cursor: "pointer", background: "none", border: "none", color: "inherit" }}>✕</button>}
    </div>
  );
}

function Label({ children }) {
  return (
    <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "'Inter', sans-serif" }}>
      {children}
    </label>
  );
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────

function ProfileTab({ profile, onSave }) {
  const [form, setForm] = useState({ displayName: "", phone: "", address: "" });
  const [status, setStatus] = useState(null);
  const { errors, validate, clearFieldError } = useZodForm(updateProfileSchema);

  useEffect(() => {
    if (profile) setForm({ displayName: profile.display_name ?? "", phone: profile.phone ?? "", address: profile.address ?? "" });
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (!validate(form)) return;
    try {
      const res = await updateAccountSettings(form);
      onSave(res.data.data);
      setStatus({ type: "success", message: "Profile updated successfully!" });
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.error ?? "Failed to update profile" });
    }
  };

  return (
    <div style={{ maxWidth: 520 }}>
      {/* Avatar card */}
      <div style={{
        display: "flex", alignItems: "center", gap: 16,
        padding: 16, borderRadius: 16, marginBottom: 28,
        background: "var(--accent-purple-bg)",
        border: "1px solid var(--accent-purple-border)",
      }}>
        <Identicon seed={profile?.email || ""} size={60} className="rounded-xl" style={{ flexShrink: 0 }} />
        <div>
          <p className="font-syne" style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>
            {profile?.display_name || profile?.email?.split("@")[0]}
          </p>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>{profile?.email}</p>
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Avatar auto-generated from your email</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div>
          <Label>Email</Label>
          <input type="email" value={profile?.email ?? ""} disabled className="et-input" />
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Email cannot be changed</p>
        </div>
        <div>
          <Label>Display Name</Label>
          <input type="text" placeholder="Your full name" value={form.displayName}
            onChange={(e) => { setForm((p) => ({ ...p, displayName: e.target.value })); clearFieldError("displayName"); }}
            className={`et-input${errors.displayName ? " error" : ""}`} />
          <FieldError message={errors.displayName} />
        </div>
        <div>
          <Label>Phone</Label>
          <input type="tel" placeholder="+977 98XXXXXXXX" value={form.phone}
            onChange={(e) => { setForm((p) => ({ ...p, phone: e.target.value })); clearFieldError("phone"); }}
            className={`et-input${errors.phone ? " error" : ""}`} />
          <FieldError message={errors.phone} />
        </div>
        <div>
          <Label>Address</Label>
          <textarea placeholder="Your address" value={form.address} rows={3}
            onChange={(e) => { setForm((p) => ({ ...p, address: e.target.value })); clearFieldError("address"); }}
            className={`et-input${errors.address ? " error" : ""}`}
            style={{ resize: "none" }} />
          <FieldError message={errors.address} />
        </div>

        {profile?.created_at && (
          <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
            Member since {new Date(profile.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        )}

        <StatusBanner type={status?.type} message={status?.message} onDismiss={() => setStatus(null)} />

        <div>
          <button type="submit" style={{
            padding: "10px 24px", borderRadius: 10, border: "none",
            background: "linear-gradient(135deg, #7C3AED, #9333ea)",
            color: "white", fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600,
            cursor: "pointer", boxShadow: "0 4px 12px rgba(124,58,237,0.3)",
          }}>
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Password Tab ─────────────────────────────────────────────────────────────

function PasswordTab() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [status, setStatus] = useState(null);
  const { errors, validate, clearFieldError } = useZodForm(changePasswordSchema);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (!validate(form)) return;
    try {
      await changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      setStatus({ type: "success", message: "Password changed successfully!" });
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.error ?? "Failed to change password" });
    }
  };

  const fields = [
    { name: "currentPassword", label: "Current Password", placeholder: "••••••••" },
    { name: "newPassword",     label: "New Password",     placeholder: "Min. 6 characters" },
    { name: "confirmPassword", label: "Confirm New Password", placeholder: "Repeat new password" },
  ];

  return (
    <div style={{ maxWidth: 520 }}>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 24, fontFamily: "'Inter', sans-serif" }}>
        Choose a strong password you don't use elsewhere.
      </p>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {fields.map(({ name, label, placeholder }) => (
          <div key={name}>
            <Label>{label}</Label>
            <input type="password" placeholder={placeholder} value={form[name]}
              onChange={(e) => { setForm((p) => ({ ...p, [name]: e.target.value })); clearFieldError(name); }}
              className={`et-input${errors[name] ? " error" : ""}`} />
            <FieldError message={errors[name]} />
          </div>
        ))}
        <StatusBanner type={status?.type} message={status?.message} onDismiss={() => setStatus(null)} />
        <div>
          <button type="submit" style={{
            padding: "10px 24px", borderRadius: 10, border: "none",
            background: "linear-gradient(135deg, #7C3AED, #9333ea)",
            color: "white", fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600,
            cursor: "pointer", boxShadow: "0 4px 12px rgba(124,58,237,0.3)",
          }}>
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Developer Tab ────────────────────────────────────────────────────────────

function DeveloperTab({ user }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(String(user?.id ?? ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const rows = [
    { label: "User ID",         value: String(user?.id || "—"), copyable: true },
    { label: "Email",           value: user?.email || "—" },
    { label: "Account Created", value: user?.created_at ? new Date(user.created_at).toISOString() : "—" },
  ];

  return (
    <div style={{ maxWidth: 520, display: "flex", flexDirection: "column", gap: 12 }}>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "'Inter', sans-serif" }}>Technical details about your account.</p>
      {rows.map((row) => (
        <div key={row.label} style={{
          padding: 16, borderRadius: 12,
          background: "var(--bg-surface)",
          border: "1px solid var(--border-default)",
          boxShadow: "var(--card-shadow)",
        }}>
          <p style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6, fontFamily: "'Inter', sans-serif" }}>{row.label}</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <code style={{ fontSize: 13, fontFamily: "monospace", color: "var(--text-primary)", wordBreak: "break-all" }}>{row.value}</code>
            {row.copyable && (
              <button onClick={handleCopy} style={{
                fontSize: 11, padding: "4px 10px", borderRadius: 6, cursor: "pointer",
                background: "var(--accent-purple-bg)", border: "1px solid var(--accent-purple-border)",
                color: "var(--accent-purple)", fontFamily: "'Inter', sans-serif", flexShrink: 0,
              }}>
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
          </div>
        </div>
      ))}
      <div style={{
        padding: 16, borderRadius: 12, fontSize: 13, color: "var(--text-muted)",
        background: "var(--bg-surface)", border: "1px dashed var(--border-default)",
        fontFamily: "'Inter', sans-serif",
      }}>
        🔑 API key management and webhook settings coming in a future update.
      </div>
    </div>
  );
}

// ─── Integrations Tab ─────────────────────────────────────────────────────────

function IntegrationsTab() {
  const integrations = [
    { name: "Splitwise",     icon: "🤝", desc: "Sync shared expenses and group bills automatically", accentColor: "16,185,129" },
    { name: "Bank Import",   icon: "🏦", desc: "Import transactions directly from your bank",        accentColor: "59,130,246" },
    { name: "Google Sheets", icon: "📊", desc: "Auto-export your expenses to a spreadsheet",         accentColor: "5,150,105"  },
  ];

  return (
    <div style={{ maxWidth: 520, display: "flex", flexDirection: "column", gap: 12 }}>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "'Inter', sans-serif" }}>
        Connect third-party apps to power up your expense tracking.
      </p>
      {integrations.map((item) => (
        <div key={item.name} style={{
          padding: 16, borderRadius: 14,
          display: "flex", alignItems: "center", gap: 14,
          background: "var(--bg-surface)", border: "1px solid var(--border-default)",
          boxShadow: "var(--card-shadow)",
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, flexShrink: 0,
            background: `rgba(${item.accentColor},0.1)`,
            border: `1px solid rgba(${item.accentColor},0.2)`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
          }}>{item.icon}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", fontFamily: "'Syne', sans-serif" }}>{item.name}</p>
              <span style={{
                fontSize: 11, padding: "2px 8px", borderRadius: 999,
                background: "rgba(245,158,11,0.12)", color: "#f59e0b",
                border: "1px solid rgba(245,158,11,0.2)", fontFamily: "'Inter', sans-serif",
              }}>Soon</span>
            </div>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", fontFamily: "'Inter', sans-serif" }}>{item.desc}</p>
          </div>
          <button disabled style={{
            fontSize: 12, padding: "6px 14px", borderRadius: 8,
            background: "var(--bg-surface)", border: "1px solid var(--border-default)",
            color: "var(--text-muted)", cursor: "not-allowed", fontFamily: "'Inter', sans-serif",
          }}>Connect</button>
        </div>
      ))}
    </div>
  );
}

// ─── Danger Tab ───────────────────────────────────────────────────────────────

function DangerTab({ onAccountDeleted }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(null);
  const { errors, validate, clearFieldError } = useZodForm(deleteAccountSchema);

  const handleDelete = async () => {
    try {
      await deleteAccount({ password });
      onAccountDeleted();
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.error ?? "Failed to delete account" });
      setShowConfirm(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{
        padding: 16, borderRadius: 12,
        background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
      }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#f87171", marginBottom: 6, fontFamily: "'Syne', sans-serif" }}>⚠️ Delete Account</p>
        <p style={{ fontSize: 13, color: "rgba(248,113,113,0.8)", fontFamily: "'Inter', sans-serif", lineHeight: 1.5 }}>
          This is permanent and cannot be undone. All your expenses, categories, and budgets will be erased.
        </p>
      </div>

      <div>
        <Label>Enter your password to confirm</Label>
        <input type="password" placeholder="Your current password" value={password}
          onChange={(e) => { setPassword(e.target.value); clearFieldError("password"); }}
          className={`et-input${errors.password ? " error" : ""}`} />
        <FieldError message={errors.password} />
      </div>

      <StatusBanner type={status?.type} message={status?.message} onDismiss={() => setStatus(null)} />

      <div>
        <button
          onClick={() => { if (!validate({ password })) return; setShowConfirm(true); }}
          style={{
            padding: "10px 24px", borderRadius: 10, border: "1px solid rgba(239,68,68,0.4)",
            background: "rgba(239,68,68,0.7)", color: "white",
            fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600,
            cursor: "pointer", boxShadow: "0 4px 12px rgba(239,68,68,0.2)",
          }}
        >
          Delete My Account
        </button>
      </div>

      {showConfirm && (
        <ConfirmModal
          title="Delete Account"
          message="This will permanently delete ALL your data. This cannot be undone."
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const TABS = [
  { id: "profile",      label: "Profile",      icon: "👤" },
  { id: "password",     label: "Password",     icon: "🔐" },
  { id: "developer",    label: "Developer",    icon: "⚙️" },
  { id: "integrations", label: "Integrations", icon: "🔗" },
  { id: "danger",       label: "Danger Zone",  icon: "⚠️" },
];

function SettingsPage({ user, onBack, onProfileSaved, onAccountDeleted, defaultTab = "profile" }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { const res = await getProfile(); setProfile(res.data.data); }
      catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
  }, []);

  const handleProfileSaved = (updated) => {
    setProfile(updated);
    onProfileSaved?.(updated);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-base)", color: "var(--text-primary)", transition: "background 0.25s ease", fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{
        padding: "14px 32px", display: "flex", alignItems: "center", gap: 12,
        borderBottom: "1px solid var(--border-subtle)",
        background: "var(--bg-surface)",
        boxShadow: "var(--card-shadow)",
        transition: "background 0.25s ease",
      }}>
        <button onClick={onBack} style={{
          display: "flex", alignItems: "center", gap: 6,
          fontSize: 13, color: "var(--text-muted)",
          background: "none", border: "none", cursor: "pointer",
          transition: "color 0.15s",
        }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Dashboard
        </button>
        <span style={{ color: "var(--border-default)" }}>/</span>
        <h1 className="font-syne" style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)" }}>Settings</h1>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px", display: "flex", gap: 32 }}>
        {/* Sidebar */}
        <aside style={{ width: 180, flexShrink: 0 }}>
          <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const isDanger = tab.id === "danger";
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  style={{
                    width: "100%", textAlign: "left",
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 12px", borderRadius: 10,
                    fontSize: 13, fontWeight: 500,
                    cursor: "pointer", border: "1px solid transparent",
                    transition: "all 0.15s ease",
                    fontFamily: "'Inter', sans-serif",
                    background: isActive
                      ? (isDanger ? "rgba(239,68,68,0.1)" : "var(--accent-purple-bg)")
                      : "transparent",
                    borderColor: isActive
                      ? (isDanger ? "rgba(239,68,68,0.2)" : "var(--accent-purple-border)")
                      : "transparent",
                    color: isActive
                      ? (isDanger ? "#f87171" : "var(--accent-purple)")
                      : "var(--text-muted)",
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "var(--bg-surface-hover)"; e.currentTarget.style.color = "var(--text-primary)"; } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; } }}
                >
                  <span>{tab.icon}</span>{tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <main style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            borderRadius: 16, padding: 24,
            background: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
            boxShadow: "var(--card-shadow)",
            transition: "background 0.25s ease",
          }}>
            {loading ? (
              <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--text-muted)", padding: "32px 0" }}>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%",
                  border: "2px solid var(--accent-purple-border)",
                  borderTopColor: "var(--accent-purple)",
                  animation: "spin 0.8s linear infinite",
                }} />
                Loading…
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : (
              <>
                <h2 className="font-syne" style={{ fontSize: 17, fontWeight: 600, color: "var(--text-primary)", marginBottom: 24 }}>
                  {TABS.find((t) => t.id === activeTab)?.icon}{" "}
                  {TABS.find((t) => t.id === activeTab)?.label}
                </h2>
                {activeTab === "profile"      && <ProfileTab profile={profile} onSave={handleProfileSaved} />}
                {activeTab === "password"     && <PasswordTab />}
                {activeTab === "developer"    && <DeveloperTab user={profile || user} />}
                {activeTab === "integrations" && <IntegrationsTab />}
                {activeTab === "danger"       && <DangerTab onAccountDeleted={onAccountDeleted} />}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default SettingsPage;