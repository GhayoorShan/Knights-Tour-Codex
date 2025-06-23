interface GameInfoProps {
  showVictory: boolean;
  showFailure: boolean;
  gameStarted: boolean;
  moveCount: number;
  boardSize: number;
}

export default function GameInfo({
  showVictory,
  showFailure,
  gameStarted,
  moveCount,
  boardSize,
}: GameInfoProps) {
  return (
    <div className="mt-3 text-lg text-black font-semibold min-h-[32px]">
      {showVictory ? (
        <span className="text-green-600 animate-pulse">
          🎉 You completed the Knight's Tour!
        </span>
      ) : showFailure ? (
        <span className="text-[#635AA3] animate-failshake">
          No more moves! Try again.
        </span>
      ) : !gameStarted ? (
        <>Click any square to start!</>
      ) : (
        <>
          Move: <span className="font-bold">{moveCount}</span> / {boardSize * boardSize}
        </>
      )}
    </div>
  );
}
