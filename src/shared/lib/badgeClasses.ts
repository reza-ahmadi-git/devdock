import type {
  LearningStatus,
  ProjectStatus,
  TaskPriority,
} from "../types/workspace";

export const projectStatusBadgeClasses: Record<ProjectStatus, string> = {
  Planning: "status-badge status-planning",
  "In Progress": "status-badge status-progress",
  Completed: "status-badge status-completed",
};

export const learningStatusBadgeClasses: Record<LearningStatus, string> = {
  Learning: "status-badge status-planning",
  Practicing: "status-badge status-progress",
  Completed: "status-badge status-completed",
};

export const taskPriorityBadgeClasses: Record<TaskPriority, string> = {
  Low: "priority-badge priority-low",
  Medium: "priority-badge priority-medium",
  High: "priority-badge priority-high",
};

export const taskCompletionBadgeClasses: Record<"completed" | "open", string> =
  {
    completed: "status-badge status-completed",
    open: "status-badge status-progress",
  };
