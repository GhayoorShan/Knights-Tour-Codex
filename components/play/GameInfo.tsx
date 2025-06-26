interface GameInfoProps {
  showVictory: boolean;
  showFailure: boolean;
  gameStarted: boolean;
  moveCount: number;
  boardSize: number;
  attempts: number;
  user: { user_id: string; username: string } | null;
  winTimeSeconds?: number;
}

export default function GameInfo({
  showVictory,
  showFailure,
  gameStarted,
  moveCount,
  boardSize,
  attempts,
  user,
}: GameInfoProps) {
  return (
    <div className="mt-3 text-lg text-black font-semibold min-h-[32px] flex flex-col gap-1 items-center">
      {user && (
        <span className="text-xs text-gray-500">Username: {user.username}</span>
      )}
      <span>Attempts: {attempts}</span>
      {showVictory ? (
        <span className="animate-pulse text-[var(--foreground)]">
          🎉 You completed the Knight's Tour!
        </span>
      ) : showFailure ? (
        <span className="text-[var(--primary)] animate-failshake">
          No more moves! Try again.
        </span>
      ) : !gameStarted ? (
        <>Click any square to start!</>
      ) : (
        <>
          Move: <span className="font-bold">{moveCount}</span> /{" "}
          {boardSize * boardSize}
        </>
      )}
    </div>
  );
}
