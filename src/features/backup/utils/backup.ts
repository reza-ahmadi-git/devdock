import { parseWorkspaceData } from "../../../shared/lib/workspaceValidation";
import type { WorkspaceData } from "../../../shared/types/workspace";
import type { BackupDocument } from "../types/backup";

export const BACKUP_FORMAT = "devdock-workspace-backup";
export const BACKUP_FORMAT_VERSION = 1;

export function createBackup(workspace: WorkspaceData): BackupDocument {
  return {
    format: BACKUP_FORMAT,
    formatVersion: BACKUP_FORMAT_VERSION,
    exportedAt: new Date().toISOString(),
    workspace,
  };
}

export function parseBackupText(
  content: string,
): { ok: true; backup: BackupDocument } | { ok: false; error: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    return { ok: false, error: "This file is not valid JSON." };
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return { ok: false, error: "The backup file must contain a JSON object." };
  }

  const document = parsed as Record<string, unknown>;
  // Validate the backup envelope before examining workspace data so unsupported formats cannot be restored.
  if (document.format !== BACKUP_FORMAT) {
    return { ok: false, error: "This file is not a DevDock backup." };
  }
  if (document.formatVersion !== BACKUP_FORMAT_VERSION) {
    return {
      ok: false,
      error: `Unsupported backup format version. This app supports version ${BACKUP_FORMAT_VERSION}.`,
    };
  }
  if (
    typeof document.exportedAt !== "string" ||
    !Number.isFinite(Date.parse(document.exportedAt))
  ) {
    return { ok: false, error: "The backup timestamp is missing or invalid." };
  }

  const workspace = parseWorkspaceData(document.workspace);
  if (!workspace) {
    return {
      ok: false,
      error:
        "The workspace data is invalid or uses an unsupported workspace version.",
    };
  }

  return {
    ok: true,
    backup: {
      format: BACKUP_FORMAT,
      formatVersion: BACKUP_FORMAT_VERSION,
      exportedAt: document.exportedAt,
      workspace,
    },
  };
}
