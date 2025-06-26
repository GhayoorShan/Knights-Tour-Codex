"use client";

export function AnimatedKnight({
  row,
  col,
  cellSize,
  moving,
  moveNum,
}: {
  row: number;
  col: number;
  cellSize: number;
  moving: boolean;
  moveNum: number;
}) {
  return (
    <div
      className={`absolute z-30 pointer-events-none select-none transition-all duration-700 ease-[cubic-bezier(.62,-0.15,.55,1.4)]`}
      style={{
        top: row * cellSize,
        left: col * cellSize,
        width: cellSize,
        height: cellSize,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className={
          "flex flex-col items-center justify-center w-full h-full " +
          (moving ? "animate-jump" : "")
        }
      >
        <span className="text-white text-6xl drop-shadow-2xl leading-none">
          ♞
        </span>
        <span className="text-[var(--secondary)] text-2xl font-extrabold -mt-2 drop-shadow-md leading-none">
          {moveNum}
        </span>
      </div>
    </div>
  );
}
