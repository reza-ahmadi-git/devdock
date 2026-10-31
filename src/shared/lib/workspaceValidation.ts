import {
  ACTIVITY_TYPES,
  LEARNING_STATUSES,
  PROJECT_STATUSES,
  TASK_PRIORITIES,
  type ActivityEvent,
  type ActivityType,
  type LearningGoal,
  type LearningStatus,
  type Project,
  type ProjectStatus,
  type Task,
  type TaskPriority,
  type WorkspaceData,
} from "../types/workspace";
import { isValidDateOnly } from "./date";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isTimestamp(value: unknown): value is string {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}

function isProject(value: unknown): value is Project {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    value.id.length > 0 &&
    typeof value.name === "string" &&
    typeof value.description === "string" &&
    PROJECT_STATUSES.includes(value.status as ProjectStatus) &&
    isTimestamp(value.createdAt) &&
    isTimestamp(value.updatedAt)
  );
}

function isTask(value: unknown): value is Task {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    value.id.length > 0 &&
    typeof value.title === "string" &&
    typeof value.description === "string" &&
    TASK_PRIORITIES.includes(value.priority as TaskPriority) &&
    typeof value.dueDate === "string" &&
    (value.dueDate === "" || isValidDateOnly(value.dueDate)) &&
    Array.isArray(value.tags) &&
    value.tags.every((tag) => typeof tag === "string") &&
    (value.projectId === null || typeof value.projectId === "string") &&
    typeof value.completed === "boolean" &&
    isTimestamp(value.createdAt) &&
    isTimestamp(value.updatedAt)
  );
}

function isLearningGoal(value: unknown): value is LearningGoal {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    value.id.length > 0 &&
    typeof value.skill === "string" &&
    LEARNING_STATUSES.includes(value.status as LearningStatus) &&
    typeof value.progress === "number" &&
    Number.isFinite(value.progress) &&
    value.progress >= 0 &&
    value.progress <= 100 &&
    typeof value.notes === "string" &&
    isTimestamp(value.createdAt) &&
    isTimestamp(value.updatedAt)
  );
}

function isActivityEvent(value: unknown): value is ActivityEvent {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    value.id.length > 0 &&
    typeof value.type === "string" &&
    ACTIVITY_TYPES.includes(value.type as ActivityType) &&
    typeof value.title === "string" &&
    typeof value.description === "string" &&
    isTimestamp(value.createdAt)
  );
}

function hasUniqueIds(values: Array<{ id: string }>): boolean {
  return new Set(values.map(({ id }) => id)).size === values.length;
}

export function parseWorkspaceData(
  value: unknown,
  allowLegacyVersion = false,
): WorkspaceData | null {
  if (
    !isRecord(value) ||
    (value.version !== 2 && !(allowLegacyVersion && value.version === 1)) ||
    !Array.isArray(value.projects) ||
    !value.projects.every(isProject) ||
    !hasUniqueIds(value.projects) ||
    !Array.isArray(value.tasks) ||
    !value.tasks.every(isTask) ||
    !hasUniqueIds(value.tasks)
  ) {
    return null;
  }

  const learningGoals = value.version === 2 ? value.learningGoals : [];
  const activities = value.version === 2 ? value.activities : [];
  if (
    !Array.isArray(learningGoals) ||
    !learningGoals.every(isLearningGoal) ||
    !hasUniqueIds(learningGoals) ||
    !Array.isArray(activities) ||
    !activities.every(isActivityEvent) ||
    !hasUniqueIds(activities)
  ) {
    return null;
  }

  return {
    version: 2,
    projects: value.projects,
    tasks: value.tasks,
    learningGoals,
    activities,
  };
}
