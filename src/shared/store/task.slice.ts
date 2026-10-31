import type { Task } from "../types/workspace";
import { createId } from "../lib/id";
import { appendActivity } from "./activity.slice";
import type { TaskSlice, WorkspaceDomainSliceFactory } from "./store.types";

export const createTaskSlice: WorkspaceDomainSliceFactory<TaskSlice> = (
  commitData,
  get,
) => ({
  addTask: (input) => {
    const now = new Date().toISOString();
    const task: Task = {
      ...input,
      id: createId(),
      completed: false,
      createdAt: now,
      updatedAt: now,
    };
    return commitData((current) =>
      appendActivity(
        { ...current, tasks: [task, ...current.tasks] },
        {
          type: "task_created",
          title: "Task created",
          description: task.title,
        },
      ),
    );
  },

  updateTask: (id, input) => {
    const task = get().tasks.find((item) => item.id === id);
    if (
      task &&
      task.title === input.title &&
      task.description === input.description &&
      task.priority === input.priority &&
      task.dueDate === input.dueDate &&
      task.projectId === input.projectId &&
      task.tags.length === input.tags.length &&
      task.tags.every((tag, index) => tag === input.tags[index])
    ) {
      return "unchanged";
    }

    if (!task) return "error";
    return commitData((current) => {
      const next = {
        ...current,
        tasks: current.tasks.map((item) =>
          item.id === id
            ? { ...item, ...input, updatedAt: new Date().toISOString() }
            : item,
        ),
      };
      return appendActivity(next, {
        type: "task_updated",
        title: "Task updated",
        description: input.title,
      });
    })
      ? "updated"
      : "error";
  },

  toggleTask: (id) => {
    const task = get().tasks.find((item) => item.id === id);
    if (!task) return false;
    const completed = !task.completed;
    return commitData((current) =>
      appendActivity(
        {
          ...current,
          tasks: current.tasks.map((item) =>
            item.id === id
              ? { ...item, completed, updatedAt: new Date().toISOString() }
              : item,
          ),
        },
        {
          type: completed ? "task_completed" : "task_reopened",
          title: completed ? "Task completed" : "Task reopened",
          description: task.title,
        },
      ),
    );
  },

  deleteTask: (id) => {
    const task = get().tasks.find((item) => item.id === id);
    return commitData((current) => {
      const next = {
        ...current,
        tasks: current.tasks.filter((item) => item.id !== id),
      };
      return task
        ? appendActivity(next, {
            type: "task_deleted",
            title: "Task deleted",
            description: task.title,
          })
        : next;
    });
  },
});
