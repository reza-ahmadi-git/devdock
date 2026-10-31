import type { Project } from "../types/workspace";
import { createId } from "../lib/id";
import { appendActivity } from "./activity.slice";
import type { ProjectSlice, WorkspaceDomainSliceFactory } from "./store.types";

export const createProjectSlice: WorkspaceDomainSliceFactory<ProjectSlice> = (
  commitData,
  get,
) => ({
  addProject: (input) => {
    const now = new Date().toISOString();
    const project: Project = {
      ...input,
      id: createId(),
      createdAt: now,
      updatedAt: now,
    };
    return commitData((current) =>
      appendActivity(
        { ...current, projects: [project, ...current.projects] },
        {
          type: "project_created",
          title: "Project created",
          description: project.name,
        },
      ),
    );
  },

  updateProject: (id, input) => {
    const previous = get().projects.find((project) => project.id === id);
    if (
      previous &&
      previous.name === input.name &&
      previous.description === input.description &&
      previous.status === input.status
    ) {
      return "unchanged";
    }

    if (!previous) return "error";
    return commitData((current) => {
      const next = {
        ...current,
        projects: current.projects.map((project) =>
          project.id === id
            ? { ...project, ...input, updatedAt: new Date().toISOString() }
            : project,
        ),
      };
      const detailsChanged =
        previous.name !== input.name ||
        previous.description !== input.description;

      return appendActivity(
        next,
        detailsChanged
          ? {
              type: "project_updated",
              title: "Project updated",
              description: input.name,
            }
          : {
              type: "project_status_changed",
              title: "Project status changed",
              description: `${previous.name}: ${previous.status} → ${input.status}`,
            },
      );
    })
      ? "updated"
      : "error";
  },

  deleteProject: (id) => {
    const project = get().projects.find((item) => item.id === id);
    return commitData((current) => {
      const next = {
        ...current,
        projects: current.projects.filter((item) => item.id !== id),
        // Keep tasks intact while removing their reference to the deleted project.
        tasks: current.tasks.map((task) =>
          task.projectId === id ? { ...task, projectId: null } : task,
        ),
      };
      return project
        ? appendActivity(next, {
            type: "project_deleted",
            title: "Project deleted",
            description: project.name,
          })
        : next;
    });
  },
});
