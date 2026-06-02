import type { TeamId } from "./types";

// A position on the pitch expressed as a percentage of the full pitch area.
export interface Slot {
  x: number; // 0..100 (left -> right across whole pitch)
  y: number; // 0..100 (top -> bottom)
}

// 4-4-2 laid out per half. Slot order: 0=GK, 1-4=DEF, 5-8=MID, 9-10=ST.
// LLO defends the left goal, BOS the right; both viewed from behind.
const ROWS_LLO = { gk: 6, def: 17, mid: 30, st: 42 };
const ROWS_BOS = { gk: 94, def: 83, mid: 70, st: 58 };

const DEF_Y = [18, 40, 60, 82];
const MID_Y = [18, 40, 60, 82];
const ST_Y = [38, 62];

export function formationFor(team: TeamId): Slot[] {
  const r = team === "LLO" ? ROWS_LLO : ROWS_BOS;
  return [
    { x: r.gk, y: 50 },
    ...DEF_Y.map((y) => ({ x: r.def, y })),
    ...MID_Y.map((y) => ({ x: r.mid, y })),
    ...ST_Y.map((y) => ({ x: r.st, y })),
  ];
}
