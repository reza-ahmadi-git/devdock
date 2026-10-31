import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    icon?: LucideIcon;
    label: string;
    onClick: () => void;
    primary?: boolean;
  };
  className?: string;
};

export function EmptyState({
  action,
  className = "empty-state content-card",
  description,
  icon: Icon,
  title,
}: EmptyStateProps) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={className}
      exit={{ opacity: 0, y: -4 }}
      initial={{ opacity: 0, y: 5 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <span className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-accent/10 text-accent">
        <Icon aria-hidden="true" size={21} />
      </span>
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 max-w-sm text-xs leading-5 text-muted">
        {description}
      </p>
      {action && (
        <button
          className={`${action.primary ? "primary-button" : "secondary-button"} mt-4`}
          onClick={action.onClick}
          type="button"
        >
          {action.icon && <action.icon aria-hidden="true" size={17} />}
          {action.label}
        </button>
      )}
    </motion.div>
  );
}
