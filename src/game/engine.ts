import { FOOTBALLERS } from "../data/footballers";
import { kitFor } from "../data/kits";
import {
  GameState,
  Player,
  TeamId,
  TEAM_SIZE,
  WINNER_ODDS,
  NUMBER_POOL_MIN,
  NUMBER_POOL_MAX,
} from "./types";

const TEAMS: TeamId[] = ["LLO", "BOS"];

let idCounter = 0;
function nextId(): string {
  idCounter += 1;
  return `p${idCounter}_${Date.now().toString(36)}`;
}

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickFootballer(players: Player[]) {
  const usedSurnames = new Set(players.map((p) => p.surname));
  const free = FOOTBALLERS.filter((f) => !usedSurnames.has(f.surname));
  return rand(free.length ? free : FOOTBALLERS);
}

/** 10% winner (number 1, repeatable). Otherwise a unique 2..22. Pool empty -> winner. */
function assignNumber(usedNumbers: number[]): { number: number; isWinner: boolean } {
  const available: number[] = [];
  for (let n = NUMBER_POOL_MIN; n <= NUMBER_POOL_MAX; n++) {
    if (!usedNumbers.includes(n)) available.push(n);
  }
  if (Math.random() < WINNER_ODDS || available.length === 0) {
    return { number: 1, isWinner: true };
  }
  return { number: rand(available), isWinner: false };
}

function teamCount(players: Player[], team: TeamId): number {
  return players.filter((p) => p.team === team).length;
}

/** Join the smaller team (random on a tie). */
function chooseTeam(players: Player[]): TeamId {
  const llo = teamCount(players, "LLO");
  const bos = teamCount(players, "BOS");
  if (llo < bos) return "LLO";
  if (bos < llo) return "BOS";
  return rand(TEAMS);
}

/** A random currently-empty slot (0..10) for the team; 0 is the goalie. */
function chooseSlot(players: Player[], team: TeamId): number {
  const taken = new Set(players.filter((p) => p.team === team).map((p) => p.slot));
  const free: number[] = [];
  for (let s = 0; s < TEAM_SIZE; s++) if (!taken.has(s)) free.push(s);
  return free.length ? rand(free) : 0;
}

export interface Incoming {
  player: Player;
  replacedId: string | null;
}

/**
 * Build the next player from an entered first name, against the current state.
 * If both teams are full, this targets a random existing player for replacement,
 * inheriting that player's team & slot and freeing their old number.
 */
export function createIncoming(state: GameState, firstName: string): Incoming {
  const full = state.players.length >= TEAM_SIZE * TEAMS.length;

  let replacedId: string | null = null;
  let team: TeamId;
  let slot: number;
  // Numbers available for assignment (exclude the replaced player's number later).
  let usedNumbers = state.usedNumbers;
  let playersForFootballer = state.players;

  if (full) {
    const target = rand(state.players);
    replacedId = target.id;
    team = target.team;
    slot = target.slot;
    // Free the replaced player's number and exclude them from surname collisions.
    usedNumbers = state.usedNumbers.filter((n) => n !== target.number);
    playersForFootballer = state.players.filter((p) => p.id !== target.id);
  } else {
    team = chooseTeam(state.players);
    slot = chooseSlot(state.players, team);
  }

  const footballer = pickFootballer(playersForFootballer);
  // Test hook: entering "test" always forces a winner so the win condition
  // can be demonstrated on demand.
  const forceWinner = firstName.trim().toLowerCase() === "test";
  const { number, isWinner } = forceWinner
    ? { number: 1, isWinner: true }
    : assignNumber(usedNumbers);

  const player: Player = {
    id: nextId(),
    firstName,
    surname: footballer.surname,
    country: footballer.country,
    kit: kitFor(footballer.country),
    number,
    isWinner,
    team,
    slot,
  };

  return { player, replacedId };
}

export function fullName(p: Player): string {
  return `${p.firstName} ${p.surname}`;
}
