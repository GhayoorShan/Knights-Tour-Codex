"use client";
import { useEffect, useState } from "react";

interface SquareProps {
  isKnight: boolean;
  moveNum: number;
  isVisited: boolean;
  isValidMove: boolean;
  cellEffect: string;
  onClick: () => void;
  disabled: boolean;
  isCurrent: boolean;
  squareColor: string; // Add for direct color
}

export default function Square({
  isKnight,
  moveNum,
  isVisited,
  isValidMove,
  cellEffect,
  onClick,
  disabled,
  isCurrent,
  squareColor,
}: SquareProps) {
  // Handle one-time pulse for destinations
  const [pulseOnce, setPulseOnce] = useState(false);

  useEffect(() => {
    if (isValidMove) {
      setPulseOnce(true);
      const t = setTimeout(() => setPulseOnce(false), 700);
      return () => clearTimeout(t);
    } else {
      setPulseOnce(false);
    }
  }, [isValidMove]);

  return (
    <button
      className={`
        relative
        w-[90px] h-[90px]
        border-none
        rounded-none
        overflow-hidden
        flex flex-col items-center justify-center
        transition-transform
        hover:scale-[1.04]
        ${pulseOnce && !isKnight ? "animate-pulse-ring-once" : ""}
        ${cellEffect}
      `}
      style={{
        background: squareColor,
        boxShadow: isCurrent
          ? "0 0 0 5px var(--primary), 0 0 16px 8px #fbbf2440"
          : undefined,
        transition: "background 0.18s, box-shadow 0.16s, transform 0.18s",
      }}
      tabIndex={0}
      onClick={onClick}
      disabled={disabled}
    >
      {/* Only show moveNum if not knight */}
      {!isKnight && isVisited && (
        <span
          className="text-xl font-bold select-none"
          style={{
            color: squareColor === "#000000" ? "#ffffff" : "#000000",
          }}
        >
          {moveNum}
        </span>
      )}
      {/* If isKnight, the knight+number will be absolutely overlayed */}
    </button>
  );
}
