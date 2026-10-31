import {
  AlertTriangle,
  Download,
  FileUp,
  HardDriveDownload,
  RotateCcw,
} from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import { useShallow } from "zustand/react/shallow";
import { ConfirmDialog } from "../../../shared/components/ConfirmDialog";
import { useWorkspaceStore } from "../../../shared/store/store";
import { selectWorkspaceData } from "../../../shared/store/workspace.selectors";
import { formatTimestamp } from "../../../shared/lib/date";
import { createBackup, parseBackupText } from "../utils/backup";
import type { BackupDocument } from "../types/backup";

const MAX_BACKUP_SIZE = 10 * 1024 * 1024;

export function BackupPage() {
  const workspace = useWorkspaceStore(useShallow(selectWorkspaceData));
  const { projects, tasks, learningGoals } = workspace;
  const { restoreWorkspace, addToast } = useWorkspaceStore(
    useShallow((state) => ({
      restoreWorkspace: state.restoreWorkspace,
      addToast: state.addToast,
    })),
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stagedBackup, setStagedBackup] = useState<BackupDocument | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isConfirmingRestore, setIsConfirmingRestore] = useState(false);

  function downloadBackup() {
    try {
      const backup = createBackup(workspace);
      const blob = new Blob([JSON.stringify(backup, null, 2)], {
        type: "application/json",
      });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const timestamp = backup.exportedAt.replace(/[:.]/g, "-");
      link.href = downloadUrl;
      link.download = `devdock-backup-${timestamp}.json`;
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      addToast("Backup downloaded.");
    } catch {
      addToast("The backup could not be created or downloaded.", "error");
    }
  }

  async function handleFileSelection(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    setStagedBackup(null);
    setFileError(null);
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".json")) {
      setFileError("Choose a DevDock backup with a .json file extension.");
      return;
    }
    if (file.size > MAX_BACKUP_SIZE) {
      setFileError("This file is larger than the 10 MB backup limit.");
      return;
    }

    try {
      const result = parseBackupText(await file.text());
      if (!result.ok) {
        setFileError(result.error);
        return;
      }
      setStagedBackup(result.backup);
    } catch {
      setFileError("The selected file could not be read.");
    }
  }

  function confirmRestore() {
    if (!stagedBackup) return;
    if (restoreWorkspace(stagedBackup.workspace)) {
      addToast("Workspace restored from backup.");
      setStagedBackup(null);
      setFileError(null);
    }
    setIsConfirmingRestore(false);
  }

  return (
    <section className="space-y-7">
      <header>
        <p className="mb-2 flex items-center gap-2 text-sm font-medium text-accent">
          <HardDriveDownload aria-hidden="true" size={16} />
          Your data, in your control
        </p>
        <h2 className="page-title">Backup & restore</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Export your workspace to a versioned JSON file or restore it on this
          device. Restoring replaces the current projects, tasks, learning
          goals, and activity.
        </p>
      </header>

      <div className="grid gap-5 xl:grid-cols-2">
        <section aria-labelledby="export-heading" className="content-card">
          <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <Download aria-hidden="true" size={20} />
          </span>
          <h3
            className="text-base font-semibold text-foreground"
            id="export-heading"
          >
            Export a backup
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted">
            Download all of your projects, tasks, learning goals, and recent
            activity in a versioned DevDock JSON file.
          </p>
          <p className="mt-4 text-xs text-muted">
            {projects.length} projects · {tasks.length} tasks ·{" "}
            {learningGoals.length} learning goals
          </p>
          <button
            className="primary-button mt-5"
            onClick={downloadBackup}
            type="button"
          >
            <Download aria-hidden="true" size={17} />
            Download backup
          </button>
        </section>

        <section aria-labelledby="restore-heading" className="content-card">
          <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <RotateCcw aria-hidden="true" size={20} />
          </span>
          <h3
            className="text-base font-semibold text-foreground"
            id="restore-heading"
          >
            Restore a backup
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted">
            Select a DevDock JSON backup. Its format, version, and workspace
            data will be validated before you can confirm replacing your current
            data.
          </p>
          <input
            accept=".json,application/json"
            className="sr-only"
            onChange={handleFileSelection}
            ref={fileInputRef}
            type="file"
          />
          <button
            className="secondary-button mt-5"
            onClick={() => fileInputRef.current?.click()}
            type="button"
          >
            <FileUp aria-hidden="true" size={17} />
            Choose backup file
          </button>

          {fileError && (
            <p
              className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-3 text-sm text-red-700 dark:text-red-400"
              role="alert"
            >
              {fileError}
            </p>
          )}
          {stagedBackup && (
            <div className="mt-4 rounded-xl border border-border bg-surface-raised p-4">
              <p className="text-sm font-medium text-foreground">
                Backup validated
              </p>
              <p className="mt-1 text-xs text-muted">
                Created {formatTimestamp(stagedBackup.exportedAt)}
              </p>
              <p className="mt-2 text-xs text-muted">
                {stagedBackup.workspace.projects.length} projects ·{" "}
                {stagedBackup.workspace.tasks.length} tasks ·{" "}
                {stagedBackup.workspace.learningGoals.length} learning goals
              </p>
              <button
                className="danger-button mt-4"
                onClick={() => setIsConfirmingRestore(true)}
                type="button"
              >
                <RotateCcw aria-hidden="true" size={16} />
                Restore this backup
              </button>
            </div>
          )}
        </section>
      </div>

      <aside className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
        <AlertTriangle
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-amber-700 dark:text-amber-400"
          size={18}
        />
        <p className="text-sm leading-6 text-warning-foreground">
          Backups may contain personal project information. Store them somewhere
          private. An invalid or unsupported file will never replace your
          current workspace.
        </p>
      </aside>

      {isConfirmingRestore && stagedBackup && (
        <ConfirmDialog
          confirmLabel="Replace workspace"
          description={`This will replace all current workspace data with ${stagedBackup.workspace.projects.length} projects, ${stagedBackup.workspace.tasks.length} tasks, ${stagedBackup.workspace.learningGoals.length} learning goals, and its saved activity. This action cannot be undone.`}
          onCancel={() => setIsConfirmingRestore(false)}
          onConfirm={confirmRestore}
          title="Restore this backup?"
        />
      )}
    </section>
  );
}
