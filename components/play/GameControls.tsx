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
        className="px-4 py-1 rounded-md bg-[var(--primary)] text-white font-semibold hover:brightness-110"
        onClick={() => router.push("/")}
      >
        Home
      </button>
      <button
        className={`px-4 py-1 rounded-md bg-[var(--primary)] text-white font-semibold hover:brightness-110 ${
          undoDisabled ? "opacity-40 cursor-not-allowed" : ""
        }`}
        onClick={onUndo}
        disabled={undoDisabled || showingSolution || showVictory || showFailure}
        title="Undo"
      >
        Undo
      </button>
      <button
        className={`px-4 py-1 rounded-md bg-[var(--primary)] text-white font-semibold hover:brightness-110 ${
          redoDisabled ? "opacity-40 cursor-not-allowed" : ""
        }`}
        onClick={onRedo}
        disabled={redoDisabled || showingSolution || showVictory || showFailure}
        title="Redo"
      >
        Redo
      </button>
      {boardSize === 5 && (
        <button
          className="px-4 py-1 rounded-md bg-[var(--primary)] text-white font-semibold hover:brightness-110"
          disabled={showingSolution}
          onClick={onShowSolution}
        >
          Show Solution
        </button>
      )}
      <button
        className="px-4 py-1 rounded-md bg-[var(--secondary)] text-[#1a191f] font-semibold hover:brightness-110"
        onClick={onReset}
      >
        Reset
      </button>
    </div>
  );
}
