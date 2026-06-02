import { useEffect, useReducer, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import Pitch from "./components/Pitch";
import Scoreboard from "./components/Scoreboard";
import NameEntry from "./components/NameEntry";
import Ball from "./components/Ball";
import Banner from "./components/Banner";
import PlayerSprite from "./components/Player";
import ResetButton from "./components/ResetButton";
import { reducer, initialState } from "./game/reducer";
import { createIncoming, Incoming } from "./game/engine";
import { formationFor } from "./game/formation";
import { GameState } from "./game/types";
import { initAudio, playCheer } from "./game/audio";
import { BALL_PEAK_MS, BALL_TOTAL_MS, RUN_MS, BANNER_MS } from "./game/timing";

const STORAGE_KEY = "dream-team-state-v1";

function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const saved = JSON.parse(raw) as Partial<GameState>;
    return {
      ...initialState,
      players: saved.players ?? [],
      scores: saved.scores ?? { LLO: 0, BOS: 0 },
      usedNumbers: saved.usedNumbers ?? [],
    };
  } catch {
    return initialState;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);
  const incomingRef = useRef<Incoming | null>(null);
  const ballKeyRef = useRef(0);

  // Persist the durable parts of the game (not the transient phase/reveal).
  useEffect(() => {
    const { players, scores, usedNumbers } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ players, scores, usedNumbers }));
  }, [state.players, state.scores, state.usedNumbers]);

  // Drive the reveal sequence off the current phase.
  useEffect(() => {
    if (state.phase === "BALL") {
      const t1 = setTimeout(() => {
        if (incomingRef.current) {
          dispatch({ type: "COMMIT", incoming: incomingRef.current });
          // Crowd cheers for the whole reveal+running animation (louder for winners).
          const cheerMs = BALL_TOTAL_MS - BALL_PEAK_MS + RUN_MS;
          playCheer(cheerMs, incomingRef.current.player.isWinner ? 1.6 : 1);
        }
      }, BALL_PEAK_MS);
      const t2 = setTimeout(() => dispatch({ type: "SET_PHASE", phase: "RUNNING" }), BALL_TOTAL_MS);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
    if (state.phase === "RUNNING") {
      const t = setTimeout(() => dispatch({ type: "SET_PHASE", phase: "BANNER" }), RUN_MS);
      return () => clearTimeout(t);
    }
    if (state.phase === "BANNER") {
      const t = setTimeout(() => {
        dispatch({ type: "CLEAR_LAST" });
        dispatch({ type: "SET_PHASE", phase: "NAME_ENTRY" });
      }, BANNER_MS);
      return () => clearTimeout(t);
    }
  }, [state.phase]);

  function handleSubmit(name: string) {
    if (state.phase !== "NAME_ENTRY") return;
    initAudio(); // unlock/resume audio within this user gesture
    incomingRef.current = createIncoming(state, name);
    ballKeyRef.current += 1;
    dispatch({ type: "SET_PHASE", phase: "BALL" });
  }

  function handleReset() {
    incomingRef.current = null;
    localStorage.removeItem(STORAGE_KEY);
    dispatch({ type: "RESET" });
  }

  const lastAdded = state.players.find((p) => p.id === state.lastAddedId) ?? null;

  return (
    <div className="stage">
      <div className="pitch-area">
        <Pitch />

        {state.players.map((p) => {
          const pos = formationFor(p.team)[p.slot];
          const isLast = p.id === state.lastAddedId;
          return (
            <div
              key={p.id}
              className={`slot ${isLast ? "slot-active" : ""}`}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <PlayerSprite player={p} running={isLast && state.phase === "RUNNING"} />
            </div>
          );
        })}
      </div>

      <Scoreboard scores={state.scores} />

      {state.phase === "BALL" && <Ball playKey={ballKeyRef.current} />}

      <AnimatePresence>
        {(state.phase === "RUNNING" || state.phase === "BANNER") && lastAdded && (
          <Banner key={lastAdded.id} player={lastAdded} />
        )}
      </AnimatePresence>

      <NameEntry visible={state.phase === "NAME_ENTRY"} onSubmit={handleSubmit} />

      <ResetButton onReset={handleReset} />
    </div>
  );
}
