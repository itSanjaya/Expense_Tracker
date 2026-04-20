function ConfirmModal({ title, message, onCancel, onConfirm }) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onCancel}
    >
      {/* Modal card */}
      <div
        className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h2 className="text-xl font-bold text-gray-800 mb-3">
          {title || "Confirm Action"}
        </h2>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          {message || "Are you sure you want to continue?"}
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;