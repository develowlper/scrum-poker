import useGame from '../../hooks/useGame';
import useGameId from '../../hooks/useGameId';
import Headline from '../Headline';

const useHeadLineData = () => {
  const gameId = useGameId();

  if (!gameId) {
    throw new Error('Game ID is required');
  }

  const { game, isPending: isGamePending } = useGame(gameId);

  return { game, isGamePending };
};

export default function GameTitle() {
  const { game, isGamePending } = useHeadLineData();

  if (isGamePending) {
    return <div>Loading...</div>;
  }

  return <Headline className="text-3xl text-center" text={`${game?.name}`} />;
}
