import { BookOpenCheck, Pencil, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import type { Ref } from "react";
import { useStaggerMotion } from "../../../shared/hooks/useStaggerMotion";
import { learningStatusBadgeClasses } from "../../../shared/lib/badgeClasses";
import type { LearningGoal } from "../../../shared/types/workspace";

type LearningGoalCardProps = {
  goal: LearningGoal;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  ref?: Ref<HTMLElement>;
};

export function LearningGoalCard({
  goal,
  onDelete,
  onEdit,
  onView,
  ref,
}: LearningGoalCardProps) {
  const { itemVariants, shouldReduceMotion } = useStaggerMotion();

  return (
    <motion.article
      className="content-card cursor-pointer"
      exit={
        shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.99 }
      }
      layout={!shouldReduceMotion}
      variants={itemVariants}
      transition={{ duration: 0.18, ease: "easeOut" }}
      onClick={onView}
      whileHover={shouldReduceMotion ? undefined : { y: -2 }}
      ref={ref}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <BookOpenCheck aria-hidden="true" size={19} />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-foreground">
              <button
                className="block max-w-full truncate text-left hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                onClick={(event) => {
                  event.stopPropagation();
                  onView();
                }}
                type="button"
              >
                {goal.skill}
              </button>
            </h3>
            <span className={`${learningStatusBadgeClasses[goal.status]} mt-2`}>
              {goal.status}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            aria-label={`Edit ${goal.skill}`}
            className="icon-button size-9 border-transparent bg-transparent"
            onClick={(event) => {
              event.stopPropagation();
              onEdit();
            }}
            type="button"
          >
            <Pencil aria-hidden="true" size={16} />
          </button>
          <button
            aria-label={`Delete ${goal.skill}`}
            className="icon-button size-9 border-transparent bg-transparent hover:text-red-700 dark:hover:text-red-400"
            onClick={(event) => {
              event.stopPropagation();
              onDelete();
            }}
            type="button"
          >
            <Trash2 aria-hidden="true" size={16} />
          </button>
        </div>
      </div>
      <p className="mt-4 min-h-10 line-clamp-3 whitespace-pre-wrap text-sm leading-5 text-muted [overflow-wrap:anywhere]">
        {goal.notes || "No notes added."}
      </p>
      <p className="mt-3 border-t border-border pt-3 text-xs font-medium text-muted">
        Click to view learning details
      </p>
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-muted">Learning progress</span>
          <span className="font-semibold text-foreground">
            {goal.progress}%
          </span>
        </div>
        <div
          aria-label={`${goal.progress}% learning progress`}
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={goal.progress}
          className="h-2 overflow-hidden rounded-full bg-surface-raised"
          role="progressbar"
        >
          <div
            className="h-full rounded-full bg-accent transition-[width]"
            style={{ width: `${goal.progress}%` }}
          />
        </div>
      </div>
    </motion.article>
  );
}
