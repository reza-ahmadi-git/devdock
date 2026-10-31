import { useReducedMotion, type Variants } from "motion/react";
import { useCallback, useState } from "react";

const listContainerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.035 },
  },
};

const listItemVariants: Variants = {
  hidden: { opacity: 0, y: 7 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.18, ease: "easeOut" },
  },
};

const reducedContainerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
};

const reducedItemVariants: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

const listViewport = { once: true, amount: "some" } as const;

export function useStaggerMotion() {
  const shouldReduceMotion = useReducedMotion() ?? false;

  return {
    containerVariants: shouldReduceMotion
      ? reducedContainerVariants
      : listContainerVariants,
    initial: shouldReduceMotion ? false : "hidden",
    itemVariants: shouldReduceMotion ? reducedItemVariants : listItemVariants,
    shouldReduceMotion,
  } as const;
}

export function useStaggerListMotion() {
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const motion = useStaggerMotion();
  const onViewportEnter = useCallback(() => setHasEnteredView(true), []);

  return {
    ...motion,
    animate: motion.shouldReduceMotion || hasEnteredView ? "visible" : "hidden",
    onViewportEnter,
    viewport: listViewport,
  } as const;
}
