// Country -> football kit colours.
// primary  = main shirt fill
// secondary = collar / sleeve trim accent
// text     = colour of the name & number printed on the back
export interface Kit {
  primary: string;
  secondary: string;
  text: string;
}

export const KITS: Record<string, Kit> = {
  Argentina: { primary: "#75AADB", secondary: "#FFFFFF", text: "#0A1A2F" },
  Brazil: { primary: "#FFDF00", secondary: "#009C3B", text: "#002776" },
  Portugal: { primary: "#C8102E", secondary: "#006600", text: "#FFFFFF" },
  France: { primary: "#1A2A6C", secondary: "#FFFFFF", text: "#FFFFFF" },
  England: { primary: "#FFFFFF", secondary: "#CF081F", text: "#1A2A6C" },
  Spain: { primary: "#C60B1E", secondary: "#FFC400", text: "#FFC400" },
  Germany: { primary: "#FFFFFF", secondary: "#000000", text: "#000000" },
  Netherlands: { primary: "#FF6C00", secondary: "#FFFFFF", text: "#FFFFFF" },
  Belgium: { primary: "#E30613", secondary: "#000000", text: "#FFE936" },
  Italy: { primary: "#0066B3", secondary: "#FFFFFF", text: "#FFFFFF" },
  Uruguay: { primary: "#5CB3E8", secondary: "#000000", text: "#0A1A2F" },
  Croatia: { primary: "#FF0000", secondary: "#FFFFFF", text: "#FFFFFF" },
  Poland: { primary: "#FFFFFF", secondary: "#DC143C", text: "#DC143C" },
  Egypt: { primary: "#CE1126", secondary: "#FFFFFF", text: "#FFFFFF" },
  Norway: { primary: "#BA0C2F", secondary: "#00205B", text: "#FFFFFF" },
  Sweden: { primary: "#FECB00", secondary: "#005293", text: "#005293" },
  Wales: { primary: "#C8102E", secondary: "#00B140", text: "#FFFFFF" },
  Colombia: { primary: "#FCD116", secondary: "#003893", text: "#003893" },
  Senegal: { primary: "#00853F", secondary: "#FDEF42", text: "#FFFFFF" },
  Mexico: { primary: "#006847", secondary: "#FFFFFF", text: "#FFFFFF" },
};

// Fallback kit if a footballer's country somehow has no entry.
export const DEFAULT_KIT: Kit = { primary: "#444444", secondary: "#FFFFFF", text: "#FFFFFF" };

export function kitFor(country: string): Kit {
  return KITS[country] ?? DEFAULT_KIT;
}
