"use client";

interface SquareProps {
  isKnight: boolean;
  moveNum: number;
  isVisited: boolean;
  isValidMove: boolean;
  cellEffect: string;
  onClick: () => void;
  disabled: boolean;
}

export default function Square({
  isKnight,
  moveNum,
  isVisited,
  isValidMove,
  cellEffect,
  onClick,
  disabled,
}: SquareProps) {
  const squareColor = isKnight
    ? "bg-[var(--primary)] shadow-2xl"
    : isVisited
    ? "bg-[var(--secondary)]/90"
    : "bg-[var(--surface)]";

  return (
    <button
      className={`
        relative w-[85px] h-[85px] rounded-xl border border-[var(--primary)]/30 overflow-hidden
        flex flex-col items-center justify-center transition-all
        ${isValidMove ? "ring-2 ring-[var(--primary)]/80 z-10" : ""}
        ${squareColor}
        ${cellEffect}
      `}
      style={{
        transition: "background 0.18s, box-shadow 0.16s, transform 0.18s",
        boxShadow: isKnight ? "0 8px 36px #8b5cf647" : "",
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
