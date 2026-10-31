import type { StateCreator } from "zustand";
import type {
  ActivityEvent,
  LearningGoal,
  Project,
  Task,
  WorkspaceData,
} from "../types/workspace";

type ProjectInput = Pick<Project, "name" | "description" | "status">;
type TaskInput = Pick<
  Task,
  "title" | "description" | "priority" | "dueDate" | "tags" | "projectId"
>;
type LearningGoalInput = Pick<
  LearningGoal,
  "skill" | "status" | "progress" | "notes"
>;
export type UpdateResult = "updated" | "unchanged" | "error";

type ToastVariant = "success" | "error";

export type ToastState = {
  id: string;
  message: string;
  variant: ToastVariant;
};

export type ProjectSlice = {
  addProject: (input: ProjectInput) => boolean;
  updateProject: (id: string, input: ProjectInput) => UpdateResult;
  deleteProject: (id: string) => boolean;
};

export type TaskSlice = {
  addTask: (input: TaskInput) => boolean;
  updateTask: (id: string, input: TaskInput) => UpdateResult;
  toggleTask: (id: string) => boolean;
  deleteTask: (id: string) => boolean;
};

export type LearningGoalSlice = {
  addLearningGoal: (input: LearningGoalInput) => boolean;
  updateLearningGoal: (id: string, input: LearningGoalInput) => UpdateResult;
  deleteLearningGoal: (id: string) => boolean;
};

export type BackupSlice = {
  restoreWorkspace: (workspace: WorkspaceData) => boolean;
};

export type ToastSlice = {
  toasts: ToastState[];
  addToast: (message: string, variant?: ToastVariant) => void;
  dismissToast: (id: string) => void;
  pauseToast: (id: string) => void;
  resumeToast: (id: string) => void;
};

export type WorkspaceStore = WorkspaceData &
  ProjectSlice &
  TaskSlice &
  LearningGoalSlice &
  BackupSlice &
  ToastSlice & {
    storageError: string | null;
  };

export type CommitWorkspaceData = (
  update: (current: WorkspaceData) => WorkspaceData,
) => boolean;

export type WorkspaceSliceCreator<TSlice> = StateCreator<
  WorkspaceStore,
  [],
  [],
  TSlice
>;
export type WorkspaceDomainSliceFactory<TSlice> = (
  commitData: CommitWorkspaceData,
  get: () => WorkspaceStore,
) => TSlice;

export type ActivityInput = Pick<
  ActivityEvent,
  "type" | "title" | "description"
>;
