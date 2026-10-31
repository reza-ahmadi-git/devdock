import type { PropsWithChildren } from "react";
import { Pencil } from "lucide-react";
import { Modal } from "./Modal";

type DetailsModalProps = PropsWithChildren<{
  title: string;
  onClose: () => void;
  onEdit: () => void;
}>;

export function DetailsModal({
  children,
  onClose,
  onEdit,
  title,
}: DetailsModalProps) {
  return (
    <Modal onClose={onClose} title={title}>
      <div className="space-y-5">{children}</div>
      <div className="mt-6 flex justify-end">
        <button
          className="secondary-button"
          onClick={() => {
            onClose();
            onEdit();
          }}
          type="button"
        >
          <Pencil aria-hidden="true" size={16} />
          Edit
        </button>
      </div>
    </Modal>
  );
}

export function DetailField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-foreground [overflow-wrap:anywhere]">
        {value}
      </p>
    </div>
  );
}
