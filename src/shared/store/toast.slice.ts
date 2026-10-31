import { createId } from "../lib/id";
import type { ToastSlice, WorkspaceSliceCreator } from "./store.types";

const SUCCESS_TOAST_DURATION_MS = 4000;
const ERROR_TOAST_DURATION_MS = 8000;
// Timers stay outside Zustand state so countdown handles never trigger UI subscriptions.
type ToastTimer = {
  timer: ReturnType<typeof setTimeout> | undefined;
  remaining: number;
  startedAt: number;
};
const toastTimers = new Map<string, ToastTimer>();

function clearToastTimer(id: string) {
  const toastTimer = toastTimers.get(id);
  if (toastTimer?.timer !== undefined) clearTimeout(toastTimer.timer);
  toastTimers.delete(id);
}

export const createToastSlice: WorkspaceSliceCreator<ToastSlice> = (
  set,
  get,
) => ({
  toasts: [],

  addToast: (message, variant = "success") => {
    const id = createId();
    const duration =
      variant === "error" ? ERROR_TOAST_DURATION_MS : SUCCESS_TOAST_DURATION_MS;
    set((state) => ({
      toasts: [...state.toasts, { id, message, variant }],
    }));
    const timer = setTimeout(() => {
      get().dismissToast(id);
    }, duration);
    toastTimers.set(id, { timer, remaining: duration, startedAt: Date.now() });
  },

  dismissToast: (id) => {
    clearToastTimer(id);
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  pauseToast: (id) => {
    const toastTimer = toastTimers.get(id);
    if (!toastTimer || toastTimer.timer === undefined) return;
    const elapsed = Date.now() - toastTimer.startedAt;
    toastTimer.remaining = Math.max(0, toastTimer.remaining - elapsed);
    clearTimeout(toastTimer.timer);
    toastTimer.timer = undefined;
  },

  resumeToast: (id) => {
    const toastTimer = toastTimers.get(id);
    if (!toastTimer || toastTimer.timer !== undefined) return;
    const timer = setTimeout(
      () => get().dismissToast(id),
      toastTimer.remaining,
    );
    toastTimer.timer = timer;
    toastTimer.startedAt = Date.now();
  },
});
