import { BookOpenCheck, Plus, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { ConfirmDialog } from "../../../shared/components/ConfirmDialog";
import { EmptyState } from "../../../shared/components/EmptyState";
import { useStaggerListMotion } from "../../../shared/hooks/useStaggerMotion";
import { useWorkspaceStore } from "../../../shared/store/store";
import {
  LEARNING_STATUSES,
  type LearningGoal,
  type LearningStatus,
} from "../../../shared/types/workspace";
import { LearningGoalCard } from "./LearningGoalCard";
import { LearningGoalFormModal } from "./LearningGoalFormModal";
import { LearningGoalDetailsModal } from "./LearningGoalDetailsModal";

type LearningFilter = "All" | LearningStatus;
type LearningFormState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; item: LearningGoal };

export function LearningPage() {
  const {
    learningGoals,
    addLearningGoal,
    updateLearningGoal,
    deleteLearningGoal,
    addToast,
  } = useWorkspaceStore(
    useShallow((state) => ({
      learningGoals: state.learningGoals,
      addLearningGoal: state.addLearningGoal,
      updateLearningGoal: state.updateLearningGoal,
      deleteLearningGoal: state.deleteLearningGoal,
      addToast: state.addToast,
    })),
  );
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<LearningFilter>("All");
  const [formGoal, setFormGoal] = useState<LearningFormState>({
    mode: "closed",
  });
  const [pendingDelete, setPendingDelete] = useState<LearningGoal | null>(null);
  const [viewGoal, setViewGoal] = useState<LearningGoal | null>(null);
  const listMotion = useStaggerListMotion();

  const filteredGoals = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return learningGoals.filter((goal) => {
      const matchesSearch =
        !normalizedQuery ||
        goal.skill.toLowerCase().includes(normalizedQuery) ||
        goal.notes.toLowerCase().includes(normalizedQuery);
      return (
        matchesSearch &&
        (statusFilter === "All" || goal.status === statusFilter)
      );
    });
  }, [learningGoals, query, statusFilter]);

  function saveGoal(
    input: Pick<LearningGoal, "skill" | "status" | "progress" | "notes">,
  ) {
    if (formGoal.mode === "edit") {
      if (updateLearningGoal(formGoal.item.id, input) === "updated") {
        addToast("Learning goal updated.");
      }
    } else {
      if (addLearningGoal(input)) addToast("Learning goal added.");
    }
    setFormGoal({ mode: "closed" });
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    if (deleteLearningGoal(pendingDelete.id))
      addToast("Learning goal removed.");
    setPendingDelete(null);
  }

  return (
    <section className="space-y-7">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 flex items-center gap-2 text-sm font-medium text-accent">
            <BookOpenCheck aria-hidden="true" size={16} />
            Keep growing
          </p>
          <h2 className="page-title">Learning roadmap</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Track the skills you are learning and the progress you are making.
          </p>
        </div>
        <button
          className="primary-button shrink-0"
          onClick={() => setFormGoal({ mode: "create" })}
          type="button"
        >
          <Plus aria-hidden="true" size={18} />
          Add a skill
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="search-field flex-1">
          <Search
            aria-hidden="true"
            className="shrink-0 text-muted"
            size={18}
          />
          <span className="sr-only">Search learning goals</span>
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search skills or notes..."
            value={query}
          />
        </label>
        <label className="filter-select">
          <span className="sr-only">Filter learning goals by status</span>
          <select
            className="filter-control w-[calc(100%+1.5rem)] sm:w-auto"
            onChange={(event) =>
              setStatusFilter(event.target.value as LearningFilter)
            }
            value={statusFilter}
          >
            <option value="All">All statuses</option>
            {LEARNING_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </div>

      <AnimatePresence mode="wait">
        {filteredGoals.length === 0 ? (
          <EmptyState
            action={
              learningGoals.length === 0
                ? {
                    icon: Plus,
                    label: "Add a skill",
                    onClick: () => setFormGoal({ mode: "create" }),
                    primary: true,
                  }
                : undefined
            }
            description={
              learningGoals.length === 0
                ? "Add a skill you want to grow and start tracking your progress."
                : "Try another search or status filter."
            }
            icon={BookOpenCheck}
            key="learning-empty"
            title={
              learningGoals.length === 0
                ? "No learning goals yet"
                : "No learning goals found"
            }
          />
        ) : (
          <motion.div
            className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3"
            animate={listMotion.animate}
            exit={{ opacity: 0 }}
            initial={listMotion.initial}
            key="learning-grid"
            onViewportEnter={listMotion.onViewportEnter}
            viewport={listMotion.viewport}
            variants={listMotion.containerVariants}
          >
            <AnimatePresence mode="popLayout">
              {filteredGoals.map((goal) => (
                <LearningGoalCard
                  goal={goal}
                  key={goal.id}
                  onDelete={() => setPendingDelete(goal)}
                  onEdit={() => setFormGoal({ mode: "edit", item: goal })}
                  onView={() => setViewGoal(goal)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {formGoal.mode !== "closed" && (
        <LearningGoalFormModal
          goal={formGoal.mode === "edit" ? formGoal.item : undefined}
          onClose={() => setFormGoal({ mode: "closed" })}
          onSave={saveGoal}
        />
      )}
      {viewGoal && (
        <LearningGoalDetailsModal
          goal={viewGoal}
          onClose={() => setViewGoal(null)}
          onEdit={() => {
            setFormGoal({ mode: "edit", item: viewGoal });
            setViewGoal(null);
          }}
        />
      )}
      {pendingDelete && (
        <ConfirmDialog
          description={`"${pendingDelete.skill}" will be removed from your learning roadmap. This action cannot be undone.`}
          onCancel={() => setPendingDelete(null)}
          onConfirm={confirmDelete}
          title="Delete learning goal?"
        />
      )}
    </section>
  );
}
