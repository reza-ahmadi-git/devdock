import { Pencil, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import type { Ref } from "react";
import { useStaggerMotion } from "../../../shared/hooks/useStaggerMotion";
import { projectStatusBadgeClasses } from "../../../shared/lib/badgeClasses";
import type { Project, Task } from "../../../shared/types/workspace";

type ProjectCardProps = {
  project: Project;
  tasks: Task[];
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  ref?: Ref<HTMLElement>;
};

export function ProjectCard({
  onDelete,
  onEdit,
  onView,
  project,
  ref,
  tasks,
}: ProjectCardProps) {
  const { itemVariants, shouldReduceMotion } = useStaggerMotion();
  const completedTasks = tasks.filter((task) => task.completed).length;
  const progress = tasks.length
    ? Math.round((completedTasks / tasks.length) * 100)
    : 0;

  return (
    <motion.article
      className="content-card flex cursor-pointer flex-col"
      exit={
        shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.99 }
      }
      layout={!shouldReduceMotion}
      variants={itemVariants}
      transition={{ duration: 0.18, ease: "easeOut" }}
      onClick={onView}
      whileHover={shouldReduceMotion ? undefined : { y: -2 }}
      ref={ref}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className={projectStatusBadgeClasses[project.status]}>
            {project.status}
          </span>
          <h3 className="mt-3 truncate text-base font-semibold text-foreground">
            <button
              className="block max-w-full truncate text-left hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              onClick={(event) => {
                event.stopPropagation();
                onView();
              }}
              type="button"
            >
              {project.name}
            </button>
          </h3>
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            aria-label={`Edit ${project.name}`}
            className="icon-button size-9 border-transparent bg-transparent"
            onClick={(event) => {
              event.stopPropagation();
              onEdit();
            }}
            type="button"
          >
            <Pencil aria-hidden="true" size={16} />
          </button>
          <button
            aria-label={`Delete ${project.name}`}
            className="icon-button size-9 border-transparent bg-transparent hover:text-red-700 dark:hover:text-red-400"
            onClick={(event) => {
              event.stopPropagation();
              onDelete();
            }}
            type="button"
          >
            <Trash2 aria-hidden="true" size={16} />
          </button>
        </div>
      </div>
      <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-muted [overflow-wrap:anywhere]">
        {project.description || "No description added."}
      </p>
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-muted">Task progress</span>
          <span className="font-medium text-foreground">
            {completedTasks}/{tasks.length}
          </span>
        </div>
        <div
          aria-label={`${progress}% of project tasks completed`}
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={progress}
          className="h-2 overflow-hidden rounded-full bg-surface-raised"
          role="progressbar"
        >
          <div
            className="h-full rounded-full bg-accent transition-[width]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <p className="mt-5 border-t border-border pt-4 text-xs font-medium text-muted">
        Click to view project details
      </p>
    </motion.article>
  );
}
