import { CSSProperties } from "react";
import type { Player as PlayerModel } from "../game/types";

interface Props {
  player: PlayerModel;
  running?: boolean;
  style?: CSSProperties;
  className?: string;
}

const SKIN = "#C8945F";
const SHORTS = "#111111";
const HAIR = "#0A0A0A";

// A footballer seen from behind: black hair, kit-coloured shirt, black shorts.
// The back of the shirt shows first name, surname and squad number.
export default function Player({ player, running, style, className }: Props) {
  const { kit } = player;
  return (
    <div className={`player ${running ? "is-running" : ""} ${className ?? ""}`} style={style}>
      <svg viewBox="0 0 140 230" width="100%" height="100%">
        {/* legs */}
        <g className="legs">
          <g className="leg leg-l">
            <rect x="54" y="182" width="14" height="34" rx="5" fill={SKIN} />
            <rect x="53" y="210" width="16" height="14" rx="3" fill={kit.secondary} />
          </g>
          <g className="leg leg-r">
            <rect x="72" y="182" width="14" height="34" rx="5" fill={SKIN} />
            <rect x="71" y="210" width="16" height="14" rx="3" fill={kit.secondary} />
          </g>
        </g>

        {/* shorts */}
        <rect x="46" y="150" width="48" height="38" rx="8" fill={SHORTS} />
        <rect x="69" y="150" width="2" height="38" fill="#000" />

        {/* arms */}
        <rect x="22" y="64" width="14" height="74" rx="7" fill={SKIN} />
        <rect x="104" y="64" width="14" height="74" rx="7" fill={SKIN} />

        {/* shirt body */}
        <path
          d="M44 60 Q70 50 96 60 L100 70 L100 150 Q70 158 40 150 L40 70 Z"
          fill={kit.primary}
          stroke="rgba(0,0,0,0.18)"
          strokeWidth="1.5"
        />
        {/* sleeves */}
        <path d="M44 60 L26 70 L34 96 L44 80 Z" fill={kit.primary} stroke={kit.secondary} strokeWidth="2" />
        <path d="M96 60 L114 70 L106 96 L96 80 Z" fill={kit.primary} stroke={kit.secondary} strokeWidth="2" />
        {/* collar */}
        <path d="M60 56 Q70 64 80 56" fill="none" stroke={kit.secondary} strokeWidth="4" />

        {/* head + hair */}
        <ellipse cx="70" cy="34" rx="19" ry="21" fill={HAIR} />
        <rect x="62" y="50" width="16" height="12" rx="4" fill={SKIN} />

        {/* back-of-shirt print */}
        <text x="70" y="84" className="shirt-name" textAnchor="middle" fill={kit.text}>
          {player.firstName.toUpperCase()}
        </text>
        <text x="70" y="103" className="shirt-surname" textAnchor="middle" fill={kit.text}>
          {player.surname.toUpperCase()}
        </text>
        <text x="70" y="142" className="shirt-number" textAnchor="middle" fill={kit.text}>
          {player.number}
        </text>
      </svg>
    </div>
  );
}
