// src/components/SettingsPage.jsx
import { useState, useEffect } from "react";
import { getProfile, updateAccountSettings, deleteAccount, changePassword} from "../api/accountApi";
import { useZodForm } from "../hooks/useZodForm";
import { updateProfileSchema, changePasswordSchema, deleteAccountSchema } from "../validation/schemas";
import ConfirmModal from "./modals/ConfirmModal";
import Identicon from "./Identicon";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function FieldError({ message }) {
  if (!message) return null;
  return <p className="text-red-500 text-xs mt-1">{message}</p>;
}

function StatusBanner({ type, message, onDismiss }) {
  if (!message) return null;
  const styles =
    type === "success"
      ? "bg-green-50 border border-green-200 text-green-700"
      : "bg-red-50 border border-red-200 text-red-700";
  return (
    <div className={`text-sm rounded-lg px-3 py-2 flex justify-between items-center ${styles}`}>
      <span>{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="ml-2 opacity-60 hover:opacity-100 cursor-pointer">✕</button>
      )}
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

function ProfileTab({ profile, onSave }) {
  const [form, setForm] = useState({
    displayName: "",
    phone: "",
    address: "",
  });
  const [status, setStatus] = useState(null);
  const { errors, validate, clearFieldError } = useZodForm(updateProfileSchema);

  useEffect(() => {
    if (profile) {
      setForm({
        displayName: profile.display_name ?? "",
        phone: profile.phone ?? "",
        address: profile.address ?? "",
      });
    }
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
    <div className="max-w-lg">
      {/* Avatar */}
      <div className="flex items-center gap-5 mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
        <Identicon seed={profile?.email || ""} size={64} className="rounded-xl" />
        <div>
          <p className="font-semibold text-gray-800 text-lg">
            {profile?.display_name || profile?.email?.split("@")[0]}
          </p>
          <p className="text-sm text-gray-500">{profile?.email}</p>
          <p className="text-xs text-gray-400 mt-1">
            Avatar is auto-generated from your email
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email (read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={profile?.email ?? ""}
            disabled
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 text-gray-400 cursor-not-allowed"
          />
          <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
        </div>

        {/* Display Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
          <input
            type="text"
            placeholder="Your full name"
            value={form.displayName}
            onChange={(e) => { setForm((p) => ({ ...p, displayName: e.target.value })); clearFieldError("displayName"); }}
            className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 transition ${
              errors.displayName ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-purple-400"
            }`}
          />
          <FieldError message={errors.displayName} />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            placeholder="+977 98XXXXXXXX"
            value={form.phone}
            onChange={(e) => { setForm((p) => ({ ...p, phone: e.target.value })); clearFieldError("phone"); }}
            className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 transition ${
              errors.phone ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-purple-400"
            }`}
          />
          <FieldError message={errors.phone} />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea
            placeholder="Your address"
            value={form.address}
            rows={3}
            onChange={(e) => { setForm((p) => ({ ...p, address: e.target.value })); clearFieldError("address"); }}
            className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 resize-none transition ${
              errors.address ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-purple-400"
            }`}
          />
          <FieldError message={errors.address} />
        </div>

        {/* Member since */}
        {profile?.created_at && (
          <p className="text-xs text-gray-400">
            Member since {new Date(profile.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        )}

        <StatusBanner type={status?.type} message={status?.message} onDismiss={() => setStatus(null)} />

        <button
          type="submit"
          className="bg-purple-600 text-white px-6 py-2.5 rounded-lg hover:bg-purple-700 font-medium cursor-pointer transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

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

  const inputClass = (name) =>
    `w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 transition ${
      errors[name] ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-purple-400"
    }`;

  return (
    <div className="max-w-lg">
      <p className="text-sm text-gray-500 mb-6">
        Choose a strong password you don't use elsewhere.
      </p>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
          <input type="password" placeholder="••••••••" value={form.currentPassword}
            onChange={(e) => { setForm((p) => ({ ...p, currentPassword: e.target.value })); clearFieldError("currentPassword"); }}
            className={inputClass("currentPassword")} />
          <FieldError message={errors.currentPassword} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input type="password" placeholder="Min. 6 characters" value={form.newPassword}
            onChange={(e) => { setForm((p) => ({ ...p, newPassword: e.target.value })); clearFieldError("newPassword"); }}
            className={inputClass("newPassword")} />
          <FieldError message={errors.newPassword} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
          <input type="password" placeholder="Repeat new password" value={form.confirmPassword}
            onChange={(e) => { setForm((p) => ({ ...p, confirmPassword: e.target.value })); clearFieldError("confirmPassword"); }}
            className={inputClass("confirmPassword")} />
          <FieldError message={errors.confirmPassword} />
        </div>

        <StatusBanner type={status?.type} message={status?.message} onDismiss={() => setStatus(null)} />

        <button type="submit"
          className="bg-purple-600 text-white px-6 py-2.5 rounded-lg hover:bg-purple-700 font-medium cursor-pointer transition">
          Update Password
        </button>
      </form>
    </div>
  );
}

function DeveloperTab({ user }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(user?.id ?? ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-lg space-y-6">
      <p className="text-sm text-gray-500">Technical details about your account.</p>

      <div className="space-y-3">
        <div className="border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">User ID</p>
          <div className="flex items-center justify-between gap-3">
            <code className="text-sm font-mono text-gray-700">{user?.id}</code>
            <button onClick={handleCopy}
              className="text-xs text-purple-600 border border-purple-200 px-2 py-1 rounded hover:bg-purple-50 cursor-pointer transition">
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Email</p>
          <code className="text-sm font-mono text-gray-700">{user?.email}</code>
        </div>

        <div className="border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Account Created</p>
          <code className="text-sm font-mono text-gray-700">
            {user?.created_at ? new Date(user.created_at).toISOString() : "—"}
          </code>
        </div>
      </div>

      {/* API note */}
      <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-4 text-sm text-gray-500">
        🔑 API key management and webhook settings coming in a future update.
      </div>
    </div>
  );
}

function IntegrationsTab() {
  const integrations = [
    { name: "Splitwise", icon: "🤝", desc: "Sync shared expenses and group bills automatically", color: "bg-green-100" },
    { name: "Bank Import", icon: "🏦", desc: "Import transactions directly from your bank", color: "bg-blue-100" },
    { name: "Google Sheets", icon: "📊", desc: "Auto-export your expenses to a spreadsheet", color: "bg-emerald-100" },
  ];

  return (
    <div className="max-w-lg space-y-4">
      <p className="text-sm text-gray-500">Connect third-party apps to power up your expense tracking.</p>
      {integrations.map((i) => (
        <div key={i.name} className="border border-gray-200 rounded-xl p-4 flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl ${i.color} flex items-center justify-center text-2xl flex-shrink-0`}>
            {i.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="font-semibold text-gray-800">{i.name}</p>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Coming Soon</span>
            </div>
            <p className="text-sm text-gray-500">{i.desc}</p>
          </div>
          <button disabled className="text-sm border border-gray-200 text-gray-300 px-3 py-1.5 rounded-lg cursor-not-allowed">
            Connect
          </button>
        </div>
      ))}
    </div>
  );
}

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
    <div className="max-w-lg space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <h3 className="font-semibold text-red-700 mb-1">⚠️ Delete Account</h3>
        <p className="text-sm text-red-600">
          This is permanent and cannot be undone. All your expenses, categories, and budgets will be erased.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Enter your password to confirm
        </label>
        <input type="password" placeholder="Your current password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); clearFieldError("password"); }}
          className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 transition ${
            errors.password ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-red-300"
          }`}
        />
        <FieldError message={errors.password} />
      </div>

      <StatusBanner type={status?.type} message={status?.message} onDismiss={() => setStatus(null)} />

      <button type="button"
        onClick={() => { if (!validate({ password })) return; setShowConfirm(true); }}
        className="bg-red-500 text-white px-6 py-2.5 rounded-lg hover:bg-red-600 font-medium cursor-pointer transition">
        Delete My Account
      </button>

      {showConfirm && (
        <ConfirmModal
          title="Delete Account"
          message="This will permanently delete ALL your data. This cannot be undone. Are you absolutely sure?"
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

// ─── Main Settings Page ───────────────────────────────────────────────────────

const TABS = [
  { id: "profile", label: "Profile", icon: "👤" },
  { id: "password", label: "Password", icon: "🔐" },
  { id: "developer", label: "Developer", icon: "⚙️" },
  { id: "integrations", label: "Integrations", icon: "🔗" },
  { id: "danger", label: "Danger Zone", icon: "⚠️" },
];

function SettingsPage({ user, onBack, onProfileSaved, onAccountDeleted, defaultTab = "profile" }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getProfile();
        setProfile(res.data.data);
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleProfileSaved = (updated) => {
    setProfile(updated);
    onProfileSaved?.(updated);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 cursor-pointer transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Dashboard
        </button>
        <span className="text-gray-300">/</span>
        <h1 className="text-lg font-semibold text-gray-800">Settings</h1>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar tabs */}
        <aside className="w-48 flex-shrink-0">
          <nav className="space-y-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                  activeTab === tab.id
                    ? tab.id === "danger"
                      ? "bg-red-50 text-red-600"
                      : "bg-purple-50 text-purple-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {loading ? (
              <div className="flex items-center gap-3 text-gray-400 py-8">
                <div className="animate-spin w-5 h-5 border-2 border-purple-300 border-t-purple-600 rounded-full" />
                Loading…
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-gray-800 mb-6">
                  {TABS.find((t) => t.id === activeTab)?.icon}{" "}
                  {TABS.find((t) => t.id === activeTab)?.label}
                </h2>

                {activeTab === "profile" && (
                  <ProfileTab profile={profile} onSave={handleProfileSaved} />
                )}
                {activeTab === "password" && <PasswordTab />}
                {activeTab === "developer" && <DeveloperTab user={profile || user} />}
                {activeTab === "integrations" && <IntegrationsTab />}
                {activeTab === "danger" && (
                  <DangerTab onAccountDeleted={onAccountDeleted} />
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default SettingsPage;