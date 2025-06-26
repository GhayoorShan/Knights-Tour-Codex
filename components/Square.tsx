"use client";

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
        ${cellEffect}
      `}
      style={{
        background: squareColor,
        boxShadow: isCurrent
          ? "0 0 0 5px var(--primary), 0 0 16px 8px #fbbf2440"
          : isValidMove
          ? "inset 0 0 0 3px var(--secondary)"
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
            color:
              squareColor === "var(--foreground)"
                ? "var(--background)"
                : "var(--foreground)",
          }}
        >
          {moveNum}
        </span>
      )}
      {/* If isKnight, the knight+number will be absolutely overlayed */}
    </button>
  );
}
