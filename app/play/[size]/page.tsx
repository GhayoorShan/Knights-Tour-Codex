"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import type { ConfettiParticle } from "@/components/ConfettiBurst";
import GameBoard, { type Position } from "@/components/play/GameBoard";
import GameControls from "@/components/play/GameControls";
import GameInfo from "@/components/play/GameInfo";

// Solution for 5x5 for animation
const SOLUTIONS: Record<number, number[][]> = {
  5: [
    [1, 20, 9, 14, 3],
    [10, 15, 2, 19, 24],
    [21, 8, 23, 4, 13],
    [16, 11, 6, 25, 18],
    [7, 22, 17, 12, 5],
  ],
};


function getKnightMoves(pos: Position, boardSize: number): Position[] {
  const moves = [
    { row: pos.row + 2, col: pos.col + 1 },
    { row: pos.row + 2, col: pos.col - 1 },
    { row: pos.row - 2, col: pos.col + 1 },
    { row: pos.row - 2, col: pos.col - 1 },
    { row: pos.row + 1, col: pos.col + 2 },
    { row: pos.row + 1, col: pos.col - 2 },
    { row: pos.row - 1, col: pos.col + 2 },
    { row: pos.row - 1, col: pos.col - 2 },
  ];
  return moves.filter(
    ({ row, col }) => row >= 0 && col >= 0 && row < boardSize && col < boardSize
  );
}


const CONFETTI_COLORS = [
  "#635AA3",
  "#DAAB79",
  "#fff",
  "#8d88be",
  "#e9798c",
  "#4CC9F0",
  "#fcbf49",
  "#4895ef",
];

