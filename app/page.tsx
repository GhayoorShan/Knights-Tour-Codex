"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

const BOARD_SIZES = [5, 6, 7, 8];

export default function HomePage() {
  const router = useRouter();
  const [size, setSize] = useState<number>(BOARD_SIZES[0]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/play/${size}x${size}`);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[var(--surface)] to-white">
      <h1 className="text-4xl font-bold mb-8 text-[--primary]">
        Knight's Tour Challenge
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 rounded-2xl border border-[color:var(--primary)/0.2] shadow-lg p-8 flex flex-col items-center gap-4"
      >
        <label htmlFor="size" className="font-medium text-lg text-black">
          Choose Board Size:
        </label>
        <select
          id="size"
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="border rounded px-4 py-2 text-lg text-black"
        >
          {BOARD_SIZES.map((s) => (
            <option key={s} value={s}>
              {s} x {s}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-[--primary] text-white px-8 py-2 rounded-xl font-semibold shadow mt-4 hover:brightness-110 transition"
        >
          Start Game
        </button>
      </form>
    </main>
  );
}
