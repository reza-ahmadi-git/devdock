import {
  DetailField,
  DetailsModal,
} from "../../../shared/components/DetailsModal";
import {
  taskCompletionBadgeClasses,
  taskPriorityBadgeClasses,
} from "../../../shared/lib/badgeClasses";
import { formatDate, formatDateTime } from "../../../shared/lib/date";
import type { Project, Task } from "../../../shared/types/workspace";

type TaskDetailsModalProps = {
  task: Task;
  projects: Project[];
  onClose: () => void;
  onEdit: () => void;
};

export function TaskDetailsModal({
  onClose,
  onEdit,
  projects,
  task,
}: TaskDetailsModalProps) {
  const projectName = projects.find(
    (project) => project.id === task.projectId,
  )?.name;

  return (
    <DetailsModal onClose={onClose} onEdit={onEdit} title={task.title}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={taskPriorityBadgeClasses[task.priority]}>
          {task.priority} priority
        </span>
        <span
          className={
            taskCompletionBadgeClasses[task.completed ? "completed" : "open"]
          }
        >
          {task.completed ? "Completed" : "Open"}
        </span>
      </div>
      <DetailField
        label="Description"
        value={task.description || "No description added."}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <DetailField label="Due date" value={formatDate(task.dueDate)} />
        <DetailField
          label="Project"
          value={
            projectName ?? (task.projectId ? "Project deleted" : "No project")
          }
        />
        <DetailField label="Created" value={formatDateTime(task.createdAt)} />
        <DetailField
          label="Last updated"
          value={formatDateTime(task.updatedAt)}
        />
      </div>
      <div>
        <p className="text-xs font-medium text-muted">Tags</p>
        {task.tags.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {task.tags.map((tag) => (
              <span
                className="tag-badge whitespace-normal [overflow-wrap:anywhere]"
                key={tag}
              >
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-1 text-sm text-muted">No tags added.</p>
        )}
      </div>
    </DetailsModal>
  );
}
