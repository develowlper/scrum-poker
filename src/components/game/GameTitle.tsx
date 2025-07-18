import useGame from '../../hooks/useGame';
import useGameId from '../../hooks/useGameId';
import usePlayer from '../../hooks/usePlayer';
import Headline from '../Headline';

const useHeadLineData = () => {
  const gameId = useGameId();

  if (!gameId) {
    throw new Error('Game ID is required');
  }

  const { game, isPending: isGamePending } = useGame(gameId);
  const { player, isPending: isPlayerPending } = usePlayer();

  return { game, player, isGamePending, isPlayerPending };
};

export default function GameTitle() {
  const { game, isGamePending, isPlayerPending } = useHeadLineData();

  if (isGamePending || isPlayerPending) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-2 items-center">
        <Headline className="text-3xl" text={`${game?.name}`} />
      </div>
    </div>
  );
}
