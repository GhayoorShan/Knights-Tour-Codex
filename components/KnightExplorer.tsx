"use client";
import React, { useEffect, useRef, useState } from "react";

// === Config ===
const CELL = 90;
const GRID = 3;
const START: [number, number] = [0, 0];
const OFFSETS: [number, number][] = [
  [2, 1],
  [1, 2],
  [-1, 2],
  [-2, 1],
  [-2, -1],
  [-1, -2],
  [1, -2],
  [2, -1],
];

// CHESS COLORS
const CHESS_LIGHT = "#fff";
const CHESS_DARK = "#000";

// Timings
const PREVIEW_MS = 1800;
const LEG_MS = 600;
const CYCLES = 3;

// Knight SVG (classic)
const KnightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (p) => (
  <svg viewBox="0 0 448 512" fill="currentColor" {...p}>
    <path d="M96 48L82.7 61.3C57.4 86.6 48 120.9 48 156.2V256v32.5c0 14.3-7.5 27.5-19.8 34.9L5.9 342.1c-5.5 3.3-5.5 11.2 0 14.5L28.2 369c6.1 3.6 13.5 3.6 19.7 0l1.2-.7c14.1-8.2 32.4-13.4 51-13.4H144c17.7 0 32 14.3 32 32s-14.3 32-32 32H80c-26.5 0-48 21.5-48 48s21.5 48 48 48h64c8.8 0 16-7.2 16-16s-7.2-16-16-16H83.8c-2.4-15.3 6.2-30.4 20.4-38.3s31.3-6.2 43.8 5.7L192 480l32-128-48.9-122.3c-12.5-31.2-3.8-67.5 22.7-88.6L288 64l16-64L224 0l-16 64-48-48-32 32zm224 64h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H320c-17.7 0-32-14.3-32-32s14.3-32 32-32z" />
  </svg>
);

const legalMoves = ([r, c]: [number, number]) =>
  OFFSETS.map(([dr, dc]) => [r + dr, c + dc] as [number, number]).filter(
    ([nr, nc]) => nr >= 0 && nr < GRID && nc >= 0 && nc < GRID
  );
const midPoint = (
  [sr, sc]: [number, number],
  [er, ec]: [number, number]
): [number, number] => (Math.abs(er - sr) === 2 ? [er, sc] : [sr, ec]);
const center = ([r, c]: [number, number]) => ({
  x: c * CELL + CELL / 2,
  y: r * CELL + CELL / 2,
});

