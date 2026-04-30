// src/hooks/useToast.js
import { useState, useCallback } from "react";

let _id = 0;

/**
 * useToast()
 * Returns { toasts, toast }
 *
 * toast.success("Message")
 * toast.error("Message")
 * toast.info("Message")
 * toast("Message", { type: "success", duration: 4000 })
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, { type = "info", duration = 4000 } = {}) => {
    const id = ++_id;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message, opts) => addToast(message, opts),
    [addToast]
  );

  toast.success = (message, opts) => addToast(message, { type: "success", ...opts });
  toast.error   = (message, opts) => addToast(message, { type: "error",   ...opts });
  toast.info    = (message, opts) => addToast(message, { type: "info",    ...opts });
  toast.warning = (message, opts) => addToast(message, { type: "warning", ...opts });

  return { toasts, toast, dismiss };
}