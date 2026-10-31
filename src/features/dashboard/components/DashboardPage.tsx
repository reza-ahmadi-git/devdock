import {
  BookOpenCheck,
  CalendarClock,
  CheckCheck,
  CircleDot,
  FolderKanban,
  ListTodo,
  Plus,
  Sparkles,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router";
import { useShallow } from "zustand/react/shallow";
import { selectDashboardData } from "../../../shared/store/dashboard.selectors";
import { useWorkspaceStore } from "../../../shared/store/store";
import { selectWorkspaceData } from "../../../shared/store/workspace.selectors";
import {
  DashboardActivitySection,
  DashboardProjectProgressSection,
  DashboardQuickLinksSection,
  DashboardUpcomingSection,
} from "./DashboardSections";
import {
  dashboardContentItemVariants,
  dashboardStaggeredContent,
} from "../animations/dashboard.variants";
import { StatCard } from "./StatCard";

export function DashboardPage() {
  const workspace = useWorkspaceStore(useShallow(selectWorkspaceData));
  const { learningGoals } = workspace;
  const shouldReduceMotion = useReducedMotion();
  const {
    isEmpty,
    activeProjectCount,
    projectCount,
    openTasks,
    completedTasks,
    dueSoonTasks,
    recentActivities,
    projectProgress,
    upcomingTasks,
  } = selectDashboardData(workspace);

  const stats = [
    {
      label: "Active projects",
      value: String(activeProjectCount),
      detail: `${projectCount} total project${projectCount === 1 ? "" : "s"}`,
      icon: FolderKanban,
      to: "/projects?status=In%20Progress",
    },
    {
      label: "Open tasks",
      value: String(openTasks.length),
      detail: "Tasks still to do",
      icon: CircleDot,
      to: "/tasks?status=Open",
    },
    {
      label: "Completed tasks",
      value: String(completedTasks.length),
      detail: "A little progress adds up",
      icon: CheckCheck,
      to: "/tasks?status=Completed",
    },
    {
      label: "Due in next 7 days",
      value: String(dueSoonTasks.length),
      detail: "Upcoming open tasks",
      icon: CalendarClock,
      to: "/tasks?due=week",
    },
  ];

  const motionProps = shouldReduceMotion
    ? { initial: false as const }
    : { initial: "hidden" as const, animate: "visible" as const };

  return (
    <motion.div
      animate={motionProps.initial === false ? undefined : motionProps.animate}
      className="space-y-8"
      initial={motionProps.initial === false ? undefined : motionProps.initial}
      variants={dashboardStaggeredContent}
    >
      <motion.section
        className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
        variants={dashboardContentItemVariants}
      >
        <div>
          <p className="mb-2 flex items-center gap-2 text-sm font-medium text-accent">
            <Sparkles aria-hidden="true" size={16} />
            Your developer workspace
          </p>
          <h2 className="page-title">
            {isEmpty
              ? "Your workspace starts here."
              : "A clear view of your progress."}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            {isEmpty
              ? "Bring your projects, tasks, and learning goals together in one place."
              : "Keep your projects moving, stay on top of tasks, and make time for learning."}
          </p>
        </div>
        <Link className="primary-button shrink-0" to="/projects">
          <Plus aria-hidden="true" size={18} />
          New project
        </Link>
      </motion.section>

      {isEmpty && (
        <motion.section
          className="content-card"
          variants={dashboardContentItemVariants}
        >
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center">
            <div className="flex min-w-0 items-start gap-3 xl:flex-1">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <Sparkles aria-hidden="true" size={22} />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold text-foreground">
                  Make your first move
                </h3>
                <p className="mt-1 text-sm leading-6 text-muted">
                  Add a project, capture a task, or choose a skill to learn.
                  Your overview will grow with you.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 xl:shrink-0">
              <Link className="primary-button" to="/projects">
                <Plus aria-hidden="true" size={16} />
                Add project
              </Link>
              <Link className="secondary-button" to="/tasks">
                <ListTodo aria-hidden="true" size={16} />
                Add task
              </Link>
              <Link className="secondary-button" to="/learning">
                <BookOpenCheck aria-hidden="true" size={16} />
                Add learning goal
              </Link>
            </div>
          </div>
        </motion.section>
      )}

      <motion.section
        aria-label="Workspace statistics"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        variants={dashboardStaggeredContent}
      >
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={dashboardContentItemVariants}>
            <StatCard {...stat} />
          </motion.div>
        ))}
      </motion.section>

      <motion.section
        className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
        variants={dashboardStaggeredContent}
      >
        <DashboardActivitySection activities={recentActivities} />
        <DashboardProjectProgressSection items={projectProgress} />
      </motion.section>

      <motion.section
        className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
        variants={dashboardStaggeredContent}
      >
        <DashboardUpcomingSection
          dueSoonCount={dueSoonTasks.length}
          tasks={upcomingTasks}
        />
        <DashboardQuickLinksSection learningGoalCount={learningGoals.length} />
      </motion.section>
    </motion.div>
  );
}