export default function TutorialKnightMoves() {
  const [pos, setPos] = useState<[number, number]>(START);
  const [stepMs, setStepMs] = useState(0);
  const [previewLines, setPreviewLines] = useState<string[]>([]);
  const [previewTargets, setPreviewTargets] = useState<[number, number][]>([]);
  const [pathLine, setPathLine] = useState<string | null>(null);
  const [landing, setLanding] = useState<[number, number] | null>(null);
  const [finished, setFinished] = useState(false);
  const [jumping, setJumping] = useState(false);
  const [animating, setAnimating] = useState(true);

  const cycleRef = useRef(0);
  const timers = useRef<NodeJS.Timeout[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  // Animation logic
  const runCycle = (current: [number, number]) => {
    if (cycleRef.current >= CYCLES) {
      setFinished(true);
      setAnimating(false);
      return;
    }
    setAnimating(true);
    const moves = legalMoves(current);
    setPreviewTargets(moves);

    // SVG lines: L-shaped
    const previews = moves.map((tgt) => {
      const mid = midPoint(current, tgt);
      const a = center(current);
      const b = center(mid);
      const c = center(tgt);
      return `M ${a.x} ${a.y} L ${b.x} ${b.y} L ${c.x} ${c.y}`;
    });
    setPreviewLines(previews);
    setPathLine(null);
    setLanding(null);
    setJumping(false);

    const t1 = setTimeout(() => {
      if (moves.length === 0) {
        cycleRef.current = CYCLES;
        setPreviewLines([]);
        setAnimating(false);
        setFinished(true);
        return;
      }
      const idx = Math.floor(Math.random() * moves.length);
      const target = moves[idx];
      const mid = midPoint(current, target);
      setPreviewLines([]);
      setPreviewTargets([]);
      setPathLine(previews[idx]);
      setJumping(true);

      setStepMs(LEG_MS);
      setPos(mid);
      const tMid = setTimeout(() => {
        setStepMs(LEG_MS);
        setPos(target);
        setLanding(target);
        setTimeout(() => setLanding(null), LEG_MS);
        setJumping(false);
        const tEnd = setTimeout(() => {
          setPathLine(null);
          cycleRef.current += 1;
          runCycle(target);
        }, LEG_MS + 80);
        timers.current.push(tEnd);
      }, LEG_MS);
      timers.current.push(tMid);
    }, PREVIEW_MS);
    timers.current.push(t1);
  };

  useEffect(() => {
    runCycle(START);
    return () => clearTimers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const replay = () => {
    clearTimers();
    cycleRef.current = 0;
    setFinished(false);
    setPos(START);
    setStepMs(0);
    setPreviewLines([]);
    setPreviewTargets([]);
    setPathLine(null);
    setLanding(null);
    setJumping(false);
    setAnimating(true);
    runCycle(START);
  };

  return (
    <div
      className="flex flex-col items-center gap-4 p-5 rounded-2xl shadow-xl select-none min-w-[330px]"
      style={{
        background: "#222", // or keep your theme color
        color: "#fff",
        border: `1.5px solid #b5886390`,
        boxShadow: `0 4px 16px #b5886360`,
      }}
    >
      <div
        className="text-base font-semibold mb-2"
        style={{ color: "#b58863" }}
      >
        How does the Knight move?
      </div>
      {/* Board */}
      <div
        className="relative rounded-lg overflow-hidden"
        style={{
          width: CELL * GRID,
          height: CELL * GRID,
          border: `2.5px solid #b5886370`,
        }}
      >
        {/* squares */}
        <div
          className="grid"
          style={{ gridTemplateColumns: `repeat(${GRID}, ${CELL}px)` }}
        >
          {Array.from({ length: GRID * GRID }).map((_, idx) => {
            const r = ~~(idx / GRID);
            const c = idx % GRID;
            const even = (r + c) % 2 === 0;
            const isPreview = previewTargets.some(
              ([rr, cc]) => rr === r && cc === c
            );
            const isLanding = landing && landing[0] === r && landing[1] === c;
            return (
              <div
                key={idx}
                style={{
                  width: CELL,
                  height: CELL,
                  background: even ? CHESS_LIGHT : CHESS_DARK,
                  position: "relative",
                }}
              >
                {/* Preview destinations: glow ping */}
                {isPreview && (
                  <span
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ width: 36, height: 36 }}
                  >
                    <span
                      className="block rounded-full animate-ping"
                      style={{
                        width: 36,
                        height: 36,
                        background: `#fbbf2466`,
                        position: "absolute",
                        left: 0,
                        top: 0,
                      }}
                    />
                    <span
                      className="block rounded-full border-2"
                      style={{
                        width: 27,
                        height: 27,
                        borderColor: "#fbbf24",
                        boxShadow: `0 0 16px 1px #fbbf2490`,
                        position: "absolute",
                        left: 4.5,
                        top: 4.5,
                      }}
                    />
                  </span>
                )}
                {/* Landing cell pulse */}
                {isLanding && (
                  <span
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ width: 40, height: 40 }}
                  >
                    <span
                      className="block rounded-full animate-impact"
                      style={{
                        width: 40,
                        height: 40,
                        background: `#fbbf24cc`,
                        position: "absolute",
                        left: 0,
                        top: 0,
                      }}
                    />
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* SVG gradient for lines */}
        <svg width="0" height="0">
          <defs>
            <linearGradient id="line-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
          </defs>
        </svg>

        {/* preview lines */}
        {previewLines.length > 0 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {previewLines.map((d, i) => (
              <path
                key={i}
                d={d}
                stroke="url(#line-gradient)"
                strokeWidth={4}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="draw-thin-glow"
                style={{
                  filter: `drop-shadow(0 0 12px #8b5cf6) drop-shadow(0 0 6px #fbbf24)`,
                }}
              />
            ))}
          </svg>
        )}

        {/* active path during hop */}
        {pathLine && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <path
              d={pathLine}
              stroke="url(#line-gradient)"
              strokeWidth={6}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="hop-glow"
              style={{
                filter: `drop-shadow(0 0 20px #8b5cf6) drop-shadow(0 0 16px #fbbf24)`,
              }}
            />
          </svg>
        )}

        {/* knight */}
        <div
          className={`absolute transition-all`}
          style={{
            transitionProperty: "top, left",
            transitionDuration: `${stepMs}ms`,
            top: pos[0] * CELL,
            left: pos[1] * CELL,
            width: CELL,
            height: CELL,
            zIndex: 10,
          }}
        >
          <div
            className={
              "flex items-center justify-center w-full h-full drop-shadow-lg " +
              (jumping ? "animate-jump" : "")
            }
            style={{
              color: "#8b5cf6",
              filter: `drop-shadow(0 2px 12px #fbbf2499)`,
            }}
          >
            <KnightIcon className="w-14 h-14" />
          </div>
        </div>
      </div>

      <button
        onClick={replay}
        disabled={animating && !finished}
        className={`px-4 py-2 rounded-lg font-semibold mt-2 shadow transition ${
          animating && !finished
            ? "bg-gray-400 text-white opacity-60 cursor-not-allowed"
            : "bg-[#8b5cf6] text-white hover:bg-[#fbbf24] hover:text-[#0f172a]"
        }`}
        style={{
          minWidth: 100,
          border: `1.5px solid #b5886355`,
        }}
      >
        Replay
      </button>

      {/* Animations & Glow */}
      <style jsx global>{`
        .draw-thin-glow {
          stroke-dasharray: 500;
          stroke-dashoffset: 500;
          animation: dashDraw 1300ms cubic-bezier(0.61, 1.04, 0.76, 0.78)
              forwards,
            shimmer 1.8s infinite linear;
        }
        @keyframes dashDraw {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes shimmer {
          0% {
            filter: drop-shadow(0 0 12px #8b5cf6) drop-shadow(0 0 4px #fbbf24);
          }
          50% {
            filter: drop-shadow(0 0 16px #fbbf24) drop-shadow(0 0 7px #8b5cf6);
          }
          100% {
            filter: drop-shadow(0 0 12px #8b5cf6) drop-shadow(0 0 4px #fbbf24);
          }
        }
        .hop-glow {
          animation: hopFlash 0.6s cubic-bezier(0.72, 0.04, 0.26, 1.3);
        }
        @keyframes hopFlash {
          0% {
            opacity: 0.6;
          }
          60% {
            opacity: 1;
          }
          100% {
            opacity: 0.88;
          }
        }
        .animate-jump {
          animation: knightJump 0.7s cubic-bezier(0.62, -0.15, 0.55, 1.4);
        }
        @keyframes knightJump {
          0% {
            transform: scale(1) translateY(0);
          }
          25% {
            transform: scale(1.2) translateY(-22px) rotate(-12deg);
          }
          55% {
            transform: scale(0.94) translateY(2px);
          }
          80% {
            transform: scale(1.08) translateY(-6px);
          }
          100% {
            transform: scale(1) translateY(0);
          }
        }
        .animate-impact {
          animation: cellPulse 0.42s cubic-bezier(0.21, 1.19, 0.86, 0.93);
        }
        @keyframes cellPulse {
          0% {
            opacity: 0.9;
            transform: scale(0.7);
          }
          65% {
            opacity: 0.7;
            transform: scale(1.2);
          }
          100% {
            opacity: 0;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
