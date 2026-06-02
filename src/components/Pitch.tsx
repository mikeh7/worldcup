// Green pitch background with markings. Teams attack horizontally, so the
// halfway line is vertical with a centre circle, plus a penalty box each end.
export default function Pitch() {
  return (
    <svg className="pitch" viewBox="0 0 1000 600" preserveAspectRatio="none">
      <rect x="0" y="0" width="1000" height="600" fill="none" />
      {/* outer boundary */}
      <rect x="20" y="20" width="960" height="560" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="4" />
      {/* halfway line + centre circle */}
      <line x1="500" y1="20" x2="500" y2="580" stroke="rgba(255,255,255,0.7)" strokeWidth="4" />
      <circle cx="500" cy="300" r="80" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="4" />
      <circle cx="500" cy="300" r="6" fill="rgba(255,255,255,0.7)" />
      {/* left penalty area */}
      <rect x="20" y="170" width="130" height="260" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="4" />
      <rect x="20" y="240" width="55" height="120" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="4" />
      {/* right penalty area */}
      <rect x="850" y="170" width="130" height="260" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="4" />
      <rect x="925" y="240" width="55" height="120" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="4" />
    </svg>
  );
}
