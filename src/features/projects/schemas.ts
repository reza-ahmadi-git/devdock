import { z } from "zod";
import { PROJECT_STATUSES } from "../../shared/types/workspace";

export const PROJECT_NAME_MAX = 80;
export const PROJECT_DESCRIPTION_MAX = 500;

export const projectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter a project name.")
    .max(PROJECT_NAME_MAX, `Use ${PROJECT_NAME_MAX} characters or fewer.`),
  description: z
    .string()
    .trim()
    .max(
      PROJECT_DESCRIPTION_MAX,
      `Use ${PROJECT_DESCRIPTION_MAX} characters or fewer.`,
    ),
  status: z.enum(PROJECT_STATUSES),
});

export type ProjectFormOutput = z.output<typeof projectSchema>;
