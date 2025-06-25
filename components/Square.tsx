"use client";

interface SquareProps {
  row: number;
  col: number;
  isKnight: boolean;
  moveNum: number;
  isVisited: boolean;
  isValidMove: boolean;
  cellEffect: string;
  onClick: () => void;
  disabled: boolean;
}

export default function Square({
  row,
  col,
  isKnight,
  moveNum,
  isVisited,
  isValidMove,
  cellEffect,
  onClick,
  disabled,
}: SquareProps) {
  const baseColor =
    (row + col) % 2 === 0
      ? "bg-[var(--board-light)]"
      : "bg-[var(--board-dark)]";
  const squareColor = isKnight
    ? "bg-[var(--primary)] shadow-md"
    : isVisited
    ? "bg-[var(--secondary)]"
    : baseColor;

  return (
    <button
      className={`
        relative w-[85px] h-[85px] rounded-xl border border-[var(--primary)]/30 overflow-hidden
        flex flex-col items-center justify-center transition-all hover:scale-[1.04]
        before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none before:shadow-[inset_0_0_4px_rgba(255,255,255,0.5)]
        ${isValidMove ? "ring-2 ring-[var(--primary)]/80 z-10 animate-highlight" : ""}
        ${squareColor}
        ${cellEffect}
      `}
      style={{
        transition: "background 0.18s, box-shadow 0.16s, transform 0.18s",
        boxShadow: isKnight
          ? "0 8px 20px rgba(0,0,0,0.15)"
          : "0 4px 4px rgba(0,0,0,0.1)",
      }}
      tabIndex={0}
      onClick={onClick}
      disabled={disabled}
    >
      {isKnight ? (
        <span className="flex flex-col items-center justify-center z-30 animate-hopknight pointer-events-none select-none">

          <span className="text-white text-4xl drop-shadow-2xl leading-none">♞</span>
          <span className="text-[var(--secondary)] text-lg font-extrabold -mt-1 drop-shadow-md leading-none">

            {moveNum}
          </span>
        </span>
      ) : isVisited ? (

        <span className="text-[var(--background)] text-lg font-bold select-none">{moveNum}</span>

      ) : null}
    </button>
  );
}
