import { create } from "zustand";
import {
  loadWorkspace,
  saveWorkspace,
  WORKSPACE_STORAGE_KEY,
} from "../lib/workspaceStorage";
import { parseWorkspaceData } from "../lib/workspaceValidation";
import type { WorkspaceData } from "../types/workspace";
import { createBackupSlice } from "./backup.slice";
import { createLearningGoalSlice } from "./learning-goal.slice";
import { createProjectSlice } from "./project.slice";
import { createTaskSlice } from "./task.slice";
import { createToastSlice } from "./toast.slice";
import { selectWorkspaceData } from "./workspace.selectors";
import type { CommitWorkspaceData, WorkspaceStore } from "./store.types";

const initialWorkspace = loadWorkspace();

export const useWorkspaceStore = create<WorkspaceStore>()((set, get, api) => {
  let storageWriteBlocked = initialWorkspace.preservationFailed;

  // Persist first so storage failures never publish an unsaved workspace to subscribers.
  const commitData: CommitWorkspaceData = (update) => {
    if (storageWriteBlocked) {
      set({ storageError: initialWorkspace.error });
      get().addToast(
        "Your changes are blocked because the saved workspace could not be protected.",
        "error",
      );
      return false;
    }

    const current = get();
    const currentWorkspace: WorkspaceData = selectWorkspaceData(current);
    const nextWorkspace = update(currentWorkspace);
    const storageError = saveWorkspace(nextWorkspace);

    if (storageError) {
      set({ storageError });
      get().addToast(
        "Your changes could not be saved in this browser.",
        "error",
      );
      return false;
    }

    set({ ...nextWorkspace, storageError: null });
    return true;
  };

  if (typeof window !== "undefined") {
    window.addEventListener("storage", (event) => {
      if (event.key !== WORKSPACE_STORAGE_KEY || !event.newValue) return;
      try {
        const workspace = parseWorkspaceData(JSON.parse(event.newValue), true);
        if (workspace) {
          storageWriteBlocked = false;
          set({ ...workspace, storageError: null });
        }
      } catch {
        // Ignore invalid data from another tab and retain the current workspace.
      }
    });
  }

  return {
    ...createProjectSlice(commitData, get),
    ...createTaskSlice(commitData, get),
    ...createLearningGoalSlice(commitData, get),
    ...createBackupSlice(commitData, get),
    ...createToastSlice(set, get, api),
    ...initialWorkspace.data,
    storageError: initialWorkspace.error,
  };
});
