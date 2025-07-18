import { useParams } from '@tanstack/react-router';

export default function useGameId() {
  const { gameId } = useParams({ strict: false });

  if (!gameId) {
    throw new Error('Game ID is required');
  }

  return gameId;
}