export default function PlayPage() {
  const params = useParams<{ size: string }>();
  const router = useRouter();

  if (!params.size) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  const [rows, cols] = params.size.split("x").map((n) => parseInt(n, 10));
  const boardSize = rows;
  const CELL_SIZE = 85; // Medium-sized board

  // Game state
  const [knightPos, setKnightPos] = useState<Position | null>(null);
  const [visited, setVisited] = useState<number[][]>(
    Array.from({ length: boardSize }, () => Array(boardSize).fill(0))
  );
  const [moveCount, setMoveCount] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  // Undo/Redo
  const [undoStack, setUndoStack] = useState<
    { knight: Position | null; visited: number[][]; moveCount: number }[]
  >([]);
  const [redoStack, setRedoStack] = useState<
    { knight: Position | null; visited: number[][]; moveCount: number }[]
  >([]);

  // Animation & solution playback
  const [showingSolution, setShowingSolution] = useState(false);
  const [solutionStep, setSolutionStep] = useState(0);

  // Victory/failure state
  const [showVictory, setShowVictory] = useState(false);
  const [showFailure, setShowFailure] = useState(false);

  // Knight animation (CSS coordinate)
  const [knightAnim, setKnightAnim] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const animTimeout = useRef<NodeJS.Timeout | null>(null);

  // Confetti for win/fail
  const [confetti, setConfetti] = useState(false);
  const [confettiParticles, setConfettiParticles] = useState<
    ConfettiParticle[]
  >([]);

  // Valid moves for highlight
  let validMoves: Position[] = [];
  if (
    knightPos &&
    gameStarted &&
    !showVictory &&
    !showFailure &&
    !showingSolution
  ) {
    validMoves = getKnightMoves(knightPos, boardSize).filter(
      (pos) => visited[pos.row][pos.col] === 0
    );
  }

  // Win/fail checks
  const hasWon = visited.flat().every((num) => num > 0);
  const isStuck = gameStarted && !hasWon && validMoves.length === 0;

  // Undo/Redo
  function handleUndo() {
    if (undoStack.length === 0) return;
    const lastState = undoStack[undoStack.length - 1];
    setRedoStack((prev) => [
      ...prev.slice(-2),
      { knight: knightPos, visited: visited.map((arr) => [...arr]), moveCount },
    ]);
    setKnightAnim(knightPos);
    setTimeout(() => {
      setKnightPos(lastState.knight);
      setVisited(lastState.visited.map((arr) => [...arr]));
      setMoveCount(lastState.moveCount);
      setUndoStack((prev) => prev.slice(0, -1));
    }, 160);
  }

  function handleRedo() {
    if (redoStack.length === 0) return;
    const nextState = redoStack[redoStack.length - 1];
    setUndoStack((prev) => [
      ...prev.slice(-2),
      { knight: knightPos, visited: visited.map((arr) => [...arr]), moveCount },
    ]);
    setKnightAnim(nextState.knight);
    setTimeout(() => {
      setKnightPos(nextState.knight);
      setVisited(nextState.visited.map((arr) => [...arr]));
      setMoveCount(nextState.moveCount);
      setRedoStack((prev) => prev.slice(0, -1));
    }, 160);
  }

  // Moves (with animation)
  function handleSquareClick(row: number, col: number) {
    if (showingSolution || showVictory || showFailure) return;
    if (!gameStarted) {
      setUndoStack([]);
      setRedoStack([]);
      setKnightAnim(knightPos);
      setTimeout(() => {
        setKnightPos({ row, col });
        setVisited((prev) => {
          const copy = prev.map((arr) => [...arr]);
          copy[row][col] = 1;
          return copy;
        });
        setGameStarted(true);
        setMoveCount(1);
      }, 160);
    } else if (knightPos) {
      const validMoves = getKnightMoves(knightPos, boardSize).filter(
        (pos) => !visited[pos.row][pos.col]
      );
      const isValid = validMoves.some(
        (pos) => pos.row === row && pos.col === col
      );
      if (isValid) {
        setUndoStack((prev) => [
          ...prev.slice(-2),
          {
            knight: knightPos,
            visited: visited.map((arr) => [...arr]),
            moveCount,
          },
        ]);
        setRedoStack([]);
        setKnightAnim(knightPos);
        setTimeout(() => {
          setKnightPos({ row, col });
          setVisited((prev) => {
            const copy = prev.map((arr) => [...arr]);
            copy[row][col] = moveCount + 1;
            return copy;
          });
          setMoveCount((prev) => prev + 1);
        }, 160);
      }
    }
  }

  // Reset
  function handleReset() {
    setKnightPos(null);
    setVisited(
      Array.from({ length: boardSize }, () => Array(boardSize).fill(0))
    );
    setGameStarted(false);
    setMoveCount(0);
    setShowVictory(false);
    setShowFailure(false);
    setShowingSolution(false);
    setSolutionStep(0);
    setUndoStack([]);
    setRedoStack([]);
    setKnightAnim(null);
    setConfetti(false);
  }

  // Solution animation (showingSolution: true)
  useEffect(() => {
    if (showingSolution && boardSize === 5 && solutionStep <= 25) {
      const timeout = setTimeout(() => {
        setSolutionStep((prev) => prev + 1);
      }, 130);
      return () => clearTimeout(timeout);
    }
    if (showingSolution && solutionStep > 25) {
      setTimeout(() => setShowingSolution(false), 800);
    }
  }, [showingSolution, solutionStep, boardSize]);

  function handleShowSolution() {
    setShowingSolution(true);
    setSolutionStep(1);
    setKnightPos(null);
    setVisited(
      Array.from({ length: boardSize }, () => Array(boardSize).fill(0))
    );
    setGameStarted(false);
    setMoveCount(0);
    setShowVictory(false);
    setShowFailure(false);
    setUndoStack([]);
    setRedoStack([]);
    setKnightAnim(null);
    setConfetti(false);
  }

  // Animate knight for solution steps
  useEffect(() => {
    if (
      showingSolution &&
      boardSize === 5 &&
      solutionStep > 1 &&
      solutionStep <= 25
    ) {
      let nextKnight: Position | null = null;
      for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
          if (SOLUTIONS[5][i][j] === solutionStep) {
            nextKnight = { row: i, col: j };
          }
        }
      }
      setKnightAnim(knightPos);
      animTimeout.current && clearTimeout(animTimeout.current);
      animTimeout.current = setTimeout(() => {
        setKnightPos(nextKnight);
      }, 100);
    }
  }, [showingSolution, solutionStep, boardSize]);

  // Win/fail animations & confetti
  useEffect(() => {
    if ((hasWon && gameStarted && !showVictory) || (isStuck && !showFailure)) {
      setConfetti(true);
      const particles: ConfettiParticle[] = Array.from({ length: 32 }).map(
        (_, i) => ({
          left: 10 + i * 2.6 + (i % 3),
          width: 16 + (i % 8),
          height: 12 + (i % 5),
          color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          opacity: 0.72 + (i % 4) * 0.07,
          delay: (i % 8) * 0.07,
          rotate: (i * 11) % 360,
        })
      );
      setConfettiParticles(particles);
      if (hasWon) {
        setShowVictory(true);
        setTimeout(() => setShowVictory(false), 1500);
      }
      if (isStuck) {
        setShowFailure(true);
        setTimeout(() => setShowFailure(false), 900);
      }
      setTimeout(() => setConfetti(false), 1400);
    }
  }, [hasWon, gameStarted, showVictory, isStuck, showFailure]);


  // Render
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#e4dbe8] via-[#faf7ef] to-[#dfd2c2] flex flex-col items-center py-0">
      {/* Header / Banner */}
      <div className="w-full flex flex-col items-center bg-[#635AA3] text-white py-4 shadow-md mb-8">
        <div className="font-bold text-2xl sm:text-4xl tracking-tight">
          <span className="text-[#DAAB79] drop-shadow-xl">
            ♞ Knight's Tour Challenge
          </span>
        </div>
        <div className="mt-1 text-base opacity-85">
          Visit every square exactly once!
        </div>
      </div>
      <div className="flex flex-col items-center bg-white/95 rounded-3xl shadow-2xl p-6 sm:p-12 mt-2 max-w-fit border-[#e8e2d2] border-[2.5px]">
        {/* Controls */}
        <GameControls
          boardSize={boardSize}
          undoDisabled={undoStack.length === 0}
          redoDisabled={redoStack.length === 0}
          showingSolution={showingSolution}
          showVictory={showVictory}
          showFailure={showFailure}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onShowSolution={handleShowSolution}
          onReset={handleReset}
        />
        {/* Board */}
        <GameBoard
          boardSize={boardSize}
          cellSize={CELL_SIZE}
          visited={visited}
          knightPos={knightPos}
          showingSolution={showingSolution}
          solution={boardSize === 5 ? SOLUTIONS[5] : undefined}
          solutionStep={solutionStep}
          validMoves={validMoves}
          showVictory={showVictory}
          showFailure={showFailure}
          confetti={confetti}
          confettiParticles={confettiParticles}
          onSquareClick={handleSquareClick}
        />
        {/* Info text */}
        <GameInfo
          showVictory={showVictory}
          showFailure={showFailure}
          gameStarted={gameStarted}
          moveCount={moveCount}
          boardSize={boardSize}
        />
      </div>
      {/* Animations */}
      <style>
        {`
        @keyframes victorypop {
          0% { transform: scale(0.8) rotate(-8deg); background: #ffe19f; }
          50% { transform: scale(1.12) rotate(6deg); background: #e1ffd4; }
          100% { transform: scale(1) rotate(0);}
        }
        .animate-[victorypop_0.4s] {
          animation: victorypop 0.38s;
        }
      @keyframes failshake { ... }
.animate-[failshake_0.4s], .animate-failshake {
  animation: failshake 0.38s;
}

        .animate-[failshake_0.4s], .animate-failshake {
          animation: failshake 0.38s;
        }
        @keyframes winpop {
          0%   { transform: scale(0.5) rotate(-14deg);}
          45%  { transform: scale(1.2) rotate(13deg);}
          90%  { transform: scale(0.92);}
          100% { transform: scale(1);}
        }
        .animate-winpop { animation: winpop 1.18s;}
        @keyframes hopknight {
          0% { transform: translateY(0) scale(1); filter: drop-shadow(0 1px 16px #b9a6f9aa);}
          32% { transform: translateY(-18px) scale(1.12); filter: drop-shadow(0 8px 22px #7267c6);}
          80% { transform: translateY(1px) scale(1.04);}
          100% { transform: translateY(0) scale(1);}
        }
        .animate-hopknight { animation: hopknight 0.16s;}
        `}
      </style>
    </main>
  );
}
