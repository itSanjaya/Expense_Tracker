// src/components/modals/RegisterModal.jsx
import { useState } from "react";
import { register } from "../../api/authApi";
import { useZodForm } from "../../hooks/useZodForm";
import { registerSchema } from "../../validation/schemas";

function FieldError({ message }) {
  if (!message) return null;
  return <p className="text-red-500 text-xs mt-1">{message}</p>;
}

function RegisterModal({ onClose, onRegisterSuccess, onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [apiError, setApiError] = useState("");

  const { errors, validate, clearFieldError } = useZodForm(registerSchema);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    const ok = validate({ email, password, confirmPassword });
    if (!ok) return;

    try {
      const res = await register({ email, password });
      onRegisterSuccess(res.data);
      onClose();
    } catch (err) {
      setApiError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black cursor-pointer"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearFieldError("email");
              }}
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-purple-400"
              }`}
            />
            <FieldError message={errors.email} />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearFieldError("password");
              }}
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                errors.password
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-purple-400"
              }`}
            />
            <FieldError message={errors.password} />
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                clearFieldError("confirmPassword");
              }}
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                errors.confirmPassword
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-purple-400"
              }`}
            />
            <FieldError message={errors.confirmPassword} />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 cursor-pointer"
          >
            Register
          </button>
        </form>

        {apiError && (
          <p className="text-red-500 text-sm mt-3 text-center">{apiError}</p>
        )}

        <p className="mt-4 text-sm text-center">
          <span className="text-gray-600">Already have an account? </span>
          <span
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:underline cursor-pointer font-medium"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default RegisterModal;