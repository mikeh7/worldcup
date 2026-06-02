import type { Kit } from "../data/kits";

export type TeamId = "LLO" | "BOS";

export type Phase = "NAME_ENTRY" | "BALL" | "RUNNING" | "BANNER";

export interface Player {
  id: string;
  firstName: string; // as entered (already sanitised, <=12 alpha)
  surname: string; // famous footballer surname
  country: string;
  kit: Kit;
  number: number; // 1 = winner (repeatable), else 2..22 (globally unique)
  isWinner: boolean;
  team: TeamId;
  slot: number; // 0 = goalie, 1..10 = outfield positions
}

export interface GameState {
  phase: Phase;
  players: Player[];
  scores: Record<TeamId, number>;
  usedNumbers: number[]; // the 2..22 numbers currently taken
  lastAddedId: string | null; // player currently being revealed / celebrated
}

export const NUMBER_POOL_MIN = 2;
export const NUMBER_POOL_MAX = 22;
export const TEAM_SIZE = 11;
export const WINNER_ODDS = 0.1;
