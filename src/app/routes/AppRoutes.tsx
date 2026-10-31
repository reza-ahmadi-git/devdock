import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router";
import { AppLayout } from "../layouts/AppLayout";

const BackupPage = lazy(() =>
  import("../../features/backup/components/BackupPage").then(
    ({ BackupPage }) => ({ default: BackupPage }),
  ),
);
const DashboardPage = lazy(() =>
  import("../../features/dashboard/components/DashboardPage").then(
    ({ DashboardPage }) => ({ default: DashboardPage }),
  ),
);
const LearningPage = lazy(() =>
  import("../../features/learning/components/LearningPage").then(
    ({ LearningPage }) => ({ default: LearningPage }),
  ),
);
const ProjectsPage = lazy(() =>
  import("../../features/projects/components/ProjectsPage").then(
    ({ ProjectsPage }) => ({ default: ProjectsPage }),
  ),
);
const TasksPage = lazy(() =>
  import("../../features/tasks/components/TasksPage").then(
    ({ TasksPage }) => ({ default: TasksPage }),
  ),
);

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="learning" element={<LearningPage />} />
        <Route path="backup" element={<BackupPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
