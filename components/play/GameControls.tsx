import { useRouter } from "next/navigation";

interface GameControlsProps {
  boardSize: number;
  undoDisabled: boolean;
  redoDisabled: boolean;
  showingSolution: boolean;
  showVictory: boolean;
  showFailure: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onShowSolution: () => void;
  onReset: () => void;
}

export default function GameControls({
  boardSize,
  undoDisabled,
  redoDisabled,
  showingSolution,
  showVictory,
  showFailure,
  onUndo,
  onRedo,
  onShowSolution,
  onReset,
}: GameControlsProps) {
  const router = useRouter();
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-1">
      <button
        // Changed bg to --surface, text to --foreground
        className="px-4 py-1 rounded-md bg-[var(--surface)] text-[var(--foreground)] font-semibold hover:brightness-90 transition-transform hover:scale-[1.04]"
        style={{
          boxShadow:
            "0 4px 10px rgba(0,0,0,0.1), inset 0 0 4px rgba(255,255,255,0.15)",
        }}
        onClick={() => router.push("/")}
      >
        Home
      </button>
      <button
        // Changed bg to --surface, text to --foreground
        className={`px-4 py-1 rounded-md bg-[var(--surface)] text-[var(--foreground)] font-semibold hover:brightness-90 transition-transform hover:scale-[1.04] ${
          undoDisabled ? "opacity-40 cursor-not-allowed" : ""
        }`}
        style={{
          boxShadow:
            "0 4px 10px rgba(0,0,0,0.1), inset 0 0 4px rgba(255,255,255,0.15)",
        }}
        onClick={onUndo}
        disabled={undoDisabled || showingSolution || showVictory || showFailure}
        title="Undo"
      >
        Undo
      </button>
      <button
        // Changed bg to --surface, text to --foreground
        className={`px-4 py-1 rounded-md bg-[var(--surface)] text-[var(--foreground)] font-semibold hover:brightness-90 transition-transform hover:scale-[1.04] ${
          redoDisabled ? "opacity-40 cursor-not-allowed" : ""
        }`}
        style={{
          boxShadow:
            "0 4px 10px rgba(0,0,0,0.1), inset 0 0 4px rgba(255,255,255,0.15)",
        }}
        onClick={onRedo}
        disabled={redoDisabled || showingSolution || showVictory || showFailure}
        title="Redo"
      >
        Redo
      </button>
      {boardSize === 5 && (
        <button
          // Changed bg to --surface, text to --foreground
          className="px-4 py-1 rounded-md bg-[var(--surface)] text-[var(--foreground)] font-semibold hover:brightness-90 transition-transform hover:scale-[1.04]"
          style={{
            boxShadow:
              "0 4px 10px rgba(0,0,0,0.1), inset 0 0 4px rgba(255,255,255,0.15)",
          }}
          disabled={showingSolution}
          onClick={onShowSolution}
        >
          Show Solution
        </button>
      )}
      <button
        // Changed bg to --secondary (which is grey), text to --background (white/black depending on theme for contrast)
        // Kept hover:brightness-110 for a slightly brighter grey on hover
        className="px-4 py-1 rounded-md bg-[var(--secondary)] text-[var(--background)] font-semibold hover:brightness-110 transition-transform hover:scale-[1.04]"
        style={{
          boxShadow:
            "0 4px 10px rgba(0,0,0,0.1), inset 0 0 4px rgba(255,255,255,0.15)",
        }}
        onClick={onReset}
      >
        Reset
      </button>
    </div>
  );
}
