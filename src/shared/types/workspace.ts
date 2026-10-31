export const PROJECT_STATUSES = [
  "Planning",
  "In Progress",
  "Completed",
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const TASK_PRIORITIES = ["Low", "Medium", "High"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const LEARNING_STATUSES = [
  "Learning",
  "Practicing",
  "Completed",
] as const;
export type LearningStatus = (typeof LEARNING_STATUSES)[number];

export const ACTIVITY_TYPES = [
  "project_created",
  "project_updated",
  "project_status_changed",
  "project_deleted",
  "task_created",
  "task_updated",
  "task_completed",
  "task_reopened",
  "task_deleted",
  "learning_created",
  "learning_updated",
  "learning_completed",
  "learning_deleted",
] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export type LearningGoal = {
  id: string;
  skill: string;
  status: LearningStatus;
  progress: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type ActivityEvent = {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  createdAt: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
  tags: string[];
  projectId: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type WorkspaceData = {
  version: 2;
  projects: Project[];
  tasks: Task[];
  learningGoals: LearningGoal[];
  activities: ActivityEvent[];
};
