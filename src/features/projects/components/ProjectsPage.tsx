import { FolderKanban, Plus, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { useShallow } from "zustand/react/shallow";
import { ConfirmDialog } from "../../../shared/components/ConfirmDialog";
import { EmptyState } from "../../../shared/components/EmptyState";
import { useStaggerListMotion } from "../../../shared/hooks/useStaggerMotion";
import { useWorkspaceStore } from "../../../shared/store/store";
import {
  PROJECT_STATUSES,
  type Project,
  type ProjectStatus,
} from "../../../shared/types/workspace";
import type { ProjectFormOutput } from "../schemas";
import { ProjectCard } from "./ProjectCard";
import { ProjectFormModal } from "./ProjectFormModal";
import { ProjectDetailsModal } from "./ProjectDetailsModal";

type ProjectFilter = "All" | ProjectStatus;
type ProjectFormState =
  { mode: "closed" } | { mode: "create" } | { mode: "edit"; item: Project };

export function ProjectsPage() {
  const {
    projects,
    tasks,
    addProject,
    updateProject,
    deleteProject,
    addToast,
  } = useWorkspaceStore(
    useShallow((state) => ({
      projects: state.projects,
      tasks: state.tasks,
      addProject: state.addProject,
      updateProject: state.updateProject,
      deleteProject: state.deleteProject,
      addToast: state.addToast,
    })),
  );
  const [query, setQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [formProject, setFormProject] = useState<ProjectFormState>({
    mode: "closed",
  });
  const [pendingDelete, setPendingDelete] = useState<Project | null>(null);
  const [viewProject, setViewProject] = useState<Project | null>(null);
  const listMotion = useStaggerListMotion();
  const statusParam = searchParams.get("status");
  const statusFilter: ProjectFilter =
    PROJECT_STATUSES.find((status) => status === statusParam) ?? "All";
  const projectParam = searchParams.get("project");
  const projectFilter =
    projects.find((project) => project.id === projectParam)?.id ?? "All";

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesQuery =
        !normalizedQuery ||
        project.name.toLowerCase().includes(normalizedQuery) ||
        project.description.toLowerCase().includes(normalizedQuery);
      return (
        matchesQuery &&
        (statusFilter === "All" || project.status === statusFilter) &&
        (projectFilter === "All" || project.id === projectFilter)
      );
    });
  }, [projects, query, projectFilter, statusFilter]);

  function saveProject(input: ProjectFormOutput) {
    if (formProject.mode === "edit") {
      if (updateProject(formProject.item.id, input) === "updated") {
        addToast("Project updated.");
      }
    } else {
      if (addProject(input)) addToast("Project created.");
    }
    setFormProject({ mode: "closed" });
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    if (deleteProject(pendingDelete.id)) addToast("Project deleted.");
    setPendingDelete(null);
  }

  return (
    <section className="space-y-7">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 flex items-center gap-2 text-sm font-medium text-accent">
            <FolderKanban aria-hidden="true" size={16} />
            Project workspace
          </p>
          <h2 className="page-title">Projects</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Keep your work organized from the first idea to completion.
          </p>
        </div>
        <button
          className="primary-button shrink-0"
          onClick={() => setFormProject({ mode: "create" })}
          type="button"
        >
          <Plus aria-hidden="true" size={18} />
          New project
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <label className="search-field flex-1">
          <Search
            aria-hidden="true"
            className="shrink-0 text-muted"
            size={18}
          />
          <span className="sr-only">Search projects</span>
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects..."
            value={query}
          />
        </label>
        <label className="filter-select">
          <span className="sr-only">Filter projects by status</span>
          <select
            className="filter-control w-[calc(100%+1.5rem)] sm:w-auto"
            onChange={(event) =>
              setSearchParams((current) => {
                const next = new URLSearchParams(current);
                if (event.target.value === "All") next.delete("status");
                else next.set("status", event.target.value);
                return next;
              })
            }
            value={statusFilter}
          >
            <option value="All">All statuses</option>
            {PROJECT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <label className="filter-select min-w-0 w-full sm:w-64">
          <span className="sr-only">Filter projects by project</span>
          <select
            className="filter-control w-[calc(100%+1.5rem)] min-w-0 text-ellipsis sm:w-full"
            onChange={(event) =>
              setSearchParams((current) => {
                const next = new URLSearchParams(current);
                if (event.target.value === "All") next.delete("project");
                else next.set("project", event.target.value);
                return next;
              })
            }
            value={projectFilter}
          >
            <option value="All">All projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <AnimatePresence mode="wait">
        {filteredProjects.length === 0 ? (
          <EmptyState
            action={
              projects.length === 0
                ? {
                    icon: Plus,
                    label: "Create project",
                    onClick: () => setFormProject({ mode: "create" }),
                    primary: true,
                  }
                : undefined
            }
            description={
              projects.length === 0
                ? "Create your first project to give your work a home."
                : "Try a different search or status filter."
            }
            icon={FolderKanban}
            key="projects-empty"
            title={
              projects.length === 0 ? "No projects yet" : "No projects found"
            }
          />
        ) : (
          <motion.div
            className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3"
            animate={listMotion.animate}
            exit={{ opacity: 0 }}
            initial={listMotion.initial}
            key="projects-grid"
            onViewportEnter={listMotion.onViewportEnter}
            viewport={listMotion.viewport}
            variants={listMotion.containerVariants}
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  onDelete={() => setPendingDelete(project)}
                  onEdit={() => setFormProject({ mode: "edit", item: project })}
                  onView={() => setViewProject(project)}
                  project={project}
                  tasks={tasks.filter((task) => task.projectId === project.id)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {formProject.mode !== "closed" && (
        <ProjectFormModal
          onClose={() => setFormProject({ mode: "closed" })}
          onSave={saveProject}
          project={formProject.mode === "edit" ? formProject.item : undefined}
        />
      )}
      {viewProject && (
        <ProjectDetailsModal
          project={viewProject}
          tasks={tasks}
          onClose={() => setViewProject(null)}
          onEdit={() => {
            setFormProject({ mode: "edit", item: viewProject });
            setViewProject(null);
          }}
        />
      )}
      {pendingDelete && (
        <ConfirmDialog
          description={`"${pendingDelete.name}" will be removed. ${
            tasks.some((task) => task.projectId === pendingDelete.id)
              ? "Its linked tasks will stay in your task list without a project."
              : "This action cannot be undone."
          }`}
          onCancel={() => setPendingDelete(null)}
          onConfirm={confirmDelete}
          title="Delete project?"
        />
      )}
    </section>
  );
}
