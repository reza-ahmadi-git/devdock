import { CalendarClock, ListTodo, Plus, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { useShallow } from "zustand/react/shallow";
import { ConfirmDialog } from "../../../shared/components/ConfirmDialog";
import { EmptyState } from "../../../shared/components/EmptyState";
import { useStaggerListMotion } from "../../../shared/hooks/useStaggerMotion";
import { useWorkspaceStore } from "../../../shared/store/store";
import { getWeekRange, isDueWithinWeek } from "../../../shared/lib/date";
import {
  TASK_PRIORITIES,
  type Task,
  type TaskPriority,
} from "../../../shared/types/workspace";
import { TaskFormModal } from "./TaskFormModal";
import { TaskRow } from "./TaskRow";
import { TaskDetailsModal } from "./TaskDetailsModal";
import type { TaskFormOutput } from "../schemas";

type CompletionFilter = "All" | "Open" | "Completed";
type PriorityFilter = "All" | TaskPriority;
type TaskFormState =
  { mode: "closed" } | { mode: "create" } | { mode: "edit"; item: Task };

function isCompletionFilter(value: string | null): value is CompletionFilter {
  return value === "All" || value === "Open" || value === "Completed";
}

export function TasksPage() {
  const {
    projects,
    tasks,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    addToast,
  } = useWorkspaceStore(
    useShallow((state) => ({
      projects: state.projects,
      tasks: state.tasks,
      addTask: state.addTask,
      updateTask: state.updateTask,
      toggleTask: state.toggleTask,
      deleteTask: state.deleteTask,
      addToast: state.addToast,
    })),
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [formTask, setFormTask] = useState<TaskFormState>({ mode: "closed" });
  const [pendingDelete, setPendingDelete] = useState<Task | null>(null);
  const [viewTask, setViewTask] = useState<Task | null>(null);
  const listMotion = useStaggerListMotion();
  const statusParam = searchParams.get("status");
  const completionFilter = isCompletionFilter(statusParam)
    ? statusParam
    : "All";
  const dueFilter = searchParams.get("due") === "week";
  const priorityParam = searchParams.get("priority");
  const priorityFilter: PriorityFilter =
    TASK_PRIORITIES.find((priority) => priority === priorityParam) ?? "All";
  const projectParam = searchParams.get("project");
  const projectFilter =
    projectParam === "unassigned"
      ? "unassigned"
      : (projects.find((project) => project.id === projectParam)?.id ?? "All");
  const { today: todayString, weekEnd: weekEndString } = getWeekRange();

  const filteredTasks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return tasks.filter((task) => {
      const projectName =
        projects.find((project) => project.id === task.projectId)?.name ?? "";
      const matchesSearch =
        !normalizedQuery ||
        task.title.toLowerCase().includes(normalizedQuery) ||
        task.description.toLowerCase().includes(normalizedQuery) ||
        task.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery)) ||
        projectName.toLowerCase().includes(normalizedQuery);
      const matchesCompletion =
        completionFilter === "All" ||
        (completionFilter === "Open" && !task.completed) ||
        (completionFilter === "Completed" && task.completed);
      return (
        matchesSearch &&
        matchesCompletion &&
        (priorityFilter === "All" || task.priority === priorityFilter) &&
        (projectFilter === "All" ||
          (projectFilter === "unassigned"
            ? task.projectId === null
            : task.projectId === projectFilter)) &&
        (!dueFilter ||
          isDueWithinWeek(task, {
            today: todayString,
            weekEnd: weekEndString,
          }))
      );
    });
  }, [
    tasks,
    projects,
    query,
    completionFilter,
    priorityFilter,
    projectFilter,
    dueFilter,
    todayString,
    weekEndString,
  ]);

  function saveTask(input: TaskFormOutput) {
    const taskInput = { ...input, projectId: input.projectId || null };
    if (formTask.mode === "edit") {
      if (updateTask(formTask.item.id, taskInput) === "updated") {
        addToast("Task updated.");
      }
    } else {
      if (addTask(taskInput)) addToast("Task created.");
    }
    setFormTask({ mode: "closed" });
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    if (deleteTask(pendingDelete.id)) addToast("Task deleted.");
    setPendingDelete(null);
  }

  function clearFilters() {
    setQuery("");
    setSearchParams({});
  }

  return (
    <section className="space-y-7">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 flex items-center gap-2 text-sm font-medium text-accent">
            <ListTodo aria-hidden="true" size={16} />
            Your next steps
          </p>
          <h2 className="page-title">Tasks</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Break your work into clear, manageable steps.
          </p>
        </div>
        <button
          className="primary-button shrink-0"
          onClick={() => setFormTask({ mode: "create" })}
          type="button"
        >
          <Plus aria-hidden="true" size={18} />
          New task
        </button>
      </div>

      <section aria-label="Task filters" className="space-y-3">
        <label className="search-field">
          <Search
            aria-hidden="true"
            className="shrink-0 text-muted"
            size={18}
          />
          <span className="sr-only">Search tasks</span>
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tasks, descriptions, tags, or projects..."
            value={query}
          />
        </label>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <label className="filter-select">
            <span className="sr-only">Filter tasks by completion</span>
            <select
              className="filter-control w-[calc(100%+1.5rem)] sm:w-auto"
              onChange={(event) => {
                const next = new URLSearchParams(searchParams);
                if (event.target.value === "All") next.delete("status");
                else next.set("status", event.target.value);
                setSearchParams(next);
              }}
              value={completionFilter}
            >
              <option value="All">All tasks</option>
              <option value="Open">Open</option>
              <option value="Completed">Completed</option>
            </select>
          </label>
          <label className="filter-select">
            <span className="sr-only">Filter tasks by priority</span>
            <select
              className="filter-control w-[calc(100%+1.5rem)] sm:w-auto"
              onChange={(event) =>
                setSearchParams((current) => {
                  const next = new URLSearchParams(current);
                  if (event.target.value === "All") next.delete("priority");
                  else next.set("priority", event.target.value);
                  return next;
                })
              }
              value={priorityFilter}
            >
              <option value="All">All priorities</option>
              {TASK_PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {priority} priority
                </option>
              ))}
            </select>
          </label>
          <label className="filter-select min-w-0 w-full sm:w-64">
            <span className="sr-only">Filter tasks by project</span>
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
              <option value="unassigned">No project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>
          {(query ||
            completionFilter !== "All" ||
            priorityFilter !== "All" ||
            projectFilter !== "All" ||
            dueFilter) && (
            <button
              className="secondary-button"
              onClick={clearFilters}
              type="button"
            >
              Clear filters
            </button>
          )}
        </div>
        {dueFilter && (
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 py-1 pl-3 pr-1.5 text-xs font-medium text-accent">
            <CalendarClock aria-hidden="true" size={14} />
            <span>Due in next 7 days</span>
            <button
              aria-label="Remove due date filter"
              className="icon-button size-7 border-transparent bg-transparent text-accent hover:text-foreground"
              onClick={() =>
                setSearchParams((current) => {
                  const next = new URLSearchParams(current);
                  next.delete("due");
                  return next;
                })
              }
              type="button"
            >
              <X aria-hidden="true" size={14} />
            </button>
          </div>
        )}
      </section>

      <div className="content-card p-0">
        <AnimatePresence mode="wait">
          {filteredTasks.length === 0 ? (
            <EmptyState
              action={{
                icon: tasks.length === 0 ? Plus : undefined,
                label: tasks.length === 0 ? "Create task" : "Clear filters",
                onClick:
                  tasks.length === 0
                    ? () => setFormTask({ mode: "create" })
                    : clearFilters,
                primary: tasks.length === 0,
              }}
              className="empty-state border-0"
              description={
                tasks.length === 0
                  ? "Add a task to capture your next step."
                  : "Try another search or clear some filters."
              }
              icon={ListTodo}
              key="tasks-empty"
              title={tasks.length === 0 ? "No tasks yet" : "No tasks found"}
            />
          ) : (
            <motion.div
              className="divide-y divide-border"
              animate={listMotion.animate}
              exit={{ opacity: 0 }}
              initial={listMotion.initial}
              key="tasks-results"
              onViewportEnter={listMotion.onViewportEnter}
              viewport={listMotion.viewport}
              variants={listMotion.containerVariants}
            >
              <div className="px-5 py-3 text-xs text-muted">
                Showing {filteredTasks.length} of {tasks.length} task
                {tasks.length === 1 ? "" : "s"}
              </div>
              <AnimatePresence mode="popLayout">
                {filteredTasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    onDelete={() => setPendingDelete(task)}
                    onEdit={() => setFormTask({ mode: "edit", item: task })}
                    onView={() => setViewTask(task)}
                    onToggle={() => {
                      if (toggleTask(task.id)) {
                        addToast(
                          task.completed ? "Task reopened." : "Task completed.",
                        );
                      }
                    }}
                    project={projects.find(
                      (project) => project.id === task.projectId,
                    )}
                    task={task}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {formTask.mode !== "closed" && (
        <TaskFormModal
          onClose={() => setFormTask({ mode: "closed" })}
          onSave={saveTask}
          projects={projects}
          task={formTask.mode === "edit" ? formTask.item : undefined}
        />
      )}
      {viewTask && (
        <TaskDetailsModal
          projects={projects}
          task={viewTask}
          onClose={() => setViewTask(null)}
          onEdit={() => {
            setFormTask({ mode: "edit", item: viewTask });
            setViewTask(null);
          }}
        />
      )}
      {pendingDelete && (
        <ConfirmDialog
          description={`"${pendingDelete.title}" will be permanently removed from your tasks.`}
          onCancel={() => setPendingDelete(null)}
          onConfirm={confirmDelete}
          title="Delete task?"
        />
      )}
    </section>
  );
}
