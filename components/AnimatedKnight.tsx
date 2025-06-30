// components/AnimatedKnight.tsx
"use client";

export function AnimatedKnight({
  row,
  col,
  cellSize,
  moving,
  moveNum,
  isChessMode,
}: {
  row: number;
  col: number;
  cellSize: number;
  moving: boolean;
  moveNum: number;
  isChessMode: boolean;
}) {
  // Icon & number color: always black in Normal mode; else contrast
  // In Normal mode the knight is always black; in Chess mode contrast with the square
  const iconColor = !isChessMode
    ? "#000"
    : (row + col) % 2 === 0
    ? "var(--foreground)"
    : "var(--background)";

  const numColor = !isChessMode ? "#000" : iconColor;

  return (
    <div
      className="absolute z-30 pointer-events-none select-none transition-all duration-700 ease-[cubic-bezier(.62,-0.15,.55,1.4)]"
      style={{
        top: `${row * cellSize}px`,
        left: `${col * cellSize}px`,
        width: `${cellSize}px`,
        height: `${cellSize}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className={
          "relative flex flex-col items-center justify-center w-full h-full " +
          (moving ? "animate-jump" : "")
        }
      >
        <span
          className="text-6xl drop-shadow-2xl"
          style={{
            color: iconColor,
            display: "block",
          }}
        >
          ♞
        </span>
        {moveNum > 0 && (
          <span
            className="text-2xl font-extrabold -mt-2 drop-shadow-md leading-none"
            style={{ color: numColor }}
          >
            {moveNum}
          </span>
        )}
      </div>
    </div>
  );
}
