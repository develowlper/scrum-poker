import { match } from 'ts-pattern';
import useGame from '../../hooks/useGame';
import useGameId from '../../hooks/useGameId';
import { CgChart, CgLock } from 'react-icons/cg';

export default function Options() {
  const gameId = useGameId();

  if (!gameId) {
    throw new Error('Game ID is required');
  }

  const { showResults, hideResults, resultsShown, game } = useGame(gameId);

  return (
    <div className="flex gap-2 items-center">
      {match(game?.show_results)
        .with(true, () => (
          <button
            disabled={!resultsShown}
            className="btn btn-secondary"
            onClick={() => hideResults()}
          >
            <CgLock />
            Hide Results
          </button>
        ))
        .otherwise(() => (
          <button
            className="btn btn-primary"
            onClick={() => showResults()}
            disabled={resultsShown}
          >
            <CgChart />
            Show Results
          </button>
        ))}
    </div>
  );
}
