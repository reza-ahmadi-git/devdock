import { CalendarDays, Check, Pencil, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import type { Ref } from "react";
import { useStaggerMotion } from "../../../shared/hooks/useStaggerMotion";
import { taskPriorityBadgeClasses } from "../../../shared/lib/badgeClasses";
import { formatDate, isOverdue } from "../../../shared/lib/date";
import type { Project, Task } from "../../../shared/types/workspace";

type TaskRowProps = {
  task: Task;
  project?: Project;
  onToggle: () => void;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  ref?: Ref<HTMLElement>;
};

export function TaskRow({
  onDelete,
  onEdit,
  onToggle,
  onView,
  project,
  ref,
  task,
}: TaskRowProps) {
  const { itemVariants, shouldReduceMotion } = useStaggerMotion();
  const overdue = !task.completed && isOverdue(task.dueDate);

  return (
    <motion.article
      className="task-row cursor-pointer"
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -8 }}
      layout={!shouldReduceMotion}
      transition={{ duration: 0.17, ease: "easeOut" }}
      variants={itemVariants}
      onClick={onView}
      ref={ref}
    >
      <button
        aria-label={
          task.completed
            ? `Mark ${task.title} as open`
            : `Complete ${task.title}`
        }
        aria-pressed={task.completed}
        className={`task-checkbox ${task.completed ? "task-checkbox-checked" : ""}`}
        onClick={(event) => {
          event.stopPropagation();
          onToggle();
        }}
        onKeyDown={(event) => event.stopPropagation()}
        type="button"
      >
        {task.completed && (
          <Check aria-hidden="true" size={14} strokeWidth={2.5} />
        )}
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <h3
            className={`min-w-0 flex-1 truncate text-sm font-medium ${
              task.completed ? "text-muted line-through" : "text-foreground"
            }`}
          >
            <button
              className="block max-w-full truncate text-left hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              onClick={(event) => {
                event.stopPropagation();
                onView();
              }}
              type="button"
            >
              {task.title}
            </button>
          </h3>
          <span className={taskPriorityBadgeClasses[task.priority]}>
            {task.priority}
          </span>
        </div>
        {task.description && (
          <p className="mt-1 line-clamp-1 text-xs text-muted [overflow-wrap:anywhere]">
            {task.description}
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span
            className={`inline-flex items-center gap-1 text-xs ${overdue ? "danger-text" : "text-muted"}`}
          >
            <CalendarDays aria-hidden="true" size={13} />
            {overdue
              ? `Overdue · ${formatDate(task.dueDate)}`
              : formatDate(task.dueDate)}
          </span>
          {project && (
            <span className="max-w-36 truncate text-xs text-muted">
              {project.name}
            </span>
          )}
          {!project && task.projectId && (
            <span className="text-xs text-muted">Project deleted</span>
          )}
          {task.tags.slice(0, 3).map((tag) => (
            <span
              className="tag-badge min-w-0 max-w-full sm:max-w-40"
              key={tag}
              title={tag}
            >
              <span className="block min-w-0 truncate">{tag}</span>
            </span>
          ))}
          {task.tags.length > 3 && (
            <span
              className="tag-badge shrink-0"
              title={task.tags.slice(3).join(", ")}
            >
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      </div>
      <div className="flex shrink-0 gap-1">
        <button
          aria-label={`Edit ${task.title}`}
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
          aria-label={`Delete ${task.title}`}
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
    </motion.article>
  );
}
