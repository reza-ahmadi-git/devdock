import type { WorkspaceData } from "../types/workspace";

type WorkspaceState = Pick<
  WorkspaceData,
  "projects" | "tasks" | "learningGoals" | "activities"
>;

export function selectWorkspaceData(state: WorkspaceState): WorkspaceData {
  return {
    version: 2,
    projects: state.projects,
    tasks: state.tasks,
    learningGoals: state.learningGoals,
    activities: state.activities,
  };
}
