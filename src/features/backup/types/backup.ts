import type { WorkspaceData } from "../../../shared/types/workspace";

export type BackupDocument = {
  format: "devdock-workspace-backup";
  formatVersion: 1;
  exportedAt: string;
  workspace: WorkspaceData;
};
