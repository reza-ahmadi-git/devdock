import { getWeekRange, isDueWithinWeek } from "../lib/date";
import type { WorkspaceData } from "../types/workspace";

export function selectDashboardData(
  workspace: WorkspaceData,
  now = new Date(),
) {
  // Compare date-only deadlines against local calendar dates to avoid UTC day shifts.
  const { today, weekEnd } = getWeekRange(now);
  const openTasks = workspace.tasks.filter((task) => !task.completed);
  const completedTasks = workspace.tasks.filter((task) => task.completed);
  const activeProjects = workspace.projects.filter(
    (project) => project.status === "In Progress",
  );
  const dueSoonTasks = workspace.tasks.filter((task) =>
    isDueWithinWeek(task, { today, weekEnd }),
  );
  const projectProgress = [...workspace.projects]
    .sort((first, second) => second.updatedAt.localeCompare(first.updatedAt))
    .slice(0, 4)
    .map((project) => {
      const projectTasks = workspace.tasks.filter(
        (task) => task.projectId === project.id,
      );
      const completedCount = projectTasks.filter(
        (task) => task.completed,
      ).length;
      return {
        project,
        completedCount,
        taskCount: projectTasks.length,
        progress: projectTasks.length
          ? Math.round((completedCount / projectTasks.length) * 100)
          : 0,
      };
    });

  return {
    isEmpty:
      workspace.projects.length === 0 &&
      workspace.tasks.length === 0 &&
      workspace.learningGoals.length === 0 &&
      workspace.activities.length === 0,
    activeProjectCount: activeProjects.length,
    projectCount: workspace.projects.length,
    openTasks,
    completedTasks,
    dueSoonTasks,
    recentActivities: workspace.activities.slice(0, 6),
    projectProgress,
    upcomingTasks: [...dueSoonTasks]
      .sort((first, second) => first.dueDate.localeCompare(second.dueDate))
      .slice(0, 6),
  };
}
