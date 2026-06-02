import type { GameState } from "../game/types";
import { TEAM_LABELS } from "../game/teams";

export default function Scoreboard({ scores }: { scores: GameState["scores"] }) {
  return (
    <div className="scoreboard">
      <div className="scoreboard-title">Dream Teams</div>
      <div className="score-row score-llo">
        <span className="score-team">{TEAM_LABELS.LLO}</span>
        <span className="score-value">{scores.LLO}</span>
      </div>
      <div className="score-row score-bos">
        <span className="score-team">{TEAM_LABELS.BOS}</span>
        <span className="score-value">{scores.BOS}</span>
      </div>
    </div>
  );
}
