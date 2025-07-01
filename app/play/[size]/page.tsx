"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import GameBoard from "@/components/play/GameBoard";
import GameControls from "@/components/play/GameControls";
import GameInfo from "@/components/play/GameInfo";
import UserNamePrompt from "@/components/play/UserNamePrompt";
import { useKnightsTour, SOLUTIONS } from "@/hooks/useKnightsTour";
import { useUser } from "@/hooks/useUser";
import Link from "next/link";
import KnightExplorer from "@/components/KnightExplorer"; // This is your KnightExplorer

export default function PlayPage() {
  const params = useParams<{ size: string }>();
  const [usernamePrompt, setUsernamePrompt] = useState(false);
  const { user, setUsername } = useUser();

  useEffect(() => {
    if (!user || !user.username) setUsernamePrompt(true);
    else setUsernamePrompt(false);
  }, [user]);

  if (!params.size) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  const [rows, cols] = params.size.split("x").map((n) => parseInt(n, 10));
  const boardSize = rows;

  const [cellSize, setCellSize] = useState(85);
  useEffect(() => {
    function updateSize() {
      const w = window.innerWidth;
      if (w < 640) setCellSize(40);
      else if (w < 1024) setCellSize(70);
      else setCellSize(100);
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const {
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
    undoDisabled,
    redoDisabled,
    handleUndo,
    handleRedo,
    handleSquareClick,
    handleShowSolution,
    handleReset,
    attempts,
    winTimeSeconds,
    saveRun,
  } = useKnightsTour(boardSize, user);

  if (usernamePrompt) {
    return <UserNamePrompt onSave={(user) => setUsername(user.username)} />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[var(--surface)] to-[var(--background)] flex flex-col items-center py-0">
      {/* Header / Banner */}
      <div className="relative w-full flex flex-col items-center bg-[var(--primary)] text-[var(--background)] py-6 shadow-md mb-8 rounded-b-3xl">
        <div className="text-center flex flex-col items-center gap-1">
          <span className="font-bold text-2xl sm:text-4xl tracking-tight text-[var(--background)] drop-shadow-xl">
            ♞ Knight's Tour Challenge
          </span>
          <span className="mt-1 text-base sm:text-lg opacity-80 font-medium">
            Visit every square exactly once!
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-start gap-6 sm:gap-10">
        {/* Left: Game board and controls */}
        <div
          className="flex flex-col items-center bg-white/95 rounded-3xl p-6 sm:p-12 mt-2 max-w-fit border-[var(--foreground)]/20 border-[2.5px]"
          style={{
            boxShadow:
              "0 4px 10px rgba(0,0,0,0.1), inset 0 0 8px rgba(255,255,255,0.1)",
          }}
        >
          <GameControls
            boardSize={boardSize}
            undoDisabled={undoDisabled}
            redoDisabled={redoDisabled}
            showingSolution={showingSolution}
            showVictory={showVictory}
            showFailure={showFailure}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onShowSolution={handleShowSolution}
            onReset={handleReset}
          />
          <GameBoard
            boardSize={boardSize}
            cellSize={cellSize}
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
          <GameInfo
            showVictory={showVictory}
            showFailure={showFailure}
            gameStarted={gameStarted}
            moveCount={moveCount}
            boardSize={boardSize}
            attempts={attempts}
            user={user}
            winTimeSeconds={winTimeSeconds}
          />
        </div>
        {/* Right: Tutorial */}
        <div className="flex flex-col gap-5 mt-4">
          <Link
            href="/leaderboard"
            className=" bg-[var(--surface)] text-[var(--foreground)] font-semibold px-5 py-2 rounded-xl shadow-md hover:brightness-110 transition text-base sm:text-lg hover:scale-[1.04]"
            style={{
              minWidth: 140,
              textAlign: "center",
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.2)",
            }}
          >
            🏆 Leaderboard
          </Link>
          <KnightExplorer />
        </div>
      </div>
    </main>
  );
}
