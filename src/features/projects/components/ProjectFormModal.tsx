import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FieldError } from "../../../shared/components/FieldError";
import { Modal } from "../../../shared/components/Modal";
import {
  PROJECT_DESCRIPTION_MAX,
  PROJECT_NAME_MAX,
  projectSchema,
  type ProjectFormOutput,
} from "../schemas";
import {
  PROJECT_STATUSES,
  type Project,
} from "../../../shared/types/workspace";

type ProjectFormInput = z.input<typeof projectSchema>;

type ProjectFormModalProps = {
  project?: Project;
  onClose: () => void;
  onSave: (value: ProjectFormOutput) => void;
};

export function ProjectFormModal({
  onClose,
  onSave,
  project,
}: ProjectFormModalProps) {
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<ProjectFormInput, unknown, ProjectFormOutput>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project?.name ?? "",
      description: project?.description ?? "",
      status: project?.status ?? "Planning",
    },
  });

  return (
    <Modal
      onClose={onClose}
      title={project ? "Edit project" : "Create project"}
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSave)} noValidate>
        <label className="form-field">
          <span className="field-label">Project name</span>
          <input
            autoFocus
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "project-name-error" : undefined}
            className="field-input"
            maxLength={PROJECT_NAME_MAX}
            placeholder="e.g. Portfolio website"
            {...register("name")}
          />
          <FieldError id="project-name-error" message={errors.name?.message} />
        </label>
        <label className="form-field">
          <span className="field-label">Description</span>
          <textarea
            aria-invalid={Boolean(errors.description)}
            aria-describedby={
              errors.description ? "project-description-error" : undefined
            }
            className="field-input min-h-24 resize-y"
            maxLength={PROJECT_DESCRIPTION_MAX}
            placeholder="What are you building?"
            {...register("description")}
          />
          <FieldError
            id="project-description-error"
            message={errors.description?.message}
          />
        </label>
        <label className="form-field">
          <span className="field-label">Status</span>
          <select className="field-input" {...register("status")}>
            {PROJECT_STATUSES.map((projectStatus) => (
              <option key={projectStatus} value={projectStatus}>
                {projectStatus}
              </option>
            ))}
          </select>
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
            {project ? "Save changes" : "Create project"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
