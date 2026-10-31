import { Suspense, useState } from "react";
import { useLocation, useOutlet } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { PageLoader } from "../../shared/components/PageLoader";
import { useWorkspaceStore } from "../../shared/store/store";
import { useTheme } from "../../shared/hooks/useTheme";
import { ToastViewport } from "../../shared/components/ToastViewport";
import { getPageTitle } from "./navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const storageError = useWorkspaceStore((state) => state.storageError);
  const { pathname } = useLocation();
  const outlet = useOutlet();

  return (
    <div className="app-frame">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="min-h-screen md:pl-sidebar">
        <Topbar
          pageTitle={getPageTitle(pathname)}
          theme={theme}
          onMenuClick={() => setIsSidebarOpen(true)}
          onThemeToggle={toggleTheme}
        />
        <main className="mx-auto w-full max-w-[1440px] px-5 py-7 sm:px-8 sm:py-9">
          {storageError && (
            <div
              className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-warning-foreground"
              role="alert"
            >
              {storageError}
            </div>
          )}
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              initial={{ opacity: 0, y: 6 }}
              key={pathname}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Suspense fallback={<PageLoader />}>{outlet}</Suspense>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <ToastViewport />
    </div>
  );
}
