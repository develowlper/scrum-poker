import useGame from '../hooks/useGame';
import useGameId from '../hooks/useGameId';

export default function ResetGameButton() {
  const gameId = useGameId();

  const { resetGame } = useGame(gameId);

  return (
    <button onClick={() => resetGame()} className="btn btn-error">
      Reset
    </button>
  );
}
