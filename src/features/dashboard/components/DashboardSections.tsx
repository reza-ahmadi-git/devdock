import {
  ArrowRight,
  BookOpenCheck,
  CalendarClock,
  CheckCheck,
  CircleDot,
  Clock3,
  FolderKanban,
  Trash2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router";
import { formatDate, formatTimestamp } from "../../../shared/lib/date";
import {
  projectStatusBadgeClasses,
  taskPriorityBadgeClasses,
} from "../../../shared/lib/badgeClasses";
import type {
  ActivityEvent,
  Project,
  Task,
} from "../../../shared/types/workspace";
import { dashboardContentItemVariants } from "../animations/dashboard.variants";

export type ProjectProgressEntry = {
  project: Project;
  completedCount: number;
  taskCount: number;
  progress: number;
};

type DashboardActivitySectionProps = {
  activities: ActivityEvent[];
};

export function DashboardActivitySection({
  activities,
}: DashboardActivitySectionProps) {
  return (
    <motion.div
      className="content-card min-w-0"
      variants={dashboardContentItemVariants}
    >
      <SectionHeading
        description="Milestones across your workspace."
        title="Recent activity"
      />
      {activities.length ? (
        <ul className="min-w-0 divide-y divide-border space-y-2">
          {activities.map((activity) => (
            <motion.li
              key={activity.id}
              variants={dashboardContentItemVariants}
            >
              <ActivityRow activity={activity} />
            </motion.li>
          ))}
        </ul>
      ) : (
        <EmptyPanel
          description="Project updates, completed tasks, and learning milestones will appear here."
          icon={Clock3}
          title="No activity yet"
        />
      )}
    </motion.div>
  );
}

type DashboardProjectProgressSectionProps = {
  items: ProjectProgressEntry[];
};

export function DashboardProjectProgressSection({
  items,
}: DashboardProjectProgressSectionProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;

  return (
    <motion.div
      className="content-card min-w-0"
      variants={dashboardContentItemVariants}
    >
      <SectionHeading
        description="How your projects are moving."
        title="Project progress"
        action={
          items.length > 0
            ? { label: "All projects", to: "/projects" }
            : undefined
        }
      />
      {items.length ? (
        <ul className="min-w-0 divide-y divide-border space-y-2">
          {items.map((item) => (
            <motion.li
              key={item.project.id}
              variants={dashboardContentItemVariants}
            >
              <ProjectProgressItem
                {...item}
                reduceMotion={shouldReduceMotion}
              />
            </motion.li>
          ))}
        </ul>
      ) : (
        <EmptyPanel
          description="Create a project to see its linked task progress here."
          icon={FolderKanban}
          title="No projects to track"
          link={{ label: "Create a project", to: "/projects" }}
        />
      )}
    </motion.div>
  );
}

type DashboardUpcomingSectionProps = {
  dueSoonCount: number;
  tasks: Task[];
};

export function DashboardUpcomingSection({
  dueSoonCount,
  tasks,
}: DashboardUpcomingSectionProps) {
  return (
    <motion.div
      className="content-card min-w-0"
      variants={dashboardContentItemVariants}
    >
      <SectionHeading
        description="Open tasks with a due date coming up."
        title="Coming up"
        action={
          dueSoonCount > 0
            ? { label: "All due soon", to: "/tasks?due=week" }
            : undefined
        }
      />
      {tasks.length ? (
        <ul className="min-w-0 divide-y divide-border space-y-2">
          {tasks.map((task) => (
            <motion.li key={task.id} variants={dashboardContentItemVariants}>
              <UpcomingTaskItem task={task} />
            </motion.li>
          ))}
        </ul>
      ) : (
        <EmptyPanel
          description="Tasks due in the next 7 days will show up here."
          icon={CalendarClock}
          title="Nothing due soon"
          link={{ label: "View all tasks", to: "/tasks" }}
        />
      )}
    </motion.div>
  );
}

type DashboardQuickLinksSectionProps = {
  learningGoalCount: number;
};

export function DashboardQuickLinksSection({
  learningGoalCount,
}: DashboardQuickLinksSectionProps) {
  return (
    <motion.div
      className="content-card min-w-0"
      variants={dashboardContentItemVariants}
    >
      <SectionHeading
        description="A few easy ways to make this space yours."
        title="Quick links"
      />
      <div className="space-y-3">
        <GettingStartedLink
          description="Create a home for the work you care about."
          label="Add your first project"
          to="/projects"
        />
        <GettingStartedLink
          description="Turn your next step into a manageable task."
          label="Plan a task"
          to="/tasks"
        />
        <GettingStartedLink
          description="Choose a skill to focus on next."
          label="Start a learning path"
          to="/learning"
        />
        {learningGoalCount > 0 && (
          <p className="px-1 text-xs text-muted">
            {learningGoalCount} learning goal
            {learningGoalCount === 1 ? "" : "s"} tracked
          </p>
        )}
      </div>
    </motion.div>
  );
}

type SectionHeadingProps = {
  title: string;
  description: string;
  action?: { label: string; to: string };
};

function SectionHeading({ action, description, title }: SectionHeadingProps) {
  return (
    <div className="mb-5 flex min-w-0 items-center justify-between gap-4">
      <div className="min-w-0">
        <h3 className="text-base font-semibold text-foreground [overflow-wrap:anywhere]">
          {title}
        </h3>
        <p className="mt-1 text-sm text-muted [overflow-wrap:anywhere]">
          {description}
        </p>
      </div>
      {action && (
        <Link
          className="shrink-0 text-xs font-medium text-accent transition-colors hover:text-accent-strong"
          to={action.to}
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

type EmptyPanelProps = {
  description: string;
  icon: LucideIcon;
  title: string;
  link?: { label: string; to: string };
};

function EmptyPanel({ description, icon: Icon, link, title }: EmptyPanelProps) {
  return (
    <div className="empty-state">
      <span className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-surface-raised text-muted">
        <Icon aria-hidden="true" size={20} />
      </span>
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 max-w-xs text-xs leading-5 text-muted">
        {description}
      </p>
      {link && (
        <Link
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent"
          to={link.to}
        >
          {link.label}
          <ArrowRight aria-hidden="true" size={14} />
        </Link>
      )}
    </div>
  );
}

type ProjectProgressItemProps = ProjectProgressEntry & {
  reduceMotion: boolean;
};

function ProjectProgressItem({
  project,
  completedCount,
  taskCount,
  progress,
  reduceMotion,
}: ProjectProgressItemProps) {
  return (
    <div className="min-w-0 py-3 first:pt-0 last:pb-0">
      <div className="flex min-w-0 items-center justify-between gap-3">
        <Link
          className="min-w-0 truncate text-sm font-medium text-foreground transition-colors hover:text-accent"
          to={`/projects?project=${encodeURIComponent(project.id)}`}
        >
          {project.name}
        </Link>
        <span
          className={`${projectStatusBadgeClasses[project.status]} shrink-0`}
        >
          {project.status}
        </span>
      </div>
      <div className="mt-1 flex min-h-5 items-center justify-between gap-3">
        <span className="text-xs text-muted">
          {taskCount
            ? `${completedCount}/${taskCount} tasks`
            : "No tasks added yet"}
        </span>
        {project.status === "Completed" && completedCount < taskCount && (
          <span className="text-right text-xs text-muted">
            Project completed with unfinished tasks
          </span>
        )}
      </div>
      <div className="mt-2 flex items-center gap-3">
        <div
          aria-label={`${project.name}: ${progress}% complete`}
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={progress}
          className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-raised"
          role="progressbar"
        >
          <motion.div
            animate={{ width: `${progress}%` }}
            className="h-full rounded-full bg-accent"
            initial={false}
            transition={{ duration: reduceMotion ? 0 : 0.3, ease: "easeOut" }}
          />
        </div>
        <span className="w-9 shrink-0 text-right text-xs text-muted">
          {taskCount ? `${progress}%` : ""}
        </span>
      </div>
    </div>
  );
}

function UpcomingTaskItem({ task }: { task: Task }) {
  return (
    <div className="flex min-w-0 items-center gap-3 py-3 first:pt-0 last:pb-0">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
        <Clock3 aria-hidden="true" size={16} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-foreground">
          {task.title}
        </span>
        <span className="mt-0.5 block text-xs text-muted">
          {formatDate(task.dueDate)}
        </span>
      </span>
      <span className={taskPriorityBadgeClasses[task.priority]}>
        {task.priority}
      </span>
    </div>
  );
}

function ActivityRow({ activity }: { activity: ActivityEvent }) {
  const Icon = activity.type.startsWith("project")
    ? FolderKanban
    : activity.type.startsWith("task")
      ? activity.type === "task_deleted"
        ? Trash2
        : activity.type === "task_completed"
          ? CheckCheck
          : CircleDot
      : activity.type === "learning_deleted"
        ? Trash2
        : activity.type === "learning_completed"
          ? CheckCheck
          : BookOpenCheck;

  return (
    <div className="flex min-w-0 items-center gap-3 py-3 first:pt-0 last:pb-0">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
        <Icon aria-hidden="true" size={16} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-foreground">
          {activity.title}
        </span>
        <span className="mt-0.5 block truncate text-xs text-muted">
          {activity.description}
        </span>
      </span>
      <span className="shrink-0 text-xs text-muted">
        {formatTimestamp(activity.createdAt)}
      </span>
    </div>
  );
}

type GettingStartedLinkProps = {
  description: string;
  label: string;
  to: string;
};

function GettingStartedLink({
  description,
  label,
  to,
}: GettingStartedLinkProps) {
  return (
    <Link
      className="group flex items-center justify-between gap-3 rounded-xl border border-border p-3.5 transition-colors hover:border-accent/40 hover:bg-surface-raised"
      to={to}
    >
      <span className="min-w-0">
        <span className="block text-sm font-medium text-foreground">
          {label}
        </span>
        <span className="mt-0.5 block text-xs leading-5 text-muted">
          {description}
        </span>
      </span>
      <ArrowRight
        aria-hidden="true"
        className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
        size={16}
      />
    </Link>
  );
}
