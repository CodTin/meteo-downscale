"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface ToastProps {
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose: () => void;
  duration?: number;
}

/**
 * Simple Toast Notification Component
 *
 * Displays a temporary notification with an optional action button
 *
 * @example
 * ```tsx
 * <Toast
 *   message="New batch available"
 *   action={{ label: "Update", onClick: handleUpdate }}
 *   onClose={handleClose}
 * />
 * ```
 */
export function Toast({ message, action, onClose, duration = 5000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Allow fade-out animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 bg-neutral-900 text-white px-4 py-3 rounded-lg shadow-lg transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      role="alert"
    >
      <span className="text-sm">{message}</span>
      {action && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            action.onClick();
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="bg-white text-neutral-900 hover:bg-neutral-100"
        >
          {action.label}
        </Button>
      )}
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="ml-2 text-neutral-400 hover:text-white"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
}

/**
 * Toast Container Component
 *
 * Manages multiple toast notifications
 */
interface ToastContainerProps {
  toasts: Array<{
    id: string;
    message: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  }>;
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <>
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{ bottom: `${(index + 1) * 80}px` }}
          className="fixed right-4 z-50"
        >
          <Toast
            message={toast.message}
            action={toast.action}
            onClose={() => onRemove(toast.id)}
          />
        </div>
      ))}
    </>
  );
}
