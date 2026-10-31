import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";

type StatCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  to: string;
};

export function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  to,
}: StatCardProps) {
  return (
    <Link
      aria-label={`${label}: ${value}. ${detail}`}
      className="stat-card group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
      to={to}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted">{label}</p>
        <span className="flex size-9 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent/15">
          <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
        </span>
      </div>
      <div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-3xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
          <ArrowUpRight
            aria-hidden="true"
            className="text-muted opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
            size={17}
          />
        </div>
        <p className="mt-1 text-xs text-muted">{detail}</p>
      </div>
    </Link>
  );
}
