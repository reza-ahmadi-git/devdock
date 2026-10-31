import { parseWorkspaceData } from "./workspaceValidation";
import type { WorkspaceData } from "../types/workspace";

export const WORKSPACE_STORAGE_KEY = "devdock-workspace-v1";

const EMPTY_WORKSPACE: WorkspaceData = {
  version: 2,
  projects: [],
  tasks: [],
  learningGoals: [],
  activities: [],
};

type WorkspaceLoadResult = {
  data: WorkspaceData;
  error: string | null;
  preservationFailed: boolean;
};

function preserveCorruptWorkspace(raw: string): string | null {
  try {
    const recoveryPrefix = `${WORKSPACE_STORAGE_KEY}.corrupt-`;
    const recoveryKeys: string[] = [];
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (!key?.startsWith(recoveryPrefix)) continue;
      recoveryKeys.push(key);
      if (localStorage.getItem(key) === raw) return null;
    }

    let timestamp = Date.now();
    let recoveryKey = `${WORKSPACE_STORAGE_KEY}.corrupt-${timestamp}`;
    while (localStorage.getItem(recoveryKey) !== null) {
      recoveryKey = `${WORKSPACE_STORAGE_KEY}.corrupt-${++timestamp}`;
    }
    localStorage.setItem(recoveryKey, raw);

    recoveryKeys.push(recoveryKey);
    recoveryKeys.sort(
      (first, second) =>
        Number(first.slice(recoveryPrefix.length)) -
        Number(second.slice(recoveryPrefix.length)),
    );
    try {
      for (const key of recoveryKeys.slice(
        0,
        Math.max(0, recoveryKeys.length - 5),
      )) {
        localStorage.removeItem(key);
      }
    } catch {
      // The new recovery copy remains valid if cleanup of older copies is unavailable.
    }

    return null;
  } catch {
    return "Saved workspace data is invalid and could not be copied to a recovery key. Changes are blocked to protect the original data.";
  }
}

export function loadWorkspace(): WorkspaceLoadResult {
  let saved: string | null;
  try {
    saved = localStorage.getItem(WORKSPACE_STORAGE_KEY);
  } catch {
    return {
      data: EMPTY_WORKSPACE,
      error: "Workspace data could not be read from this browser.",
      preservationFailed: false,
    };
  }
  if (saved === null) {
    return { data: EMPTY_WORKSPACE, error: null, preservationFailed: false };
  }

  let data: WorkspaceData | null = null;
  try {
    data = parseWorkspaceData(JSON.parse(saved), true);
  } catch {
    // Malformed JSON follows the same recovery path as structurally invalid data.
  }
  if (data) return { data, error: null, preservationFailed: false };

  const preservationError = preserveCorruptWorkspace(saved);
  return {
    data: EMPTY_WORKSPACE,
    error:
      preservationError ??
      "Saved workspace data was invalid; its raw contents were copied to a separate recovery key.",
    preservationFailed: Boolean(preservationError),
  };
}

export function saveWorkspace(data: WorkspaceData): string | null {
  try {
    localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(data));
    return null;
  } catch {
    return "Changes could not be saved in this browser. Check available storage and try again.";
  }
}
