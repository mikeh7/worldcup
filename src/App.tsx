import { useEffect, useReducer, useRef, useState } from "react";
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
import { initAudio, playVuvuzelas } from "./game/audio";
import { BALL_PEAK_MS, BALL_TOTAL_MS, RUN_MS, BANNER_MS, IDLE_MS } from "./game/timing";

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

  // During an idle window we re-run the runner animation on a random player.
  const [idleRunningId, setIdleRunningId] = useState<string | null>(null);
  const playersRef = useRef(state.players);
  playersRef.current = state.players;

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
          // Vuvuzela fanfare over the ambient crowd — winners only.
          if (incomingRef.current.player.isWinner) playVuvuzelas();
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
      // Winners' banner (and confetti) linger 50% longer.
      const last = state.players.find((p) => p.id === state.lastAddedId);
      const bannerMs = last?.isWinner ? Math.round(BANNER_MS * 1.5) : BANNER_MS;
      const t = setTimeout(() => {
        dispatch({ type: "CLEAR_LAST" });
        dispatch({ type: "SET_PHASE", phase: "NAME_ENTRY" });
      }, bannerMs);
      return () => clearTimeout(t);
    }
  }, [state.phase]);

  // Idle showcase: after IDLE_MS with no name entered, re-run the runner
  // animation on a random player, repeating until a new name is entered.
  useEffect(() => {
    if (state.phase !== "NAME_ENTRY") return;
    let stopped = false;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => {
      timers.push(window.setTimeout(fn, ms));
    };

    const runRandom = () => {
      if (stopped) return;
      const players = playersRef.current;
      if (players.length === 0) {
        later(runRandom, 3000); // nobody to animate yet — check again later
        return;
      }
      const pick = players[Math.floor(Math.random() * players.length)];
      setIdleRunningId(pick.id);
      later(() => {
        setIdleRunningId(null);
        later(runRandom, 1200); // brief pause, then animate another
      }, RUN_MS);
    };

    later(runRandom, IDLE_MS); // wait out the inactive window first
    return () => {
      stopped = true;
      timers.forEach((id) => window.clearTimeout(id));
      setIdleRunningId(null);
    };
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
              <PlayerSprite
                player={p}
                running={(isLast && state.phase === "RUNNING") || p.id === idleRunningId}
              />
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
