"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { ConfettiParticle } from "@/components/ConfettiBurst";
import type { Position } from "@/components/play/GameBoard";
import type { User } from "./useUser";

// Example solutions (add more if needed)
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
  "#000000",
  "#444444",
  "#888888",
  "#bbbbbb",
  "#ffffff",
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

export function useKnightsTour(boardSize: number, user: User | null) {
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
  const animTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [confetti, setConfetti] = useState(false);
  const [confettiParticles, setConfettiParticles] = useState<ConfettiParticle[]>([]);

  // --- Attempts state ---
  const [attempts, setAttempts] = useState<number>(1); // defaults to 1 if not loaded

  // --- Timer for win time (seconds) ---
  const [startTime, setStartTime] = useState<number | null>(null);
  const [winTimeSeconds, setWinTimeSeconds] = useState<number>(0);

  const [runSaved, setRunSaved] = useState(false);

  // --- Increment attempts on first move ---
  async function incrementAttempt() {
    if (!user) return;
    let { data, error } = await supabase
      .from("attempts")
      .select("attempts")
      .eq("user_id", user.user_id)
      .eq("board_size", boardSize)
      .maybeSingle();

    if (!data) {
      const { data: insertData } = await supabase
        .from("attempts")
        .insert([{ user_id: user.user_id, board_size: boardSize, attempts: 1 }])
        .select()
        .single();
      setAttempts(1);
    } else {
      const { data: updateData } = await supabase
        .from("attempts")
        .update({ attempts: data.attempts + 1 })
        .eq("user_id", user.user_id)
        .eq("board_size", boardSize)
        .select()
        .single();
      setAttempts((updateData?.attempts ?? data.attempts + 1));
    }
  }

  // --- Call incrementAttempt on FIRST move ---
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
        setStartTime(Date.now());
        incrementAttempt();
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

  // --- Save completed run to leaderboard (call after win) ---
  async function saveRun() {
    if (!user || !hasWon) return;
    const finishTime = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
    setWinTimeSeconds(finishTime);
  
    await supabase.from("leaderboard").insert([
      {
        user_id: user.user_id,
        name: user.username,
        moves: moveCount,
        time_seconds: finishTime,
        board_size: boardSize,
        attempts: attempts, // This shows how many attempts needed to win THIS time
      },
    ]);
  
    // RESET attempts for this board size
    await supabase
      .from("attempts")
      .update({ attempts: 0 })   // or 1, up to you
      .eq("user_id", user.user_id)
      .eq("board_size", boardSize);
    setAttempts(0); // or setAttempts(1)
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
    setStartTime(null);
    setRunSaved(false); 
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
    if (boardSize === 5) {
      // Position knight on the first move of the predefined solution
      let start: Position | null = null;
      for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
          if (SOLUTIONS[5][i][j] === 1) {
            start = { row: i, col: j };
            break;
          }
        }
        if (start) break;
      }
      setKnightPos(start);
    } else {
      setKnightPos(null);
    }
    setVisited(Array.from({ length: boardSize }, () => Array(boardSize).fill(0)));
    setGameStarted(false);
    setMoveCount(0);
    setShowVictory(false);
    setShowFailure(false);
    setUndoStack([]);
    setRedoStack([]);
    setKnightAnim(null);
    setConfetti(false);
    setStartTime(null);
  }

  // --- Animate solution knight ---
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

  // --- Confetti and win/fail animations ---
  const hasWon = visited.flat().every((num) => num > 0);
  const validMoves: Position[] =
    knightPos && gameStarted && !showVictory && !showFailure && !showingSolution
      ? getKnightMoves(knightPos, boardSize).filter(
          (pos) => visited[pos.row][pos.col] === 0
        )
      : [];
  const isStuck = gameStarted && !hasWon && validMoves.length === 0;

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
        if (!runSaved) {
          saveRun();
          setRunSaved(true); // <--- prevents multiple saves!
        }
        setTimeout(() => setShowVictory(false), 1500);
      }
      if (isStuck) {
        setShowFailure(true);
        setTimeout(() => setShowFailure(false), 900);
      }
      setTimeout(() => setConfetti(false), 1400);
    }
  }, [hasWon, gameStarted, showVictory, isStuck, showFailure, runSaved, saveRun]);

  // --- When boardSize/user changes, load current attempts ---
  useEffect(() => {
    async function fetchAttempts() {
      if (!user) return;
      let { data } = await supabase
        .from("attempts")
        .select("attempts")
        .eq("user_id", user.user_id)
        .eq("board_size", boardSize)
        .single();
      setAttempts(data?.attempts || 1);
    }
    fetchAttempts();
    // eslint-disable-next-line
  }, [boardSize, user?.user_id]);

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
    attempts,
    winTimeSeconds,
    saveRun,
  };
}
