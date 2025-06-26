// components/play/GameBoard.tsx
"use client";

import { useEffect, useState } from "react";
import Square from "@/components/Square";
import { AnimatedKnight } from "@/components/AnimatedKnight";
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
  const [prevPos, setPrevPos] = useState<Position | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [isChessMode, setIsChessMode] = useState(true);

  useEffect(() => {
    if (
      knightPos &&
      prevPos &&
      (knightPos.row !== prevPos.row || knightPos.col !== prevPos.col)
    ) {
      setIsMoving(true);
      const t = setTimeout(() => setIsMoving(false), 700);
      return () => clearTimeout(t);
    }
    setPrevPos(knightPos);
  }, [knightPos, prevPos]);

  const toggleBoardMode = () => {
    setIsChessMode((m) => !m);
  };

  const boardPx = boardSize * cellSize;
  const chessLight = "var(--background)";
  const chessDark = "var(--foreground)";

  return (
    <div
      className="relative rounded-3xl border-[2.5px] border-[var(--primary)]/30 flex flex-col items-center justify-center mx-8"
      style={{
        padding: 30,
        margin: 20,
        width: boardPx,
        height: boardPx + 70,
        minWidth: boardPx,
        minHeight: boardPx + 70,
        boxShadow:
          "0 4px 10px rgba(0,0,0,0.1), inset 0 0 8px rgba(255,255,255,0.1)",
      }}
    >
      {/* Mode toggle */}
      <div className="mb-4 flex items-center gap-3">
        <span className="text-[var(--foreground)] font-semibold text-sm">
          Normal Mode
        </span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isChessMode}
            onChange={toggleBoardMode}
          />
          <div className="w-11 h-6 bg-[var(--secondary)] rounded-full peer peer-focus:ring-2 peer-focus:ring-[var(--primary)] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
        </label>
        <span className="text-[var(--foreground)] font-semibold text-sm">
          Chess Mode
        </span>
      </div>

      {/* Board grid (this is now the positioning context for the knight) */}
      <div
        className={`grid relative ${
          !isChessMode ? "border border-[var(--secondary)]" : ""
        }`}
        style={{
          gridTemplateColumns: `repeat(${boardSize}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${boardSize}, ${cellSize}px)`,
          gap: "0px",
          zIndex: 1,
        }}
      >
        {Array.from({ length: boardSize }).map((_, row) =>
          Array.from({ length: boardSize }).map((_, col) => {
            let moveNum: number;
            let isVisited: boolean;
            if (showingSolution && solution) {
              const num = solution[row][col];
              moveNum = num <= solutionStep ? num : 0;
              isVisited = num > 0;
            } else {
              moveNum = visited[row][col];
              isVisited = moveNum > 0;
            }
            const isValidMove =
              !showingSolution &&
              !showVictory &&
              !showFailure &&
              validMoves.some((p) => p.row === row && p.col === col);
            const chessSquare = (row + col) % 2 === 0 ? chessLight : chessDark;

            return (
              <Square
                key={`${row}-${col}`}
                isKnight={
                  !showingSolution &&
                  knightPos?.row === row &&
                  knightPos?.col === col
                }
                moveNum={moveNum}
                isVisited={isVisited}
                isValidMove={isValidMove}
                onClick={() => onSquareClick(row, col)}
                disabled={
                  (isVisited && !knightPos) ||
                  showVictory ||
                  showFailure ||
                  showingSolution
                }
                isCurrent={
                  !showingSolution &&
                  knightPos?.row === row &&
                  knightPos?.col === col
                }
                squareColor={chessSquare}
                isDestination={isValidMove}
                isChessMode={isChessMode}
              />
            );
          })
        )}

        {confetti && <ConfettiBurst particles={confettiParticles} />}

        {/* <-- Animated knight sits here, inside the grid --> */}
        {!showingSolution && knightPos && (
          <AnimatedKnight
            row={knightPos.row}
            col={knightPos.col}
            cellSize={cellSize}
            moving={isMoving}
            moveNum={visited[knightPos.row][knightPos.col]}
            isChessMode={isChessMode}
          />
        )}
      </div>

      {/* Victory & failure overlays */}
      {showVictory && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
          <span className="text-6xl animate-winpop">🎉</span>
        </div>
      )}
      {showFailure && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
          <span className="text-5xl animate-failshake text-[var(--error-color)]">
            😔
          </span>
        </div>
      )}
    </div>
  );
}
