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
        className="text-[#635AA3] hover:underline font-semibold"
        onClick={() => router.push("/")}
      >
        Home
      </button>
      <button
        className={`text-[#635AA3] font-semibold hover:underline ${
          undoDisabled ? "opacity-40 cursor-not-allowed" : ""
        }`}
        onClick={onUndo}
        disabled={undoDisabled || showingSolution || showVictory || showFailure}
        title="Undo"
      >
        Undo
      </button>
      <button
        className={`text-[#635AA3] font-semibold hover:underline ${
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
          className="text-[#635AA3] hover:underline font-semibold"
          disabled={showingSolution}
          onClick={onShowSolution}
        >
          Show Solution
        </button>
      )}
      <button
        className="text-[#DAAB79] hover:underline font-semibold"
        onClick={onReset}
      >
        Reset
      </button>
    </div>
  );
}
