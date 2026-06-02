import { motion } from "framer-motion";
import { BALL_TOTAL_MS } from "../game/timing";

// A football that flies in from the left, swells to fill (and obscure) the
// screen at centre, then falls away off the right edge. Keyed remount restarts it.
export default function Ball({ playKey }: { playKey: number }) {
  return (
    <motion.div
      key={playKey}
      className="ball"
      initial={{ x: "-45vw", y: "0vh", scale: 0.5, opacity: 1 }}
      animate={{
        x: ["-45vw", "0vw", "70vw"],
        y: ["2vh", "-6vh", "55vh"],
        scale: [0.5, 9, 0.4],
        rotate: [0, 360, 900],
      }}
      transition={{ duration: BALL_TOTAL_MS / 1000, times: [0, 0.5, 1], ease: "easeInOut" }}
    >
      ⚽
    </motion.div>
  );
}
