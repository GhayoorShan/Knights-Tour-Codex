// components/Square.tsx
"use client";

interface SquareProps {
  isKnight: boolean;
  moveNum: number;
  isVisited: boolean;
  isValidMove: boolean;
  onClick: () => void;
  disabled: boolean;
  isCurrent: boolean;
  squareColor: string;
  isDestination: boolean;
  isChessMode: boolean;
}

export default function Square({
  isKnight,
  moveNum,
  isVisited,
  isValidMove,
  onClick,
  disabled,
  isCurrent,
  squareColor,
  isDestination,
  isChessMode,
}: SquareProps) {
  let finalBackgroundColor = "transparent";
  if (isDestination) {
    finalBackgroundColor = "var(--destination-color)";
  } else if (isChessMode) {
    finalBackgroundColor = squareColor;
  }

  // Add a border around each square in Normal mode
  const borderClass = isChessMode ? "" : "border border-[var(--secondary)]";

  // Font color: follow theme foreground in Normal mode; else contrast
  const numberColor = !isChessMode
    ? "#000"
    : squareColor === "var(--foreground)"
    ? "var(--background)"
    : "var(--foreground)";

  let boxShadow: string | undefined;
  if (isCurrent) {
    boxShadow =
      "-5px -5px 10px var(--uplift-shadow-top-left), 5px 5px 10px var(--uplift-shadow-bottom-right)";
  } else if (isValidMove && !isDestination) {
    boxShadow =
      "inset 0 0 0 2px var(--background), inset 0 0 0 4px var(--foreground)";
  }

  return (
    <button
      className={`
        relative
        w-full h-full
        rounded-none
        overflow-hidden
        flex flex-col items-center justify-center
        transition-transform
        hover:scale-[1.04]
        ${borderClass}
        $
      `}
      style={{
        background: finalBackgroundColor,
        boxShadow,
        transition: "background 0.18s, box-shadow 0.16s, transform 0.18s",
      }}
      onClick={onClick}
      disabled={disabled}
      tabIndex={0}
    >
      {!isKnight && isVisited && !isDestination && (
        <span
          className="text-xl font-bold select-none "
          style={{ color: numberColor }}
        >
          {moveNum > 0 ? moveNum : ""}
        </span>
      )}
    </button>
  );
}
