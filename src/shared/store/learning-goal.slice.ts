import type { ActivityType, LearningGoal } from "../types/workspace";
import { createId } from "../lib/id";
import { appendActivity } from "./activity.slice";
import type {
  LearningGoalSlice,
  WorkspaceDomainSliceFactory,
} from "./store.types";

export const createLearningGoalSlice: WorkspaceDomainSliceFactory<
  LearningGoalSlice
> = (commitData, get) => ({
  addLearningGoal: (input) => {
    const now = new Date().toISOString();
    const goal: LearningGoal = {
      ...input,
      id: createId(),
      createdAt: now,
      updatedAt: now,
    };
    return commitData((current) =>
      appendActivity(
        { ...current, learningGoals: [goal, ...current.learningGoals] },
        {
          type: "learning_created",
          title: "Learning goal added",
          description: goal.skill,
        },
      ),
    );
  },

  updateLearningGoal: (id, input) => {
    const previous = get().learningGoals.find((goal) => goal.id === id);
    if (
      previous &&
      previous.skill === input.skill &&
      previous.status === input.status &&
      previous.progress === input.progress &&
      previous.notes === input.notes
    ) {
      return "unchanged";
    }

    if (!previous) return "error";
    return commitData((current) => {
      const next = {
        ...current,
        learningGoals: current.learningGoals.map((goal) =>
          goal.id === id
            ? { ...goal, ...input, updatedAt: new Date().toISOString() }
            : goal,
        ),
      };
      // Keep completion milestones distinct while grouping other edits into one activity type.
      const type: ActivityType =
        input.status === "Completed" && previous.status !== "Completed"
          ? "learning_completed"
          : "learning_updated";
      return appendActivity(next, {
        type,
        title:
          type === "learning_completed"
            ? "Learning goal completed"
            : "Learning goal updated",
        description: `${input.skill}: ${input.progress}% · ${input.status}`,
      });
    })
      ? "updated"
      : "error";
  },

  deleteLearningGoal: (id) => {
    const goal = get().learningGoals.find((item) => item.id === id);
    return commitData((current) => {
      const next = {
        ...current,
        learningGoals: current.learningGoals.filter((item) => item.id !== id),
      };
      return goal
        ? appendActivity(next, {
            type: "learning_deleted",
            title: "Learning goal removed",
            description: goal.skill,
          })
        : next;
    });
  },
});
