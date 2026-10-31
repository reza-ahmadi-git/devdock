import { Code2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { NavLink } from "react-router";
import { navigationItems } from "./navigation";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const [isMobileViewport, setIsMobileViewport] = useState(
    () => window.matchMedia("(max-width: 767px)").matches,
  );

  useEffect(() => {
    const mobileViewport = window.matchMedia("(max-width: 767px)");
    const updateViewport = () => setIsMobileViewport(mobileViewport.matches);
    mobileViewport.addEventListener("change", updateViewport);
    return () => mobileViewport.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !isMobileViewport) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileViewport, isOpen]);

  useEffect(() => {
    if (!isOpen || !isMobileViewport) return;

    openerRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    closeButtonRef.current?.focus();

    return () => {
      if (openerRef.current?.isConnected) openerRef.current.focus();
    };
  }, [isMobileViewport, isOpen]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.button
            animate={{ opacity: 1 }}
            aria-label="Close navigation menu"
            className="mobile-overlay md:hidden"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key="navigation-overlay"
            onClick={onClose}
            type="button"
          />
        )}
      </AnimatePresence>
      <motion.aside
        animate={{ x: isOpen ? 0 : "-100%" }}
        className="sidebar"
        inert={!isOpen && isMobileViewport}
        initial={false}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className="sidebar-brand">
          <div className="brand-mark">
            <Code2 aria-hidden="true" size={22} strokeWidth={2.4} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-base font-bold tracking-tight text-foreground">
              DevDock
            </p>
            <p className="mt-0.5 text-xs text-muted">Developer workspace</p>
          </div>
          <button
            aria-label="Close navigation menu"
            className="icon-button size-9 md:hidden"
            onClick={onClose}
            ref={closeButtonRef}
            type="button"
          >
            <X aria-hidden="true" size={18} />
          </button>
        </div>

        <p className="sidebar-section-label">Workspace</p>
        <nav aria-label="Main navigation" className="space-y-1">
          {navigationItems.map(({ icon: Icon, label, path }) => (
            <NavLink
              end={path === "/"}
              key={path}
              onClick={onClose}
              to={path}
              className={({ isActive }) =>
                `nav-link ${isActive ? "nav-link-active" : ""}`
              }
            >
              <Icon aria-hidden="true" size={19} strokeWidth={1.8} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl border border-border bg-surface-raised p-4">
          <div className="mb-3 flex size-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <Code2 aria-hidden="true" size={18} />
          </div>
          <p className="text-sm font-semibold text-foreground">
            Your space, your pace.
          </p>
          <p className="mt-1 text-xs leading-5 text-muted">
            Keep your projects and learning in one place.
          </p>
        </div>
        <p className="px-2 pt-4 text-[11px] text-muted">
          DevDock · Personal workspace
        </p>
      </motion.aside>
    </>
  );
}
