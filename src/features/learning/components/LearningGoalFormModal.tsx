import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { FieldError } from "../../../shared/components/FieldError";
import { Modal } from "../../../shared/components/Modal";
import {
  LEARNING_NOTES_MAX,
  LEARNING_SKILL_MAX,
  learningGoalSchema,
  type LearningGoalFormOutput,
} from "../schemas";
import {
  LEARNING_STATUSES,
  type LearningGoal,
} from "../../../shared/types/workspace";

type LearningGoalFormInput = z.input<typeof learningGoalSchema>;
type LearningGoalFormModalProps = {
  goal?: LearningGoal;
  onClose: () => void;
  onSave: (input: LearningGoalFormOutput) => void;
};

export function LearningGoalFormModal({
  goal,
  onClose,
  onSave,
}: LearningGoalFormModalProps) {
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    control,
    register,
  } = useForm<LearningGoalFormInput, unknown, LearningGoalFormOutput>({
    resolver: zodResolver(learningGoalSchema),
    defaultValues: {
      skill: goal?.skill ?? "",
      status: goal?.status ?? "Learning",
      progress: goal?.progress ?? 0,
      notes: goal?.notes ?? "",
    },
  });
  const progress = useWatch({ control, name: "progress" });

  return (
    <Modal
      onClose={onClose}
      title={goal ? "Edit learning goal" : "Add learning goal"}
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSave)} noValidate>
        <label className="form-field">
          <span className="field-label">Skill</span>
          <input
            autoFocus
            aria-invalid={Boolean(errors.skill)}
            aria-describedby={errors.skill ? "learning-skill-error" : undefined}
            className="field-input"
            maxLength={LEARNING_SKILL_MAX}
            placeholder="e.g. TypeScript"
            {...register("skill")}
          />
          <FieldError
            id="learning-skill-error"
            message={errors.skill?.message}
          />
        </label>
        <label className="form-field">
          <span className="field-label">Learning status</span>
          <select
            aria-invalid={Boolean(errors.status)}
            aria-describedby={
              errors.status ? "learning-status-error" : undefined
            }
            className="field-input"
            {...register("status")}
          >
            {LEARNING_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <FieldError
            id="learning-status-error"
            message={errors.status?.message}
          />
        </label>
        <label className="form-field">
          <span className="flex items-center justify-between gap-3">
            <span className="field-label">Progress</span>
            <span className="text-sm font-semibold text-accent">
              {progress}%
            </span>
          </span>
          <Controller
            control={control}
            name="progress"
            render={({ field }) => (
              <input
                aria-label="Learning progress"
                aria-invalid={Boolean(errors.progress)}
                aria-describedby={
                  errors.progress ? "learning-progress-error" : undefined
                }
                className="w-full accent-accent"
                max={100}
                min={0}
                onBlur={field.onBlur}
                onChange={(event) =>
                  field.onChange(event.currentTarget.valueAsNumber)
                }
                ref={field.ref}
                step={5}
                type="range"
                value={field.value ?? 0}
              />
            )}
          />
          <FieldError
            id="learning-progress-error"
            message={errors.progress?.message}
          />
        </label>
        <label className="form-field">
          <span className="field-label">Notes</span>
          <textarea
            aria-invalid={Boolean(errors.notes)}
            aria-describedby={errors.notes ? "learning-notes-error" : undefined}
            className="field-input min-h-24 resize-y"
            maxLength={LEARNING_NOTES_MAX}
            placeholder="What are you focusing on? (optional)"
            {...register("notes")}
          />
          <FieldError
            id="learning-notes-error"
            message={errors.notes?.message}
          />
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
            {goal ? "Save changes" : "Add skill"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
