import { Menu, Moon, Sun } from "lucide-react";
import type { Theme } from "../../shared/hooks/useTheme";

type TopbarProps = {
  pageTitle: string;
  theme: Theme;
  onMenuClick: () => void;
  onThemeToggle: () => void;
};

export function Topbar({
  pageTitle,
  theme,
  onMenuClick,
  onThemeToggle,
}: TopbarProps) {
  const ThemeIcon = theme === "dark" ? Sun : Moon;
  const themeAction =
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <header className="topbar">
      <div className="flex items-center gap-3">
        <button
          aria-label="Open navigation menu"
          className="icon-button md:hidden"
          onClick={onMenuClick}
          type="button"
        >
          <Menu aria-hidden="true" size={20} />
        </button>
        <div>
          <p className="hidden text-xs font-medium text-muted sm:block">
            Workspace
          </p>
          <h1 className="text-base font-semibold text-foreground sm:mt-0.5 sm:text-lg">
            {pageTitle}
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden text-xs text-muted sm:inline">
          Personal workspace
        </span>
        <button
          aria-label={themeAction}
          className="icon-button"
          onClick={onThemeToggle}
          title={themeAction}
          type="button"
        >
          <ThemeIcon aria-hidden="true" size={18} />
        </button>
        <div
          aria-label="Developer profile"
          className="flex size-10 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-sm font-semibold text-accent"
        >
          D
        </div>
      </div>
    </header>
  );
}
