import type { ClassValue } from "clsx";
import * as motion from "motion/react-client";
import { cn } from "../utils";

export default function Circle({ className }: { className: ClassValue }) {
  return (
    <motion.div
      className={cn("bg-accent-500 size-26 rounded-full", className)}
      whileTap={{ scale: 2 }}
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.4,
        scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
      }}
    ></motion.div>
  );
}
