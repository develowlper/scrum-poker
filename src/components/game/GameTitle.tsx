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
  const { game, player, isGamePending, isPlayerPending } = useHeadLineData();

  if (isGamePending || isPlayerPending) {
    return <div>Loading...</div>;
  }

  return <Headline text={`Welcome ${player?.name} to game ${game?.name}`} />;
}
