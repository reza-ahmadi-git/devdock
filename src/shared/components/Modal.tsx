import {
  useEffect,
  useId,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { X } from "lucide-react";
import { motion } from "motion/react";

type ModalProps = PropsWithChildren<{
  title: string;
  onClose: () => void;
}>;

let lastOpener: HTMLElement | null = null;

function resolveOpener() {
  const activeElement = document.activeElement;
  if (
    activeElement instanceof HTMLElement &&
    !activeElement.closest('[role="dialog"]')
  ) {
    return activeElement;
  }
  return lastOpener;
}

export function Modal({ children, onClose, title }: ModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const onCloseRef = useRef(onClose);
  const [opener] = useState(resolveOpener);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (opener) lastOpener = opener;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    if (panel && !panel.contains(document.activeElement)) {
      const firstFocusable = panel.querySelector<HTMLElement>(
        "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])",
      );
      (firstFocusable ?? panel).focus();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !panel) return;

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])",
        ),
      ).filter((element) => element.getClientRects().length > 0);
      if (focusable.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!panel.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (opener?.isConnected && !panel?.isConnected) opener.focus();
    };
  }, [opener]);

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      role="presentation"
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <button
        aria-label="Close dialog"
        className="absolute inset-0 size-full cursor-default"
        onClick={onClose}
        tabIndex={-1}
        type="button"
      />
      <motion.section
        animate={{ opacity: 1, scale: 1, y: 0 }}
        aria-labelledby={titleId}
        aria-modal="true"
        className="modal-panel"
        initial={{ opacity: 0, scale: 0.97, y: 6 }}
        ref={panelRef}
        role="dialog"
        tabIndex={-1}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2
            className="min-w-0 whitespace-normal text-lg font-semibold text-foreground [overflow-wrap:anywhere]"
            id={titleId}
          >
            {title}
          </h2>
          <button
            aria-label="Close dialog"
            className="icon-button size-9"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" size={18} />
          </button>
        </div>
        {children}
      </motion.section>
    </motion.div>
  );
}
