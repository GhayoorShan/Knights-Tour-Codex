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
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[var(--surface)] to-[var(--background)] text-[var(--foreground)]">
      <h1 className="text-4xl font-bold mb-8 text-[var(--primary)]">
        Knight's Tour Challenge
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-[var(--surface)] rounded-2xl border border-[var(--foreground)]/20 shadow-lg p-8 flex flex-col items-center gap-4"
      >
        <label
          htmlFor="size"
          className="font-medium text-lg text-[var(--foreground)]"
        >
          Choose Board Size:
        </label>
        <select
          id="size"
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="border rounded px-4 py-2 text-lg text-[var(--foreground)] bg-[var(--background)] border-[var(--secondary)]"
        >
          {BOARD_SIZES.map((s) => (
            <option key={s} value={s}>
              {s} x {s}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-[var(--primary)] text-[var(--background)] px-8 py-2 rounded-xl font-semibold mt-4 hover:brightness-125 transition"
        >
          Start Game
        </button>
      </form>
    </main>
  );
}
