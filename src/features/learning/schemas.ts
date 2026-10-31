import { z } from "zod";
import { LEARNING_STATUSES } from "../../shared/types/workspace";

export const LEARNING_SKILL_MAX = 80;
export const LEARNING_NOTES_MAX = 500;

export const learningGoalSchema = z
  .object({
    skill: z
      .string()
      .trim()
      .min(1, "Enter a skill name.")
      .max(
        LEARNING_SKILL_MAX,
        `Use ${LEARNING_SKILL_MAX} characters or fewer.`,
      ),
    status: z.enum(LEARNING_STATUSES),
    progress: z.number().int().min(0).max(100),
    notes: z
      .string()
      .trim()
      .max(
        LEARNING_NOTES_MAX,
        `Use ${LEARNING_NOTES_MAX} characters or fewer.`,
      ),
  })
  .transform((goal) => ({
    ...goal,
    progress: goal.status === "Completed" ? 100 : goal.progress,
  }));

export type LearningGoalFormOutput = z.output<typeof learningGoalSchema>;
