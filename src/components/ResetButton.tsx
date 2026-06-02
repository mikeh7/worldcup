// Bottom-right control that wipes the game and clears saved state.
// The circular arrow spins on hover to signal "restart".
export default function ResetButton({ onReset }: { onReset: () => void }) {
  return (
    <button className="reset-btn" title="Reset game" aria-label="Reset game" onClick={onReset}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M17.65 6.35A7.95 7.95 0 0 0 12 4a8 8 0 1 0 7.74 10h-2.08A6 6 0 1 1 12 6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
        />
      </svg>
    </button>
  );
}
