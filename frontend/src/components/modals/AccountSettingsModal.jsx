// src/components/modals/AccountSettingsModal.jsx
import { useState, useEffect } from "react";
import { getProfile, updateProfile, changePassword, deleteAccount } from "../../api/accountApi";
import { useZodForm } from "../../hooks/useZodForm";
import { updateProfileSchema, changePasswordSchema, deleteAccountSchema } from "../../validation/schemas";
import ConfirmModal from "./ConfirmModal";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(email, displayName) {
  if (displayName?.trim()) {
    return displayName
      .trim()
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join("");
  }
  return email?.[0]?.toUpperCase() ?? "?";
}

function FieldError({ message }) {
  if (!message) return null;
  return <p className="text-red-500 text-xs mt-1">{message}</p>;
}

function StatusBanner({ type, message }) {
  if (!message) return null;
  const styles =
    type === "success"
      ? "bg-green-50 border border-green-200 text-green-700"
      : "bg-red-50 border border-red-200 text-red-700";
  return <p className={`text-sm rounded-lg px-3 py-2 ${styles}`}>{message}</p>;
}

// ─── Color palette ────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "#7C3AED", "#2563EB", "#059669", "#D97706",
  "#DC2626", "#DB2777", "#0891B2", "#65A30D",
  "#4F46E5", "#EA580C", "#0D9488", "#9333EA",
];

// ─── Tab components ───────────────────────────────────────────────────────────

