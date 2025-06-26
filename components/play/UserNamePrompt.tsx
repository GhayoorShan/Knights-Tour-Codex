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
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        // Changed bg-white to bg-[var(--surface)] and text-black to text-[var(--foreground)]
        className="p-6 rounded-lg flex flex-col gap-4 bg-[var(--surface)] text-[var(--foreground)]"
        style={{
          boxShadow:
            "0 4px 10px var(--shadow-dark), inset 0 0 8px var(--shadow-light)",
        }}
      >
        <label className="text-xl font-semibold">Enter your Username</label>
        <input
          // Input border usually defaults well. You could add border-[var(--secondary)] if needed.
          // For placeholder text color, consider adding: placeholder-[var(--secondary)]
          className="border px-4 py-2 rounded text-lg"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your Name"
          autoFocus
        />
        <button
          // Changed button background to var(--foreground) and text to var(--background)
          className="bg-[var(--foreground)] text-[var(--background)] py-2 rounded font-semibold hover:brightness-110 transition-transform hover:scale-[1.04]"
          style={{
            boxShadow:
              "0 4px 10px var(--shadow-dark), inset 0 0 4px var(--shadow-light)",
          }}
          disabled={loading}
        >
          {loading ? "Registering..." : "Start Playing"}
        </button>
      </form>
    </div>
  );
}
