import {
  DetailField,
  DetailsModal,
} from "../../../shared/components/DetailsModal";
import { projectStatusBadgeClasses } from "../../../shared/lib/badgeClasses";
import { formatDateTime } from "../../../shared/lib/date";
import type { Project, Task } from "../../../shared/types/workspace";

type ProjectDetailsModalProps = {
  project: Project;
  tasks: Task[];
  onClose: () => void;
  onEdit: () => void;
};

export function ProjectDetailsModal({
  onClose,
  onEdit,
  project,
  tasks,
}: ProjectDetailsModalProps) {
  const projectTasks = tasks.filter((task) => task.projectId === project.id);

  return (
    <DetailsModal onClose={onClose} onEdit={onEdit} title={project.name}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className={projectStatusBadgeClasses[project.status]}>
          {project.status}
        </span>
        <span className="text-xs text-muted">
          {projectTasks.filter((task) => task.completed).length}/
          {projectTasks.length} tasks complete
        </span>
      </div>
      <DetailField
        label="Description"
        value={project.description || "No description added."}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <DetailField
          label="Created"
          value={formatDateTime(project.createdAt)}
        />
        <DetailField
          label="Last updated"
          value={formatDateTime(project.updatedAt)}
        />
      </div>
      <div>
        <p className="text-xs font-medium text-muted">Linked tasks</p>
        {projectTasks.length ? (
          <ul className="mt-2 max-h-52 space-y-2 overflow-y-auto rounded-xl border border-border bg-surface-raised p-3">
            {projectTasks.map((task) => (
              <li className="flex items-start gap-2 text-sm" key={task.id}>
                <span
                  className={`mt-0.5 size-2 shrink-0 rounded-full ${
                    task.completed ? "bg-accent" : "bg-muted"
                  }`}
                />
                <span
                  className={`min-w-0 [overflow-wrap:anywhere] ${
                    task.completed
                      ? "text-muted line-through"
                      : "text-foreground"
                  }`}
                >
                  {task.title}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted">
            No tasks linked to this project.
          </p>
        )}
      </div>
    </DetailsModal>
  );
}
