import type { TeamId } from "./types";

// Display names shown on the scoreboard / banners.
export const TEAM_LABELS: Record<TeamId, string> = {
  LLO: "LLOYDS",
  BOS: "BOS",
};

// Brand colours used for the scoreboard rows and the welcome/winner banners.
export const TEAM_COLORS: Record<TeamId, string> = {
  LLO: "#006a4d", // Lloyds Bank green
  BOS: "#1a2a6c", // BOS blue
};
