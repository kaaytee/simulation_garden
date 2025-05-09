import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Toast({ message, type = "info", duration = 2000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const bgColor = {
    info: "bg-[#5C5470]",
    success: "bg-green-600",
    error: "bg-red-600",
  }[type];

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg text-[#FAF0E6] text-sm font-medium transition-all duration-300 transform translate-x-0",
        bgColor
      )}
      style={{
        animation: "slideIn 0.3s ease-out",
      }}
    >
      {message}
    </div>
  );
}

export function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
} 