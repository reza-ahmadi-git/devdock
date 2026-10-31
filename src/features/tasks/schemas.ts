import { z } from "zod";
import { isValidDateOnly } from "../../shared/lib/date";
import { TASK_PRIORITIES } from "../../shared/types/workspace";

export const TASK_TITLE_MAX = 120;
export const TASK_DESCRIPTION_MAX = 500;
export const TASK_TAGS_MAX = 300;
const TASK_TAG_COUNT_MAX = 10;
const TASK_TAG_LENGTH_MAX = 30;

const optionalDate = z.string().refine((value) => {
  if (!value) return true;
  return isValidDateOnly(value);
}, "Enter a valid due date.");

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Enter a task title.")
    .max(TASK_TITLE_MAX, `Use ${TASK_TITLE_MAX} characters or fewer.`),
  description: z
    .string()
    .trim()
    .max(
      TASK_DESCRIPTION_MAX,
      `Use ${TASK_DESCRIPTION_MAX} characters or fewer.`,
    ),
  priority: z.enum(TASK_PRIORITIES),
  dueDate: optionalDate,
  tags: z
    .string()
    .max(TASK_TAGS_MAX, `Keep tags under ${TASK_TAGS_MAX} characters.`)
    .transform((value) => [
      ...new Set(
        value
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
          .map((tag) => tag.toLowerCase()),
      ),
    ])
    .refine(
      (tags) => tags.length <= TASK_TAG_COUNT_MAX,
      `Maximum ${TASK_TAG_COUNT_MAX} tags allowed.`,
    )
    .refine(
      (tags) => tags.every((tag) => tag.length <= TASK_TAG_LENGTH_MAX),
      `Each tag must be ${TASK_TAG_LENGTH_MAX} characters or fewer.`,
    ),
  projectId: z.string(),
});

export type TaskFormOutput = z.output<typeof taskSchema>;
