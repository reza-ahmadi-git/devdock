import { AnimatePresence, motion } from "motion/react";

type FieldErrorProps = {
  id?: string;
  message?: string;
};

export function FieldError({ id, message }: FieldErrorProps) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.span
          animate={{ opacity: 1, y: 0 }}
          className="field-error"
          exit={{ opacity: 0, y: -3 }}
          id={id}
          initial={{ opacity: 0, y: -3 }}
          key={message}
          transition={{ duration: 0.16, ease: "easeOut" }}
        >
          {message}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
