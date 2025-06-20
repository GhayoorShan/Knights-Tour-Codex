"use client";

export type ConfettiParticle = {
  left: number;
  width: number;
  height: number;
  color: string;
  opacity: number;
  delay: number;
  rotate: number;
};

interface ConfettiBurstProps {
  particles: ConfettiParticle[];
}

export default function ConfettiBurst({ particles }: ConfettiBurstProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-40">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${p.left}%`,
            top: "25%",
            animation: `confetti-burst 1.1s cubic-bezier(.61,1.04,.76,.78)`,
            animationDelay: `${p.delay}s`,
            rotate: `${p.rotate}deg`,
          }}
        >
          <div
            style={{
              width: p.width,
              height: p.height,
              borderRadius: "60% 40% 40% 70%",
              background: p.color,
              opacity: p.opacity,
              boxShadow: `0 1px 8px #0001`,
            }}
          />
        </div>
      ))}
      <style>{`
        @keyframes confetti-burst {
          0% { transform: translateY(0) scale(1); }
          60% { transform: translateY(-60px) scale(1.06) rotate(-16deg); }
          100% { transform: translateY(120px) scale(0.88) rotate(13deg); }
        }
      `}</style>
    </div>
  );
}