function ProfileTab({ user, onSave }) {
  const [form, setForm] = useState({
    displayName: user?.display_name ?? "",
    phone: user?.phone ?? "",
    address: user?.address ?? "",
    avatarColor: user?.avatar_color ?? "#7C3AED",
  });
  const [status, setStatus] = useState(null);
  const { errors, validate, clearFieldError } = useZodForm(updateProfileSchema);

  useEffect(() => {
    if (user) {
      setForm({
        displayName: user.display_name ?? "",
        phone: user.phone ?? "",
        address: user.address ?? "",
        avatarColor: user.avatar_color ?? "#7C3AED",
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (!validate(form)) return;
    try {
      const res = await updateProfile(form);
      onSave(res.data.data);
      setStatus({ type: "success", message: "Profile updated successfully!" });
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.error ?? "Failed to update profile" });
    }
  };

  const initials = getInitials(user?.email, form.displayName);

  return (
    <div className="space-y-6">
      {/* Avatar preview */}
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg select-none transition-all duration-300"
          style={{ backgroundColor: form.avatarColor }}
        >
          {initials}
        </div>

        {/* Color picker */}
        <div>
          <p className="text-xs text-gray-500 text-center mb-2">Avatar Color</p>
          <div className="flex flex-wrap gap-2 justify-center max-w-\[220px]\">
            {AVATAR_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setForm((p) => ({ ...p, avatarColor: color }))}
                className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer"
                style={{
                  backgroundColor: color,
                  borderColor: form.avatarColor === color ? "#1f2937" : "transparent",
                  transform: form.avatarColor === color ? "scale(1.15)" : undefined,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email (read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={user?.email ?? ""}
            disabled
            className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 text-gray-500 cursor-not-allowed"
          />
          <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
        </div>

        {/* Display Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
          <input
            type="text"
            placeholder="Your name"
            value={form.displayName}
            onChange={(e) => { setForm((p) => ({ ...p, displayName: e.target.value })); clearFieldError("displayName"); }}
            className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
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
            className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
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
            rows={2}
            onChange={(e) => { setForm((p) => ({ ...p, address: e.target.value })); clearFieldError("address"); }}
            className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 resize-none ${
              errors.address ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-purple-400"
            }`}
          />
          <FieldError message={errors.address} />
        </div>

        <StatusBanner type={status?.type} message={status?.message} />

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 font-medium cursor-pointer transition"
        >
          Save Profile
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

  const field = (name, placeholder) => ({
    value: form[name],
    placeholder,
    type: "password",
    onChange: (e) => { setForm((p) => ({ ...p, [name]: e.target.value })); clearFieldError(name); },
    className: `w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
      errors[name] ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-purple-400"
    }`,
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
        <input {...field("currentPassword", "Enter current password")} />
        <FieldError message={errors.currentPassword} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
        <input {...field("newPassword", "Enter new password")} />
        <FieldError message={errors.newPassword} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
        <input {...field("confirmPassword", "Confirm new password")} />
        <FieldError message={errors.confirmPassword} />
      </div>

      <StatusBanner type={status?.type} message={status?.message} />

      <button
        type="submit"
        className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 font-medium cursor-pointer transition"
      >
        Change Password
      </button>
    </form>
  );
}

function IntegrationsTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Connect third-party apps to enhance your expense tracking.</p>

      {/* Splitwise */}
      <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl flex-shrink-0">
          🤝
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-semibold text-gray-800">Splitwise</p>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
              Coming Soon
            </span>
          </div>
          <p className="text-sm text-gray-500">Sync shared expenses and group bills automatically</p>
        </div>
        <button
          disabled
          className="text-sm border border-gray-200 text-gray-400 px-3 py-1.5 rounded-lg cursor-not-allowed"
        >
          Connect
        </button>
      </div>

      {/* Google Pay placeholder */}
      <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl flex-shrink-0">
          💳
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-semibold text-gray-800">Bank Import</p>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
              Coming Soon
            </span>
          </div>
          <p className="text-sm text-gray-500">Import transactions directly from your bank</p>
        </div>
        <button
          disabled
          className="text-sm border border-gray-200 text-gray-400 px-3 py-1.5 rounded-lg cursor-not-allowed"
        >
          Connect
        </button>
      </div>

      {/* Member since */}
      <div className="border border-dashed border-gray-200 rounded-xl p-4 text-center text-sm text-gray-400">
        More integrations coming in future updates
      </div>
    </div>
  );
}

function DangerTab({ onAccountDeleted }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(null);
  const { errors, validate, clearFieldError } = useZodForm(deleteAccountSchema);

  const handleDelete = async () => {
    setStatus(null);
    if (!validate({ password })) return;
    try {
      await deleteAccount({ password });
      onAccountDeleted();
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.error ?? "Failed to delete account" });
      setShowConfirm(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <h3 className="font-semibold text-red-700 mb-1">⚠️ Danger Zone</h3>
        <p className="text-sm text-red-600">
          Deleting your account is permanent and cannot be undone. All your expenses, categories, and budgets will be permanently removed.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirm with your password
        </label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); clearFieldError("password"); }}
          className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
            errors.password ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-red-300"
          }`}
        />
        <FieldError message={errors.password} />
      </div>

      <StatusBanner type={status?.type} message={status?.message} />

      <button
        type="button"
        onClick={() => {
          if (!validate({ password })) return;
          setShowConfirm(true);
        }}
        className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 font-medium cursor-pointer transition"
      >
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

// ─── Main Modal ───────────────────────────────────────────────────────────────

const TABS = [
  { id: "profile", label: "Profile", icon: "👤" },
  { id: "password", label: "Password", icon: "🔐" },
  { id: "integrations", label: "Integrations", icon: "🔗" },
  { id: "danger", label: "Danger Zone", icon: "⚠️" },
];

function AccountSettingsModal({ onClose, user, onProfileSaved, onAccountDeleted }) {
  const [activeTab, setActiveTab] = useState("profile");
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
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {/* Mini avatar */}
            {profile && (
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                style={{ backgroundColor: profile.avatar_color ?? "#7C3AED" }}
              >
                {getInitials(profile.email, profile.display_name)}
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">Account Settings</h2>
              {profile && (
                <p className="text-xs text-gray-400">{profile.email}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl cursor-pointer leading-none"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? tab.id === "danger"
                    ? "border-red-500 text-red-600"
                    : "border-purple-600 text-purple-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-gray-400">
              <div className="animate-spin w-6 h-6 border-2 border-purple-300 border-t-purple-600 rounded-full mr-3" />
              Loading profile…
            </div>
          ) : (
            <>
              {activeTab === "profile" && (
                <ProfileTab user={profile} onSave={handleProfileSaved} />
              )}
              {activeTab === "password" && <PasswordTab />}
              {activeTab === "integrations" && <IntegrationsTab />}
              {activeTab === "danger" && (
                <DangerTab onAccountDeleted={onAccountDeleted} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AccountSettingsModal;