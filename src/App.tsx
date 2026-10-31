import { MotionConfig } from "motion/react";
import { AppRoutes } from "./app/routes/AppRoutes";

function App() {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <AppRoutes />
    </MotionConfig>
  );
}

export default App;
