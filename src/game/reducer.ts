import { GameState, Phase, Player } from "./types";
import type { Incoming } from "./engine";

export const initialState: GameState = {
  phase: "NAME_ENTRY",
  players: [],
  scores: { LLO: 0, BOS: 0 },
  usedNumbers: [],
  lastAddedId: null,
};

export type Action =
  | { type: "SET_PHASE"; phase: Phase }
  | { type: "COMMIT"; incoming: Incoming }
  | { type: "CLEAR_LAST" }
  | { type: "HYDRATE"; state: GameState }
  | { type: "RESET" };

function withNumber(used: number[], player: Player): number[] {
  // Only 2..22 are tracked for uniqueness; number 1 (winner) repeats freely.
  if (player.number === 1) return used;
  return used.includes(player.number) ? used : [...used, player.number];
}

export function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "SET_PHASE":
      return { ...state, phase: action.phase };

    case "COMMIT": {
      const { player, replacedId } = action.incoming;

      let players = state.players;
      let usedNumbers = state.usedNumbers;

      if (replacedId) {
        const replaced = players.find((p) => p.id === replacedId);
        // Free the replaced player's tracked number, then drop them.
        if (replaced && replaced.number !== 1) {
          usedNumbers = usedNumbers.filter((n) => n !== replaced.number);
        }
        players = players.filter((p) => p.id !== replacedId);
      }

      players = [...players, player];
      usedNumbers = withNumber(usedNumbers, player);

      const scores = player.isWinner
        ? { ...state.scores, [player.team]: state.scores[player.team] + 1 }
        : state.scores;

      return {
        ...state,
        players,
        usedNumbers,
        scores,
        lastAddedId: player.id,
      };
    }

    case "CLEAR_LAST":
      return { ...state, lastAddedId: null };

    case "HYDRATE":
      return action.state;

    case "RESET":
      return initialState;

    default:
      return state;
  }
}
