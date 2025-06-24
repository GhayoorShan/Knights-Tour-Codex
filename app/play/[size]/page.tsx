"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import GameBoard from "@/components/play/GameBoard";
import GameControls from "@/components/play/GameControls";
import GameInfo from "@/components/play/GameInfo";
import UserNamePrompt from "@/components/play/UserNamePrompt";
import { useKnightsTour, SOLUTIONS } from "@/hooks/useKnightsTour";
import { useUser } from "@/hooks/useUser";

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
  const CELL_SIZE = 85;

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
      <style>
        {`
        @keyframes victorypop {
          0% { transform: scale(0.8) rotate(-8deg); background: #ffe19f; }
          50% { transform: scale(1.12) rotate(6deg); background: #e1ffd4; }
          100% { transform: scale(1) rotate(0);}
        }
        .animate-[victorypop_0.4s] { animation: victorypop 0.38s; }
        @keyframes failshake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-4px); }
          40%, 60% { transform: translateX(4px); }
        }
        .animate-[failshake_0.4s], .animate-failshake { animation: failshake 0.38s; }
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
