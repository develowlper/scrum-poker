import useGame from '../../hooks/useGame';
import useGameId from '../../hooks/useGameId';

export default function Options() {
  const gameId = useGameId();

  if (!gameId) {
    throw new Error('Game ID is required');
  }

  const { showResults, hideResults, resultsShown, resetGame } = useGame(gameId);

  return (
    <div className="flex gap-2 items-center">
      <button
        className="btn btn-primary"
        onClick={() => showResults()}
        disabled={resultsShown}
      >
        Show Results
      </button>

      <button
        disabled={!resultsShown}
        className="btn btn-secondary"
        onClick={() => hideResults()}
      >
        Hide Results
      </button>
      <button onClick={() => resetGame()} className="btn btn-error">
        Reset
      </button>
    </div>
  );
}
