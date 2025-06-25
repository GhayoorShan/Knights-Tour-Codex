import Square from "@/components/Square";
import ConfettiBurst, {
  type ConfettiParticle,
} from "@/components/ConfettiBurst";

export type Position = { row: number; col: number };

interface GameBoardProps {
  boardSize: number;
  cellSize: number;
  visited: number[][];
  knightPos: Position | null;
  showingSolution: boolean;
  solution?: number[][];
  solutionStep: number;
  validMoves: Position[];
  showVictory: boolean;
  showFailure: boolean;
  confetti: boolean;
  confettiParticles: ConfettiParticle[];
  onSquareClick: (row: number, col: number) => void;
}

export default function GameBoard({
  boardSize,
  cellSize,
  visited,
  knightPos,
  showingSolution,
  solution,
  solutionStep,
  validMoves,
  showVictory,
  showFailure,
  confetti,
  confettiParticles,
  onSquareClick,
}: GameBoardProps) {
  return (
    <div
      className="relative rounded-3xl border-[2.5px] border-[var(--primary)]/30 bg-[var(--surface)] flex justify-center items-center"
      style={{
        padding: 22,
        margin: 8,
        minWidth: boardSize * (cellSize + 8),
        minHeight: boardSize * (cellSize + 8),
        position: "relative",
        boxShadow:
          "0 4px 10px rgba(0,0,0,0.1), inset 0 0 8px rgba(255,255,255,0.1)",
      }}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${boardSize}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${boardSize}, ${cellSize}px)`,
          gap: "8px",
          zIndex: 1,
        }}
      >
        {Array.from({ length: boardSize }).map((_, row) =>
          Array.from({ length: boardSize }).map((_, col) => {
            let isKnight, moveNum, isVisited;
            if (showingSolution && solution) {
              const num = solution[row][col];
              moveNum = num <= solutionStep ? num : 0;
              isVisited = moveNum > 0;
              isKnight = moveNum === solutionStep;
            } else {
              isKnight = knightPos?.row === row && knightPos?.col === col;
              moveNum = visited[row][col];
              isVisited = moveNum > 0;
            }
            const isValidMove =
              !showingSolution &&
              !showVictory &&
              !showFailure &&
              validMoves.some((pos) => pos.row === row && pos.col === col);
            let cellEffect = "";
            if (showVictory && isVisited)
              cellEffect = "animate-[victorypop_0.4s]";
            if (showFailure && !isVisited)
              cellEffect = "animate-[failshake_0.4s]";
            return (
              <Square
                key={`${row}-${col}`}
                isKnight={isKnight}
                moveNum={moveNum}
                isVisited={isVisited}
                isValidMove={isValidMove}
                cellEffect={cellEffect}
                onClick={() => onSquareClick(row, col)}
                disabled={
                  (isVisited && !isKnight) ||
                  showVictory ||
                  showFailure ||
                  showingSolution
                }
              />
            );
          })
        )}
        {confetti && <ConfettiBurst particles={confettiParticles} />}
        {showVictory && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
            <span className="text-6xl animate-winpop">🎉</span>
          </div>
        )}
        {showFailure && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
            <span className="text-5xl animate-failshake text-[var(--primary)]">
              😔
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
