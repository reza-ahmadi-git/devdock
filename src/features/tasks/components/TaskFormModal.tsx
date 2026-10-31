import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FieldError } from "../../../shared/components/FieldError";
import { Modal } from "../../../shared/components/Modal";
import {
  TASK_DESCRIPTION_MAX,
  TASK_TAGS_MAX,
  TASK_TITLE_MAX,
  taskSchema,
  type TaskFormOutput,
} from "../schemas";
import {
  TASK_PRIORITIES,
  type Project,
  type Task,
} from "../../../shared/types/workspace";

type TaskFormInput = z.input<typeof taskSchema>;

type TaskFormModalProps = {
  task?: Task;
  projects: Project[];
  onClose: () => void;
  onSave: (value: TaskFormOutput) => void;
};

export function TaskFormModal({
  onClose,
  onSave,
  projects,
  task,
}: TaskFormModalProps) {
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<TaskFormInput, unknown, TaskFormOutput>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      priority: task?.priority ?? "Medium",
      dueDate: task?.dueDate ?? "",
      tags: task?.tags.join(", ") ?? "",
      projectId: task?.projectId ?? "",
    },
  });

  return (
    <Modal onClose={onClose} title={task ? "Edit task" : "Create task"}>
      <form className="space-y-4" onSubmit={handleSubmit(onSave)} noValidate>
        <label className="form-field">
          <span className="field-label">Task title</span>
          <input
            autoFocus
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? "task-title-error" : undefined}
            className="field-input"
            maxLength={TASK_TITLE_MAX}
            placeholder="e.g. Draft the project brief"
            {...register("title")}
          />
          <FieldError id="task-title-error" message={errors.title?.message} />
        </label>
        <label className="form-field">
          <span className="field-label">Description</span>
          <textarea
            aria-invalid={Boolean(errors.description)}
            aria-describedby={
              errors.description ? "task-description-error" : undefined
            }
            className="field-input min-h-20 resize-y"
            maxLength={TASK_DESCRIPTION_MAX}
            placeholder="Add a few details (optional)"
            {...register("description")}
          />
          <FieldError
            id="task-description-error"
            message={errors.description?.message}
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="form-field">
            <span className="field-label">Priority</span>
            <select className="field-input" {...register("priority")}>
              {TASK_PRIORITIES.map((taskPriority) => (
                <option key={taskPriority} value={taskPriority}>
                  {taskPriority}
                </option>
              ))}
            </select>
          </label>
          <label className="form-field">
            <span className="field-label">Due date</span>
            <input
              aria-invalid={Boolean(errors.dueDate)}
              aria-describedby={errors.dueDate ? "task-date-error" : undefined}
              className="field-input"
              type="date"
              {...register("dueDate")}
            />
            <FieldError
              id="task-date-error"
              message={errors.dueDate?.message}
            />
          </label>
        </div>
        <label className="form-field">
          <span className="field-label">Project</span>
          <select className="field-input" {...register("projectId")}>
            <option value="">No project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </label>
        <label className="form-field">
          <span className="field-label">Tags</span>
          <input
            aria-invalid={Boolean(errors.tags)}
            aria-describedby={errors.tags ? "task-tags-error" : undefined}
            className="field-input"
            maxLength={TASK_TAGS_MAX}
            placeholder="Comma-separated, e.g. design, research"
            {...register("tags")}
          />
          <FieldError id="task-tags-error" message={errors.tags?.message} />
          {!errors.tags && (
            <span className="text-xs text-muted">
              Separate tags with commas.
            </span>
          )}
        </label>
        <div className="flex justify-end gap-2 pt-2">
          <button className="secondary-button" onClick={onClose} type="button">
            Cancel
          </button>
          <button
            className="primary-button"
            disabled={isSubmitting}
            type="submit"
          >
            {task ? "Save changes" : "Create task"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
