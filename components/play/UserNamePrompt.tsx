"use client";
import React, { useState } from "react";
import { registerGuestUser } from "@/utils/guestUser";

export default function UserNamePrompt({
  onSave,
}: {
  onSave: (user: { user_id: string; username: string }) => void;
}) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    const user = await registerGuestUser(username.trim());
    setLoading(false);
    onSave(user);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 text-black flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-xl flex flex-col gap-4"
      >
        <label className="text-xl font-semibold">Enter your Username</label>
        <input
          className="border px-4 py-2 rounded text-lg"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your Name"
          autoFocus
        />
        <button
          className="bg-[var(--primary)] text-white py-2 rounded font-semibold hover:brightness-110"
          disabled={loading}
        >
          {loading ? "Registering..." : "Start Playing"}
        </button>
      </form>
    </div>
  );
}
