import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useShallow } from "zustand/react/shallow";
import { useWorkspaceStore } from "../store/store";

export function ToastViewport() {
  const { toasts, dismissToast, pauseToast, resumeToast } = useWorkspaceStore(
    useShallow((state) => ({
      toasts: state.toasts,
      dismissToast: state.dismissToast,
      pauseToast: state.pauseToast,
      resumeToast: state.resumeToast,
    })),
  );

  return (
    <div
      aria-label="Notifications"
      aria-live="polite"
      className="toast-viewport"
      role="region"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const isError = toast.variant === "error";
          const Icon = isError ? AlertCircle : CheckCircle2;
          return (
            <motion.div
              animate={{ opacity: 1, x: 0, y: 0 }}
              className={`toast ${isError ? "toast-error" : "toast-success"}`}
              exit={{ opacity: 0, x: 12, scale: 0.98 }}
              initial={{ opacity: 0, x: 12, y: 6 }}
              key={toast.id}
              onBlur={(event) => {
                if (
                  !event.currentTarget.contains(event.relatedTarget) &&
                  !event.currentTarget.matches(":hover")
                ) {
                  resumeToast(toast.id);
                }
              }}
              onFocus={() => pauseToast(toast.id)}
              onMouseEnter={() => pauseToast(toast.id)}
              onMouseLeave={(event) => {
                if (!event.currentTarget.contains(document.activeElement)) {
                  resumeToast(toast.id);
                }
              }}
              role={isError ? "alert" : "status"}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <Icon aria-hidden="true" className="shrink-0" size={18} />
              <p className="min-w-0 flex-1 text-sm">{toast.message}</p>
              <button
                aria-label="Dismiss notification"
                className="ml-1 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100"
                onClick={() => dismissToast(toast.id)}
                type="button"
              >
                <X aria-hidden="true" size={15} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
