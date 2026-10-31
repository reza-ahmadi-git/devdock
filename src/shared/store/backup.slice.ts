import { parseWorkspaceData } from "../lib/workspaceValidation";
import type { BackupSlice, WorkspaceDomainSliceFactory } from "./store.types";

export const createBackupSlice: WorkspaceDomainSliceFactory<BackupSlice> = (
  commitData,
  get,
) => ({
  restoreWorkspace: (workspace) => {
    // Validate before persistence so malformed backups cannot partially replace the workspace.
    const validatedWorkspace = parseWorkspaceData(workspace);
    if (!validatedWorkspace) {
      get().addToast(
        "The backup data is invalid. Your current workspace was not changed.",
        "error",
      );
      return false;
    }
    return commitData(() => validatedWorkspace);
  },
});
