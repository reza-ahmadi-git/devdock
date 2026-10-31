import { AlertTriangle } from "lucide-react";
import { Modal } from "./Modal";

type ConfirmDialogProps = {
  title: string;
  description: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({
  confirmLabel = "Delete",
  description,
  onCancel,
  onConfirm,
  title,
}: ConfirmDialogProps) {
  return (
    <Modal onClose={onCancel} title={title}>
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-700 dark:text-red-400">
          <AlertTriangle aria-hidden="true" size={19} />
        </span>
        <p className="pt-1 text-sm leading-6 text-muted">{description}</p>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <button className="secondary-button" onClick={onCancel} type="button">
          Cancel
        </button>
        <button className="danger-button" onClick={onConfirm} type="button">
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
