import useGame from '../../hooks/useGame';
import useGameId from '../../hooks/useGameId';
import usePlayer from '../../hooks/usePlayer';
import Headline from '../Headline';
import GameOptions from './GameOptions';

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
    <div className="flex items-center gap-4">
      <div className="flex-1"></div>
      <Headline className="text-3xl" text={`${game?.name}`} />
      <div className="flex-1 flex justify-end">
        <GameOptions />
      </div>
    </div>
  );
}
