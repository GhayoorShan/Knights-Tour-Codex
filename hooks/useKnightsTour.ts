import { useEffect, useRef, useState } from "react";
import type { ConfettiParticle } from "@/components/ConfettiBurst";
import type { Position } from "@/components/play/GameBoard";

export const SOLUTIONS: Record<number, number[][]> = {
  5: [
    [1, 20, 9, 14, 3],
    [10, 15, 2, 19, 24],
    [21, 8, 23, 4, 13],
    [16, 11, 6, 25, 18],
    [7, 22, 17, 12, 5],
  ],
};

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

export function useKnightsTour(boardSize: number) {
  const [knightPos, setKnightPos] = useState<Position | null>(null);
  const [visited, setVisited] = useState<number[][]>(
    Array.from({ length: boardSize }, () => Array(boardSize).fill(0))
  );
  const [moveCount, setMoveCount] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const [undoStack, setUndoStack] = useState<
    { knight: Position | null; visited: number[][]; moveCount: number }[]
  >([]);
  const [redoStack, setRedoStack] = useState<
    { knight: Position | null; visited: number[][]; moveCount: number }[]
  >([]);

  const [showingSolution, setShowingSolution] = useState(false);
  const [solutionStep, setSolutionStep] = useState(0);

  const [showVictory, setShowVictory] = useState(false);
  const [showFailure, setShowFailure] = useState(false);

  const [knightAnim, setKnightAnim] = useState<{ row: number; col: number } | null>(null);
  const animTimeout = useRef<NodeJS.Timeout | null>(null);

  const [confetti, setConfetti] = useState(false);
  const [confettiParticles, setConfettiParticles] = useState<ConfettiParticle[]>([]);

  let validMoves: Position[] = [];
  if (knightPos && gameStarted && !showVictory && !showFailure && !showingSolution) {
    validMoves = getKnightMoves(knightPos, boardSize).filter(
      (pos) => visited[pos.row][pos.col] === 0
    );
  }

  const hasWon = visited.flat().every((num) => num > 0);
  const isStuck = gameStarted && !hasWon && validMoves.length === 0;

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
      const isValid = validMoves.some((pos) => pos.row === row && pos.col === col);
      if (isValid) {
        setUndoStack((prev) => [
          ...prev.slice(-2),
          { knight: knightPos, visited: visited.map((arr) => [...arr]), moveCount },
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

  function handleReset() {
    setKnightPos(null);
    setVisited(Array.from({ length: boardSize }, () => Array(boardSize).fill(0)));
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
    setVisited(Array.from({ length: boardSize }, () => Array(boardSize).fill(0)));
    setGameStarted(false);
    setMoveCount(0);
    setShowVictory(false);
    setShowFailure(false);
    setUndoStack([]);
    setRedoStack([]);
    setKnightAnim(null);
    setConfetti(false);
  }

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
      if (animTimeout.current) clearTimeout(animTimeout.current);
      animTimeout.current = setTimeout(() => {
        setKnightPos(nextKnight);
      }, 100);
    }
  }, [showingSolution, solutionStep, boardSize]);

  useEffect(() => {
    if ((hasWon && gameStarted && !showVictory) || (isStuck && !showFailure)) {
      setConfetti(true);
      const particles: ConfettiParticle[] = Array.from({ length: 32 }).map((_, i) => ({
        left: 10 + i * 2.6 + (i % 3),
        width: 16 + (i % 8),
        height: 12 + (i % 5),
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        opacity: 0.72 + (i % 4) * 0.07,
        delay: (i % 8) * 0.07,
        rotate: (i * 11) % 360,
      }));
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

  return {
    knightPos,
    visited,
    moveCount,
    gameStarted,
    showingSolution,
    solutionStep,
    showVictory,
    showFailure,
    confetti,
    confettiParticles,
    validMoves,
    undoDisabled: undoStack.length === 0,
    redoDisabled: redoStack.length === 0,
    handleUndo,
    handleRedo,
    handleSquareClick,
    handleShowSolution,
    handleReset,
  };
}

