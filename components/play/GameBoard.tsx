"use client";

import { useEffect, useRef, useState } from "react";
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
    // eslint-disable-next-line
  }, [knightPos]);

  const boardPx = boardSize * cellSize;

  // Chessboard colors aligned with app theme
  const chessLight = "var(--background)";
  const chessDark = "var(--foreground)";

  return (
    <div
      className="relative rounded-3xl border-[2.5px] border-[var(--primary)]/30 flex justify-center items-center mx-8"
      style={{
        padding: 30,
        margin: 20,
        width: boardPx,
        height: boardPx,
        minWidth: boardPx,
        minHeight: boardPx,
        boxShadow:
          "0 4px 10px rgba(0,0,0,0.1), inset 0 0 8px rgba(255,255,255,0.1)",
      }}
    >
      {/* Grid */}
      <div
        className="grid relative"
        style={{
          gridTemplateColumns: `repeat(${boardSize}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${boardSize}, ${cellSize}px)`,
          gap: "0px", // No gap!
          zIndex: 1,
        }}
      >
        {Array.from({ length: boardSize }).map((_, row) =>
          Array.from({ length: boardSize }).map((_, col) => {
            let moveNum,
              isVisited,
              isKnight = false;
            if (showingSolution && solution) {
              const num = solution[row][col];
              moveNum = num <= solutionStep ? num : 0;
              isVisited = moveNum > 0;
            } else {
              moveNum = visited[row][col];
              isVisited = moveNum > 0;
              isKnight = knightPos?.row === row && knightPos?.col === col;
            }
            const isValidMove =
              !showingSolution &&
              !showVictory &&
              !showFailure &&
              validMoves.some((pos) => pos.row === row && pos.col === col);

            // Chessboard coloring: alternate by (row+col)%2
            const chessSquare = (row + col) % 2 === 0 ? chessLight : chessDark;

            return (
              <Square
                key={`${row}-${col}`}
                isKnight={knightPos?.row === row && knightPos?.col === col}
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
                isCurrent={knightPos?.row === row && knightPos?.col === col}
                cellEffect={""}
                squareColor={chessSquare}
              />
            );
          })
        )}
        {confetti && <ConfettiBurst particles={confettiParticles} />}
      </div>
      {/* Animated Knight on top */}
      {knightPos && (
        <AnimatedKnight
          row={knightPos.row}
          col={knightPos.col}
          cellSize={cellSize}
          moving={isMoving}
          moveNum={visited[knightPos.row][knightPos.col]}
        />
      )}
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
  );
}
