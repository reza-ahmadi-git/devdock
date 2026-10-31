import {
  DetailField,
  DetailsModal,
} from "../../../shared/components/DetailsModal";
import { learningStatusBadgeClasses } from "../../../shared/lib/badgeClasses";
import { formatDateTime } from "../../../shared/lib/date";
import type { LearningGoal } from "../../../shared/types/workspace";

type LearningGoalDetailsModalProps = {
  goal: LearningGoal;
  onClose: () => void;
  onEdit: () => void;
};

export function LearningGoalDetailsModal({
  goal,
  onClose,
  onEdit,
}: LearningGoalDetailsModalProps) {
  return (
    <DetailsModal onClose={onClose} onEdit={onEdit} title={goal.skill}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className={learningStatusBadgeClasses[goal.status]}>
          {goal.status}
        </span>
        <span className="text-sm font-semibold text-accent">
          {goal.progress}% complete
        </span>
      </div>
      <DetailField label="Notes" value={goal.notes || "No notes added."} />
      <div className="grid gap-4 sm:grid-cols-2">
        <DetailField label="Created" value={formatDateTime(goal.createdAt)} />
        <DetailField
          label="Last updated"
          value={formatDateTime(goal.updatedAt)}
        />
      </div>
    </DetailsModal>
  );
}
