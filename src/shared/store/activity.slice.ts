import type { WorkspaceData } from "../types/workspace";
import { createId } from "../lib/id";
import type { ActivityInput } from "./store.types";

const MAX_ACTIVITY_EVENTS = 50;

export function appendActivity(
  data: WorkspaceData,
  input: ActivityInput,
): WorkspaceData {
  const activity = {
    ...input,
    id: createId(),
    createdAt: new Date().toISOString(),
  };

  return {
    ...data,
    // Keep the newest events for the dashboard without letting local storage grow indefinitely.
    activities: [activity, ...data.activities].slice(0, MAX_ACTIVITY_EVENTS),
  };
}
