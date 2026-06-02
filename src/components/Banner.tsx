import { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import type { Player } from "../game/types";
import { fullName } from "../game/engine";
import { TEAM_COLORS } from "../game/teams";

// Confetti raining from the top of the screen.
function rainConfetti() {
  const end = Date.now() + 2500;
  const colors = ["#FFD700", "#FF4D4D", "#4D9BFF", "#4DFF88", "#FFFFFF"];
  (function frame() {
    confetti({
      particleCount: 6,
      startVelocity: 30,
      gravity: 0.9,
      ticks: 200,
      origin: { x: Math.random(), y: -0.1 },
      colors,
      scalar: 1.2,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

export default function Banner({ player }: { player: Player }) {
  const winner = player.isWinner;
  const teamColor = TEAM_COLORS[player.team];

  useEffect(() => {
    if (winner) rainConfetti();
  }, [winner, player.id]);

  return (
    <motion.div
      className="banner-layer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="banner-wrap"
        initial={{ y: -60, scale: 0.5 }}
        animate={{ y: 0, scale: 0.6 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
      >
        <div
          className={`banner ${winner ? "banner-winner" : "banner-welcome"}`}
          style={{ backgroundColor: teamColor }}
        >
          {winner ? (
            <>
              <div className="banner-main">WINNER</div>
              <div className="banner-sub">{fullName(player)}</div>
            </>
          ) : (
            <div className="banner-main">Welcome {fullName(player)}</div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
