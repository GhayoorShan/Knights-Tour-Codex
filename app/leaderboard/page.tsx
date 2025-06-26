"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LeaderboardPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchLeaderboard() {
      const { data, error } = await supabase
        .from("leaderboard")
        .select("*")
        .order("time_seconds", { ascending: true })
        .order("moves", { ascending: true })
        .limit(20);

      setRecords(data ?? []);
      setLoading(false);
      if (error) console.error(error);
    }
    fetchLeaderboard();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-br from-[var(--surface)] to-[var(--background)] text-[var(--foreground)]">
      {/* ─── Heading row with back button ─────────────────────────────── */}
      <div className="flex w-full max-w-2xl items-center justify-between mt-10 mb-6 px-2">
        <h1 className="text-4xl font-bold text-[var(--primary)]">
          🏆 Leaderboard
        </h1>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-[var(--primary)] hover:bg-[var(--primary)/0.1] transition"
          aria-label="Go back"
        >
          ← Back
        </button>
      </div>

      {/* ─── Table ───────────────────────────────────────────────────── */}
      <div className="bg-white/90 text-black rounded-2xl border border-[color:var(--primary)/0.2] shadow-lg p-8 w-full max-w-2xl">
        <table className="w-full text-lg">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Rank</th>
              <th className="py-2">Name</th>
              <th className="py-2">Board</th>
              <th className="py-2">Moves</th>
              <th className="py-2">Time&nbsp;(s)</th>
              <th className="py-2">Attempts</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && records.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6">
                  No records yet.
                </td>
              </tr>
            )}
            {!loading &&
              records.map((rec, idx) => (
                <tr key={rec.id} className="border-b hover:bg-gray-50">
                  <td className="py-2">{idx + 1}</td>
                  <td className="py-2">{rec.name}</td>
                  <td className="py-2">
                    {rec.board_size}×{rec.board_size}
                  </td>
                  <td className="py-2">{rec.moves}</td>
                  <td className="py-2">{rec.time_seconds}</td>
                  <td className="py-2">{rec.attempts}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
